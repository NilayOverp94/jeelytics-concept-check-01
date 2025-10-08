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

// Helper to call Lovable AI tool function and return parsed questions
const callAIForQuestions = async (
  {
    count,
    type,
    subject,
    topic,
    difficulty,
    systemPrompt,
    difficultyInstructions,
    apiKey,
  }: {
    count: number;
    type: 'mcq' | 'integer';
    subject: string;
    topic: string;
    difficulty: string;
    systemPrompt: string;
    difficultyInstructions: Record<string, string>;
    apiKey: string;
  }
): Promise<any[]> => {
  if (count <= 0) return [];

  const typeLine = type === 'mcq' ? `${count} MCQ questions (4 options A-D)` : `${count} INTEGER-type questions (answer is a single integer string, no options)`;

  const specificPrompt = `Create EXACTLY ${typeLine} for:
Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty.toUpperCase().replace('-', ' ')}

${difficultyInstructions[difficulty]}

STRICT requirements:
- Generate EXACTLY ${count} ${type === 'mcq' ? 'MCQ' : 'INTEGER'} questions.
- ${type === 'mcq' ? 'Each MCQ has exactly 4 options labeled A, B, C, D. Exactly 1 correctAnswer among A-D.' : 'Integer questions have NO options. correctAnswer must be a single integer string (e.g., "42"). Include a hint like "Answer is an integer" in the question text.'}
- Provide a clear and detailed explanation for the correctAnswer.
- Use simple inline HTML if needed (<sub>, <sup>). Avoid LaTeX fences.`;

  const toolName = type === 'mcq' ? 'return_mcq_questions' : 'return_integer_questions';

  const body: any = {
    model: 'google/gemini-2.5-flash',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: specificPrompt },
    ],
    tools: [
      {
        type: 'function',
        function: {
          name: toolName,
          description: `Return ${type === 'mcq' ? `${count} MCQ` : `${count} integer`} questions as structured JSON`,
          parameters: {
            type: 'object',
            properties: {
              questions: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['question', 'correctAnswer', 'explanation'],
                  properties: {
                    question: { type: 'string' },
                    questionType: { type: 'string', enum: [type] },
                    options: {
                      type: 'array',
                      description: 'Only present for MCQ; exactly 4 items labeled A-D',
                      items: {
                        type: 'object',
                        required: ['label', 'text'],
                        properties: {
                          label: { type: 'string', enum: ['A', 'B', 'C', 'D'] },
                          text: { type: 'string' },
                        },
                      },
                    },
                    correctAnswer: { type: 'string' },
                    explanation: { type: 'string' },
                  },
                },
              },
            },
            required: ['questions'],
          },
        },
      },
    ],
    tool_choice: { type: 'function', function: { name: toolName } },
  };

  const resp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const t = await resp.text();
    console.error('AI gateway error (segment):', resp.status, t);
    if (resp.status === 429) throw new Error('Rate limit exceeded');
    if (resp.status === 402) throw new Error('Credits exhausted');
    throw new Error('AI generation failed');
  }

  let json: any;
  try {
    json = await resp.json();
  } catch (e) {
    console.error('AI gateway parse error:', e);
    throw new Error('Malformed AI output');
  }
  const toolCall = json.choices?.[0]?.message?.tool_calls?.[0];
  const argsStr: string | undefined = toolCall?.function?.arguments;
  if (!argsStr) throw new Error('Invalid AI response format');

  let parsed: any;
  try { parsed = JSON.parse(argsStr); } catch { throw new Error('Malformed AI output'); }

  let qs: any[] = Array.isArray(parsed?.questions) ? parsed.questions : [];
  // Ensure type & structure
  qs = qs.map((q: any) => ({
    ...q,
    questionType: type,
    options: type === 'mcq' ? (Array.isArray(q?.options) ? q.options : []) : [],
  }));

  // Post-validate
  const validated: any[] = [];
  for (const q of qs) {
    if (!q?.question || !q?.correctAnswer || !q?.explanation) continue;
    if (type === 'mcq') {
      // Normalize options to exactly 4 A-D
      let opts = (q.options || []).slice(0, 4);
      if (opts.length < 4) continue;
      const labels = ['A', 'B', 'C', 'D'];
      opts = opts.map((o: any, i: number) => ({ label: labels[i], text: String(o?.text ?? o) }));
      // Ensure correctAnswer is one of A-D
      if (!labels.includes(String(q.correctAnswer).trim())) continue;
      validated.push({ ...q, options: opts, questionType: 'mcq' });
    } else {
      // Integer question: ensure correctAnswer is integer string
      if (!/^[-]?\d+$/.test(String(q.correctAnswer).trim())) continue;
      validated.push({ ...q, options: [], questionType: 'integer' });
    }
  }

  return validated.slice(0, count);
};

// Retry wrapper with batching and resilience
const perCallLimit = (difficulty: string, type: 'mcq' | 'integer') => {
  if (difficulty === 'jee-advanced') return 5; // keep batches small for complex outputs
  if (difficulty === 'jee-mains') return type === 'integer' ? 6 : 8;
  return 10;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const generateWithRetries = async (
  args: Parameters<typeof callAIForQuestions>[0],
  maxAttempts = 50 // allow many small batches within function time limit
): Promise<any[]> => {
  let collected: any[] = [];
  let attempts = 0;
  let consecutiveErrors = 0;

  while (collected.length < args.count && attempts < maxAttempts) {
    const remaining = args.count - collected.length;
    const toFetch = Math.min(remaining, perCallLimit(args.difficulty, args.type));

    try {
      const batch = await callAIForQuestions({ ...args, count: toFetch });
      collected = collected.concat(batch);
      consecutiveErrors = 0; // reset on success
    } catch (err) {
      console.error('Batch generation error:', err);
      consecutiveErrors++;
      if (consecutiveErrors >= 5) break; // avoid infinite failures
    }

    attempts++;
    // small backoff to avoid rate limits and model thrashing
    await sleep(300);
  }

  return collected.slice(0, args.count);
};

// Build segments (MCQ and/or Integer) and combine
const apiKey = LOVABLE_API_KEY!;

let mcqQuestions: any[] = [];
let integerQuestions: any[] = [];

if (shouldMixTypes) {
  const [mcqRes, intRes] = await Promise.all([
    generateWithRetries({ count: mcqCount, type: 'mcq', subject, topic, difficulty, systemPrompt, difficultyInstructions, apiKey }),
    generateWithRetries({ count: integerCount, type: 'integer', subject, topic, difficulty, systemPrompt, difficultyInstructions, apiKey }),
  ]);
  mcqQuestions = mcqRes;
  integerQuestions = intRes;
} else {
  mcqQuestions = await generateWithRetries({ count: questionCount, type: 'mcq', subject, topic, difficulty, systemPrompt, difficultyInstructions, apiKey });
}

const combined = [...mcqQuestions, ...integerQuestions];

// Final validation: ensure counts match expectations
if (shouldMixTypes) {
  const mcqs = combined.filter(q => q.questionType === 'mcq').length;
  const ints = combined.filter(q => q.questionType === 'integer').length;
  if (mcqs !== mcqCount || ints !== integerCount) {
    console.error(`Final mix mismatch: MCQ ${mcqs}/${mcqCount}, INT ${ints}/${integerCount}`);
    return new Response(JSON.stringify({ error: 'Failed to generate required mix (20 MCQ + 5 integer). Please try again.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
} else if (combined.length !== questionCount) {
  console.error(`Final count mismatch: got ${combined.length}, expected ${questionCount}`);
  return new Response(JSON.stringify({ error: `Failed to generate ${questionCount} questions. Please try again.` }), {
    status: 500,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

const withIds = combined.map((q: any, idx: number) => ({
  ...q,
  id: `ai_${Date.now()}_${idx}`,
  subject,
  topic,
}));

return new Response(JSON.stringify({ questions: withIds }), {
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
});
  } catch (e) {
    console.error("generate-ai-questions error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
