import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_weak_chapters",
  title: "Get weak chapters",
  description:
    "Analyze the signed-in user's recent test results and return the subjects and chapters where they score lowest.",
  inputSchema: {
    subject: z
      .enum(["Physics", "Chemistry", "Mathematics"])
      .optional()
      .describe("Optional subject filter."),
    min_tests: z
      .number()
      .int()
      .optional()
      .describe("Minimum number of tests on a topic before it is considered (default 1)."),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async ({ subject, min_tests = 1 }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return {
        content: [{ type: "text" as const, text: "Not authenticated" }],
        isError: true,
      };
    }
    const supabase = supabaseForUser(ctx);
    const userId = ctx.getUserId()!;

    let query = supabase
      .from("test_results")
      .select("subject, topic, score, total_questions, created_at")
      .eq("user_id", userId);

    if (subject) {
      query = query.eq("subject", subject);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      return {
        content: [{ type: "text" as const, text: `Failed to fetch results: ${error.message}` }],
        isError: true,
      };
    }

    const rows = data ?? [];
    const byTopic: Record<
      string,
      { subject: string; topic: string; total: number; correct: number; tests: number }
    > = {};

    for (const r of rows) {
      const key = `${r.subject}::${r.topic}`;
      if (!byTopic[key]) {
        byTopic[key] = {
          subject: r.subject,
          topic: r.topic,
          total: 0,
          correct: 0,
          tests: 0,
        };
      }
      byTopic[key].total += r.total_questions;
      byTopic[key].correct += r.score;
      byTopic[key].tests += 1;
    }

    const weak = Object.values(byTopic)
      .filter((t) => t.tests >= min_tests)
      .map((t) => ({
        ...t,
        percentage: t.total > 0 ? Math.round((t.correct / t.total) * 100) : 0,
      }))
      .sort((a, b) => a.percentage - b.percentage)
      .slice(0, 10);

    const summary = weak
      .map(
        (t) =>
          `- ${t.subject} / ${t.topic}: ${t.percentage}% correct over ${t.tests} test(s)`
      )
      .join("\n");

    return {
      content: [
        {
          type: "text" as const,
          text: weak.length
            ? `Weakest chapters:\n${summary}`
            : "Not enough test data to identify weak chapters yet.",
        },
      ],
      structuredContent: { weak_chapters: weak },
    };
  },
});
