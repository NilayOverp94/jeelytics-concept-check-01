import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_profile",
  title: "Get user profile",
  description:
    "Read the signed-in user's JEElytics profile, XP, level, badges, and premium status.",
  inputSchema: undefined,
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async (_args, ctx) => {
    if (!ctx.isAuthenticated()) {
      return {
        content: [{ type: "text" as const, text: "Not authenticated" }],
        isError: true,
      };
    }
    const supabase = supabaseForUser(ctx);
    const userId = ctx.getUserId()!;

    const [{ data: profile }, { data: xp }, { data: badges }, { data: premium }] =
      await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
        supabase.from("user_xp").select("xp, level").eq("user_id", userId).maybeSingle(),
        supabase
          .from("user_badges")
          .select("badge_key, awarded_at")
          .eq("user_id", userId)
          .order("awarded_at", { ascending: false }),
        supabase.rpc("is_premium_user", { p_user_id: userId }),
      ]);

    const result = {
      profile,
      xp: xp ?? { xp: 0, level: 1 },
      badges: badges ?? [],
      isPremium: premium ?? false,
    };

    return {
      content: [
        {
          type: "text" as const,
          text: `Profile for ${profile?.display_name ?? ctx.getUserEmail()}: Level ${result.xp.level}, ${result.xp.xp} XP, Premium: ${result.isPremium}. Badges: ${result.badges.map((b) => b.badge_key).join(", ") || "none"}.`,
        },
      ],
      structuredContent: result,
    };
  },
});
