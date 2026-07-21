import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "submit_answer",
  title: "Submit a test answer",
  description:
    "Submit an answer for the current question in an active MCP test session. Returns whether it was correct, the explanation, and the next question or final score.",
  inputSchema: {
    session_id: z.string().uuid().describe("The test session ID returned by start_test."),
    answer: z.string().min(1).describe("The selected option label (e.g. 'A') or integer answer."),
  },
  annotations: {
    readOnlyHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  handler: async ({ session_id, answer }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return {
        content: [{ type: "text" as const, text: "Not authenticated" }],
        isError: true,
      };
    }
    const supabase = supabaseForUser(ctx);
    const userId = ctx.getUserId()!;

    const { data: session, error: fetchError } = await supabase
      .from("test_sessions")
      .select("*")
      .eq("id", session_id)
      .eq("user_id", userId)
      .eq("status", "active")
      .single();

    if (fetchError || !session) {
      return {
        content: [
          { type: "text" as const, text: "Test session not found or already finished." },
        ],
        isError: true,
      };
    }

    const questions = session.questions as any[];
    const currentIdx = session.current_index;
    const currentQuestion = questions[currentIdx];
    const correctAnswer = (session.correct_answers as string[])[currentIdx];
    const isCorrect = answer.trim().toUpperCase() === correctAnswer.trim().toUpperCase();

    const userAnswers = [...(session.user_answers as string[])];
    userAnswers[currentIdx] = answer.trim();

    const newScore = session.score + (isCorrect ? 1 : 0);
    const nextIndex = currentIdx + 1;
    const isFinished = nextIndex >= questions.length;

    const { error: updateError } = await supabase
      .from("test_sessions")
      .update({
        user_answers: userAnswers,
        current_index: isFinished ? currentIdx : nextIndex,
        score: newScore,
        status: isFinished ? "finished" : "active",
        finished_at: isFinished ? new Date().toISOString() : null,
      })
      .eq("id", session_id);

    if (updateError) {
      return {
        content: [
          { type: "text" as const, text: `Failed to save answer: ${updateError.message}` },
        ],
        isError: true,
      };
    }

    // Save final result and award XP when finished
    if (isFinished) {
      const { error: resultError } = await supabase.from("test_results").insert({
        user_id: userId,
        subject: session.subject,
        topic: session.topic,
        score: newScore,
        total_questions: questions.length,
        time_spent: 0,
        questions: questions,
        user_answers: userAnswers,
        correct_answers: session.correct_answers,
      });

      if (!resultError) {
        // Award XP: 10 base + 2 per correct answer
        await supabase.rpc("award_xp", { p_amount: 10 + newScore * 2 });
      }

      return {
        content: [
          {
            type: "text" as const,
            text: `Test complete! Score: ${newScore}/${questions.length} (${Math.round((newScore / questions.length) * 100)}%).\n\nLast question explanation: ${currentQuestion.explanation}`,
          },
        ],
        structuredContent: {
          finished: true,
          score: newScore,
          total_questions: questions.length,
          percentage: Math.round((newScore / questions.length) * 100),
        },
      };
    }

    const nextQuestion = questions[nextIndex];
    const optionsText = nextQuestion.options
      .map((o: any) => `${o.label}. ${o.text}`)
      .join("\n");

    return {
      content: [
        {
          type: "text" as const,
          text: `${isCorrect ? "Correct" : "Incorrect"}. ${currentQuestion.explanation}\n\nQuestion ${nextIndex + 1} of ${questions.length}:\n${nextQuestion.question}\n\n${optionsText}`,
        },
      ],
      structuredContent: {
        finished: false,
        was_correct: isCorrect,
        question_number: nextIndex + 1,
        total_questions: questions.length,
        question: nextQuestion,
      },
    };
  },
});
