import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_test_history",
  title: "Get test history",
  description:
    "Fetch the signed-in user's recent JEElytics test results with scores, subjects, topics, and dates.",
  inputSchema: {
    limit: z
      .number()
      .int()
      .optional()
      .describe("Maximum number of recent tests to return (default 10, max 50)."),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async ({ limit = 10 }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return {
        content: [{ type: "text" as const, text: "Not authenticated" }],
        isError: true,
      };
    }
    const safeLimit = Math.max(1, Math.min(50, Number(limit) || 10));
    const supabase = supabaseForUser(ctx);
    const userId = ctx.getUserId()!;

    const { data, error } = await supabase
      .from("test_results")
      .select("id, subject, topic, score, total_questions, time_spent, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(safeLimit);

    if (error) {
      return {
        content: [{ type: "text" as const, text: `Failed to fetch test history: ${error.message}` }],
        isError: true,
      };
    }

    const results = data ?? [];
    const summary = results
      .map(
        (r) =>
          `- ${r.subject} / ${r.topic}: ${r.score}/${r.total_questions} (${Math.round((r.score / r.total_questions) * 100)}%) on ${new Date(r.created_at).toLocaleDateString()}`
      )
      .join("\n");

    return {
      content: [
        {
          type: "text" as const,
          text: results.length
            ? `Recent tests:\n${summary}`
            : "No test history found yet.",
        },
      ],
      structuredContent: { results },
    };
  },
});
