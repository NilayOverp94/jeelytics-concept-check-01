import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "list_pyqs",
  title: "List previous year questions",
  description:
    "Return the available previous-year question (PYQ) papers in JEElytics, grouped by exam and year, with links to open them in the app.",
  inputSchema: {
    exam: z
      .enum(["JEE Main", "JEE Advanced", "NDA", "CUET", "BITSAT"])
      .optional()
      .describe("Optional exam filter."),
    year: z.string().optional().describe("Optional year filter."),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async ({ exam, year }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return {
        content: [{ type: "text" as const, text: "Not authenticated" }],
        isError: true,
      };
    }

    const exams = [
      {
        name: "JEE Main",
        years: ["2025", "2024", "2023", "2022", "2021", "2020", "2019"],
      },
      {
        name: "JEE Advanced",
        years: ["2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010", "2009", "2008", "2007"],
      },
      {
        name: "NDA",
        years: ["2026", "2025", "2024", "2023", "2022", "2021"],
      },
      {
        name: "CUET",
        years: ["2025", "2024", "2023", "2022"],
      },
      {
        name: "BITSAT",
        years: ["2023", "2022", "2021", "2020", "2019"],
        note: "BITSAT does not release official papers; all information is memory-based.",
      },
    ];

    const filtered = exams
      .filter((e) => !exam || e.name === exam)
      .map((e) => ({
        ...e,
        years: year ? e.years.filter((y) => y === year) : e.years,
      }))
      .filter((e) => e.years.length > 0);

    const lines = filtered
      .map(
        (e) =>
          `- ${e.name}${e.note ? ` (${e.note})` : ""}: ${e.years.join(", ")}`
      )
      .join("\n");

    return {
      content: [
        {
          type: "text" as const,
          text: filtered.length
            ? `Available PYQ papers:\n${lines}\n\nOpen JEElytics and go to the PYQ section to view or download them.`
            : "No PYQ papers found for the selected filter.",
        },
      ],
      structuredContent: { exams: filtered },
    };
  },
});
