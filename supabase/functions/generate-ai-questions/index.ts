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
    const { subject, topic, questionCount = 5, difficulty = 'jee-mains' } = await req.json();

    // Determine question mix: for 25 questions in JEE levels, split into 20 MCQ + 5 integer
    const isJEE = difficulty === 'jee-mains' || difficulty === 'jee-advanced';
    const shouldMixTypes = questionCount === 25 && isJEE;
    const mcqCount = shouldMixTypes ? 20 : questionCount;
    const integerCount = shouldMixTypes ? 5 : 0;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(JSON.stringify({ error: "AI key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Define difficulty-specific instructions
    const difficultyInstructions: Record<string, string> = {
      'cbse': `CBSE CLASS 11-12 BOARD LEVEL (EASY):
- Very straightforward questions testing basic concept recall
- Direct formula application with simple numbers (e.g., F=ma with given values)
- Single-step problems with clear, obvious answers
- Questions similar to NCERT textbook exercises
- No tricky scenarios or concept integration required
- Example: "What is the SI unit of force?" or "Calculate speed if distance=100m and time=10s"`,
      
      'jee-mains': `JEE MAINS LEVEL (MODERATE):
- Moderate difficulty requiring 2-3 step reasoning
- Some conceptual depth beyond direct formula application
- Mix of numerical and concept-based questions
- May require choosing correct formula or approach
- Moderate calculations with standard values
- Example: Problems involving multiple concepts but standard approach`,
      
      'jee-advanced': `JEE ADVANCED LEVEL (EXTREMELY DIFFICULT):
- MUST be highly challenging and require advanced problem-solving
- Integrate 3+ concepts from different topics simultaneously
- Include non-standard scenarios that require creative thinking
- Use complex multi-step calculations with unusual conditions
- Include limiting cases, approximations, or advanced calculus where applicable
- Require deep conceptual understanding and analytical reasoning
- Should make students think for 3-5 minutes minimum
- Example: "A variable force F(x)=kx^2 acts on a particle of mass m in a viscous medium with drag coefficient b. Find work done when particle moves from x=0 to x=a if particle starts from rest"
- NO simple plug-and-play formulas allowed
- Must test ability to derive, analyze, and synthesize concepts`
    };

    const systemPrompt = `You are an expert JEE (Joint Entrance Examination) item writer with 20+ years of experience.
- You MUST generate EXACTLY the requested number of questions - no more, no less.
- Each question must match the specified difficulty level precisely.
- For JEE Advanced: Create truly challenging olympiad-level questions that integrate multiple advanced concepts.
- For CBSE: Create simple, straightforward questions testing basic understanding.
- Use simple inline HTML tags only when necessary (<sub>, <sup>, <em>, <strong>).
- Avoid LaTeX delimiters; prefer plain text or simple HTML for math; use x^2 and H2O or a<sup>2</sup> where needed.
- Explanations should be detailed, accurate, and contrast correct vs incorrect options.
- For integer type questions: Answer must be a single integer (no decimals, no ranges). Question should clearly state "Answer is an integer".`;

    let userPrompt: string;
    
    if (shouldMixTypes) {
      userPrompt = `CRITICAL: You MUST create EXACTLY ${mcqCount} MCQ questions AND ${integerCount} INTEGER type questions (total ${questionCount} questions).

Subject: ${subject}
Topic: ${topic}
Difficulty Level: ${difficulty.toUpperCase().replace('-', ' ')}

${difficultyInstructions[difficulty]}

STRICT Requirements:
- First ${mcqCount} questions MUST be MCQ type with exactly 4 options labeled A, B, C, D
- Last ${integerCount} questions MUST be INTEGER type (no options, answer is a single integer from 0-9999)
- For integer questions: Include "The answer is an integer" or similar phrase in the question text
- For integer questions: correctAnswer should be the integer as a string (e.g., "42")
- Provide clear, detailed explanations for all answers
- Vary sub-topics and match difficulty level precisely`;
    } else {
      userPrompt = `CRITICAL: You MUST create EXACTLY ${questionCount} MCQ questions.

Subject: ${subject}
Topic: ${topic}
Difficulty Level: ${difficulty.toUpperCase().replace('-', ' ')}

${difficultyInstructions[difficulty]}

STRICT Requirements:
- Generate EXACTLY ${questionCount} distinct MCQ questions
- Each question must have exactly 4 options labeled A, B, C, D
- Exactly 1 correct answer per question
- Provide a clear, detailed explanation for the correct answer
- Vary the sub-topics and question types within the specified difficulty level
- Match the difficulty level precisely - especially for JEE Advanced (make it VERY hard)`;
    }

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
            description: shouldMixTypes 
              ? `Return ${mcqCount} MCQ questions and ${integerCount} integer type questions.`
              : `Return ${questionCount} MCQ questions with 4 options each and explanations.`,
            parameters: {
              type: "object",
              properties: {
                questions: {
                  type: "array",
                  description: `Array of exactly ${questionCount} questions`,
                  items: {
                    type: "object",
                    required: ["question", "correctAnswer", "explanation"],
                    properties: {
                      question: { type: "string" },
                      questionType: { 
                        type: "string",
                        description: "Type of question: 'mcq' or 'integer'"
                      },
                      options: {
                        type: "array",
                        description: "Array of 4 options labeled A, B, C, D (only for MCQ type)",
                        items: {
                          type: "object",
                          required: ["label", "text"],
                          properties: {
                            label: { type: "string" },
                            text: { type: "string" },
                          },
                        },
                      },
                      correctAnswer: { type: "string" },
                      explanation: { type: "string" },
                    },
                  },
                },
              },
              required: ["questions"],
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
      console.error("No questions returned by AI");
      return new Response(JSON.stringify({ error: "No questions returned by AI" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate question count
    if (questions.length !== questionCount) {
      console.error(`Wrong number of questions: Expected ${questionCount}, got ${questions.length}`);
      return new Response(JSON.stringify({ 
        error: `AI generated ${questions.length} questions instead of ${questionCount}. Please try again.` 
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate and enrich
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const qType = q?.questionType || 'mcq';
      
      if (!q?.question || !q?.correctAnswer || !q?.explanation) {
        console.error(`Invalid question structure at index ${i}: missing required fields`, q);
        return new Response(JSON.stringify({ error: `Question ${i + 1} has invalid structure` }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      // For MCQ, validate options
      if (qType === 'mcq' && (!Array.isArray(q?.options) || q.options.length !== 4)) {
        console.error(`Invalid MCQ structure at index ${i}: missing or invalid options`, q);
        return new Response(JSON.stringify({ error: `MCQ Question ${i + 1} must have exactly 4 options` }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      // For integer type, ensure no options
      if (qType === 'integer') {
        q.options = []; // Clear options for integer type
      }
    }

    const withIds = questions.map((q: any, idx: number) => ({
      ...q,
      id: `ai_${Date.now()}_${idx}`,
      subject,
      topic,
      questionType: q.questionType || 'mcq', // Ensure questionType is set
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
