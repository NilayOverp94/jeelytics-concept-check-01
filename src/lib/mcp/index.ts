import { auth, defineMcp, setLogLevel } from "@lovable.dev/mcp-js";

import getProfileTool from "./tools/get-profile";
import getTestHistoryTool from "./tools/get-test-history";
import getWeakChaptersTool from "./tools/get-weak-chapters";
import listPyqsTool from "./tools/list-pyqs";
import startTestTool from "./tools/start-test";
import submitAnswerTool from "./tools/submit-answer";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";
const mcpResource = `https://${projectRef}.supabase.co/functions/v1/mcp`;

setLogLevel("info");

export default defineMcp({
  name: "jeelytics-mcp",
  title: "JEElytics MCP",
  version: "1.0.0",
  instructions:
    "JEElytics MCP server. Use these tools to help JEE aspirants practice tests, review weak chapters, and access previous-year papers through voice or chat assistants. To start a test, call start_test with subject, topic, and optional difficulty. Then use submit_answer with the session_id to answer each question.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    resource: mcpResource,
    acceptedAudiences: "authenticated",
    resourceName: "JEElytics MCP",
    resourceDocumentation: "https://jeelytics-concept-check-01.lovable.app/founder",
  }),
  tools: [
    getProfileTool,
    getTestHistoryTool,
    getWeakChaptersTool,
    listPyqsTool,
    startTestTool,
    submitAnswerTool,
  ],
});
