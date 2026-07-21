import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

const QuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(z.object({ label: z.string(), text: z.string() })),
  correctAnswer: z.string(),
  explanation: z.string(),
  topic: z.string(),
  subject: z.string(),
  questionType: z.enum(["mcq", "integer"]).optional(),
});

export default defineTool({
  name: "start_test",
  title: "Start a JEE practice test",
  description:
    "Start a new JEElytics practice test for the signed-in user on a subject and topic. Generates AI questions, creates a test session, and returns the first question. Defaults to 5 questions to stay within client timeouts.",
  inputSchema: {
    subject: z
      .enum(["Physics", "Chemistry", "Mathematics"])
      .describe("Subject for the test."),
    topic: z.string().describe("Topic within the subject."),
    difficulty: z
      .enum(["cbse", "jee-mains", "jee-advanced"])
      .optional()
      .describe("Difficulty level (default jee-mains)."),
    question_count: z
      .number()
      .int()
      .optional()
      .describe("Number of questions (default 5, max 10 for MCP)."),
  },
  annotations: {
    readOnlyHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async ({ subject, topic, difficulty = "jee-mains", question_count = 5 }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return {
        content: [{ type: "text" as const, text: "Not authenticated" }],
        isError: true,
      };
    }

    const trimmedTopic = topic?.trim();
    if (!trimmedTopic) {
      return {
        content: [{ type: "text" as const, text: "Topic is required to start a test." }],
        isError: true,
      };
    }
    const safeQuestionCount = Math.max(1, Math.min(10, Number(question_count) || 5));

    const supabase = supabaseForUser(ctx);
    const userId = ctx.getUserId()!;

    // Check test limits
    const { data: canTake, error: canError } = await supabase.rpc("can_take_test", {
      p_user_id: userId,
    });
    if (canError || !canTake) {
      return {
        content: [
          {
            type: "text" as const,
            text: "You have reached your free monthly test limit. Upgrade to premium or try again next month.",
          },
        ],
        isError: true,
      };
    }

    // Generate questions via the existing edge function first so a generation failure does not consume a test attempt.
    let questions: z.infer<typeof QuestionSchema>[] = [];
    try {
      const { data, error } = await supabase.functions.invoke("generate-ai-questions", {
        body: { subject, topic: trimmedTopic, questionCount: safeQuestionCount, difficulty },
      });
      if (error) {
        throw new Error(typeof error === "string" ? error : error.message || "Question generation failed");
      }
      const parsed = z.object({ questions: z.array(QuestionSchema) }).safeParse(data);
      if (!parsed.success) {
        throw new Error("Generated questions had an unexpected format");
      }
      questions = parsed.data.questions;
      if (!questions.length) {
        throw new Error("No questions were generated");
      }
    } catch (err: any) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Failed to generate questions: ${err?.message ?? "Unknown error"}. Please try again or start the test directly in the JEElytics app.`,
          },
        ],
        isError: true,
      };
    }

    // Increment daily test count only after questions are ready
    const { error: incError } = await supabase.rpc("increment_daily_test_count", {
      p_user_id: userId,
    });
    if (incError) {
      return {
        content: [
          { type: "text" as const, text: `Could not start test: ${incError.message}` },
        ],
        isError: true,
      };
    }

    // Create session
    const { data: session, error: sessionError } = await supabase
      .from("test_sessions")
      .insert({
        user_id: userId,
        subject,
        topic: trimmedTopic,
        difficulty,
        question_count: safeQuestionCount,
        questions,
        correct_answers: questions.map((q) => q.correctAnswer),
        user_answers: new Array(questions.length).fill(""),
        status: "active",
      })
      .select("id")
      .single();

    if (sessionError || !session) {
      return {
        content: [
          { type: "text" as const, text: `Could not create test session: ${sessionError?.message ?? "unknown error"}` },
        ],
        isError: true,
      };
    }

    const first = questions[0];
    const optionsText = first.options
      .map((o) => `${o.label}. ${o.text}`)
      .join("\n");

    return {
      content: [
        {
          type: "text" as const,
          text: `Test started (${questions.length} questions).\n\nQuestion 1 of ${questions.length}:\n${first.question}\n\n${optionsText}\n\nUse submit_answer with session_id "${session.id}" and your chosen option label (e.g. "A") or integer answer.`,
        },
      ],
      structuredContent: {
        session_id: session.id,
        question_number: 1,
        total_questions: questions.length,
        question: first,
      },
    };
  },
});
