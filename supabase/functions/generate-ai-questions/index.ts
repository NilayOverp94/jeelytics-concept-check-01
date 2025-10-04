import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// We now use Lovable AI Gateway with Google Gemini 2.5 (flash) for reliable JSON via tool-calling
// LOVABLE_API_KEY is provided as a Supabase secret automatically
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subject, topic } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(JSON.stringify({ error: "AI key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are an expert JEE (Joint Entrance Examination) item writer.
- Always produce conceptually sound, unique, JEE-level multiple-choice questions.
- Use simple inline HTML tags only when necessary (<sub>, <sup>, <em>, <strong>).
- Avoid LaTeX delimiters; prefer plain text or simple HTML for math; use x^2 and H2O or a<sup>2</sup> where needed.
- Explanations should be concise, accurate, and contrast correct vs incorrect options.`;

    const userPrompt = `Create 5 multiple-choice questions for Subject: ${subject} | Topic: ${topic}.
Requirements:
- Exactly 4 options labeled A, B, C, D
- Exactly 1 correct answer
- Provide a clear explanation for the correct answer
- Vary the sub-topics and difficulty within JEE standards`;

    const body: any = {
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "return_questions",
            description: "Return 5 JEE MCQ questions with 4 options each and explanations.",
            parameters: {
              type: "object",
              properties: {
                questions: {
                  type: "array",
                  minItems: 5,
                  maxItems: 5,
                  items: {
                    type: "object",
                    additionalProperties: false,
                    required: ["question", "options", "correctAnswer", "explanation"],
                    properties: {
                      question: { type: "string" },
                      options: {
                        type: "array",
                        minItems: 4,
                        maxItems: 4,
                        items: {
                          type: "object",
                          additionalProperties: false,
                          required: ["label", "text"],
                          properties: {
                            label: { type: "string", enum: ["A", "B", "C", "D"] },
                            text: { type: "string" },
                          },
                        },
                      },
                      correctAnswer: { type: "string", enum: ["A", "B", "C", "D"] },
                      explanation: { type: "string" },
                    },
                  },
                },
              },
              required: ["questions"],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "return_questions" } },
    };

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait and try again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const json = await response.json();
    // OpenAI-compatible: extract tool call with the structured arguments
    const toolCall = json.choices?.[0]?.message?.tool_calls?.[0];
    const argsStr: string | undefined = toolCall?.function?.arguments;

    if (!argsStr) {
      console.error("No tool call / arguments returned:", JSON.stringify(json));
      return new Response(JSON.stringify({ error: "Invalid AI response format" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let parsed;
    try {
      parsed = JSON.parse(argsStr);
    } catch (e) {
      console.error("Failed to parse tool arguments:", e, argsStr?.slice(0, 500));
      return new Response(JSON.stringify({ error: "Malformed AI output" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const questions = parsed?.questions;
    if (!Array.isArray(questions) || questions.length === 0) {
      return new Response(JSON.stringify({ error: "No questions returned by AI" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate and enrich
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q?.question || !Array.isArray(q?.options) || q.options.length !== 4 || !q?.correctAnswer || !q?.explanation) {
        console.error(`Invalid question structure at index ${i}:`, q);
        return new Response(JSON.stringify({ error: `Question ${i + 1} has invalid structure` }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const withIds = questions.map((q: any, idx: number) => ({
      ...q,
      id: `ai_${Date.now()}_${idx}`,
      subject,
      topic,
    }));

    return new Response(JSON.stringify({ questions: withIds }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-ai-questions error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
