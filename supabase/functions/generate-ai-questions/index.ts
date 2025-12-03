import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Using Lovable AI Gateway
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
- IMPORTANT: Keep explanations SHORT and CONCISE (2-4 sentences max). Just state the key concept/formula used and the solution steps briefly.
- For integer type questions: Answer must be a single integer (no decimals, no ranges). Question should clearly state "Answer is an integer".`;

    // Helper to call Lovable AI Gateway with tool calling and return parsed questions
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
- Keep explanation SHORT (2-4 sentences). State the formula/concept and key steps only.
- Use simple inline HTML if needed (<sub>, <sup>). Avoid LaTeX fences.`;

      const toolName = type === 'mcq' ? 'return_mcq_questions' : 'return_integer_questions';

      // Build OpenAI-compatible request body with tool calling
      const body: any = {
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: specificPrompt }
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
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: toolName } },
        temperature: 0.5,
        top_p: 0.9,
      };

      const resp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(body),
      });

      if (!resp.ok) {
        const t = await resp.text();
        console.error('Lovable AI Gateway error (segment):', resp.status, t);
        if (resp.status === 429) throw new Error('Rate limit exceeded');
        if (resp.status === 402) throw new Error('Payment required - please add credits');
        throw new Error('AI generation failed');
      }

      let json: any;
      let raw: string;
      try {
        raw = await resp.text();
      } catch (e) {
        console.error('Lovable AI Gateway read error:', e);
        throw new Error('AI response read failed');
      }
      if (!raw || !raw.trim()) {
        console.error('Lovable AI Gateway returned empty body');
        throw new Error('Empty AI response');
      }
      try {
        json = JSON.parse(raw);
      } catch (e) {
        console.error('Lovable AI Gateway parse error. Raw (first 500 chars):', raw.slice(0, 500));
        throw new Error('Malformed AI output');
      }

      // Parse OpenAI-compatible response format
      const choice = json.choices?.[0];
      const toolCall = choice?.message?.tool_calls?.[0];
      
      if (!toolCall || toolCall.function?.name !== toolName) {
        console.warn('No tool call in response, attempting content fallback');
        const content = choice?.message?.content;
        console.log('Content preview:', content?.slice(0, 300));
        
        if (content) {
          // Try multiple parsing approaches
          let parsed: any = null;
          
          // Approach 1: JSON code block
          const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
          if (codeBlockMatch) {
            try { parsed = JSON.parse(codeBlockMatch[1]); } catch {}
          }
          
          // Approach 2: Find JSON array directly
          if (!parsed) {
            const arrayMatch = content.match(/\[\s*\{[\s\S]*\}\s*\]/);
            if (arrayMatch) {
              try { parsed = { questions: JSON.parse(arrayMatch[0]) }; } catch {}
            }
          }
          
          // Approach 3: Find JSON object with questions
          if (!parsed) {
            const objMatch = content.match(/\{[\s\S]*"questions"\s*:\s*\[[\s\S]*\][\s\S]*\}/);
            if (objMatch) {
              try { parsed = JSON.parse(objMatch[0]); } catch {}
            }
          }
          
          if (parsed && Array.isArray(parsed?.questions)) {
            console.log('Fallback: Extracted', parsed.questions.length, 'questions from content');
            let qs = parsed.questions.map((q: any) => ({
              ...q,
              questionType: type,
              options: type === 'mcq' ? (Array.isArray(q?.options) ? q.options : []) : [],
            }));
            return validateQuestions(qs, type, count);
          }
        }
        console.error('Could not parse AI response content');
        throw new Error('Invalid AI response format');
      }

      let argsObj: any;
      try {
        argsObj = typeof toolCall.function.arguments === 'string' 
          ? JSON.parse(toolCall.function.arguments) 
          : toolCall.function.arguments;
      } catch (e) {
        console.error('Failed to parse tool arguments:', e);
        throw new Error('Invalid tool arguments format');
      }
      
      let qs: any[] = Array.isArray(argsObj?.questions) ? argsObj.questions : [];
      
      // Ensure type & structure
      qs = qs.map((q: any) => ({
        ...q,
        questionType: type,
        options: type === 'mcq' ? (Array.isArray(q?.options) ? q.options : []) : [],
      }));

      return validateQuestions(qs, type, count);
    };

    // Validation helper extracted for reuse
    const validateQuestions = (qs: any[], type: 'mcq' | 'integer', count: number): any[] => {
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

    // Simplified: Generate all questions in a single API call to avoid worker timeout
    const generateQuestions = async (
      args: Parameters<typeof callAIForQuestions>[0]
    ): Promise<any[]> => {
      console.log(`Generating ${args.count} ${args.type} questions for ${args.subject}/${args.topic} (${args.difficulty})`);

      try {
        const questions = await callAIForQuestions(args);
        console.log(`Generated ${questions.length}/${args.count} ${args.type} questions`);
        return questions;
      } catch (err) {
        console.error(`Generation error:`, err);
        return [];
      }
    };

    // Build segments (MCQ and/or Integer) and combine
    const apiKey = LOVABLE_API_KEY!;

    let mcqQuestions: any[] = [];
    let integerQuestions: any[] = [];

    if (shouldMixTypes) {
      // Generate MCQs in 2 batches of 10 + integers in parallel for reliability
      console.log('Generating MCQs (2 batches) and integers in parallel');
      const [mcqs1, mcqs2, ints] = await Promise.all([
        generateQuestions({ count: 10, type: 'mcq', subject, topic, difficulty, systemPrompt, difficultyInstructions, apiKey }),
        generateQuestions({ count: 10, type: 'mcq', subject, topic, difficulty, systemPrompt, difficultyInstructions, apiKey }),
        generateQuestions({ count: integerCount, type: 'integer', subject, topic, difficulty, systemPrompt, difficultyInstructions, apiKey })
      ]);
      mcqQuestions = [...mcqs1, ...mcqs2];
      integerQuestions = ints;
      console.log(`MCQ batches: ${mcqs1.length} + ${mcqs2.length}, Integers: ${ints.length}`);
    } else {
      mcqQuestions = await generateQuestions({ count: questionCount, type: 'mcq', subject, topic, difficulty, systemPrompt, difficultyInstructions, apiKey });
    }

    const combined = [...mcqQuestions, ...integerQuestions];

    // Final validation: return partial results with warning instead of hard failure
    if (shouldMixTypes) {
      const mcqs = combined.filter(q => q.questionType === 'mcq').length;
      const ints = combined.filter(q => q.questionType === 'integer').length;
      if (mcqs !== mcqCount || ints !== integerCount) {
        console.error(`Final mix mismatch: MCQ ${mcqs}/${mcqCount}, INT ${ints}/${integerCount}`);
        
        // Return partial results with warning
        if (combined.length > 0) {
          const withIds = combined.map((q: any, idx: number) => ({
            ...q,
            id: `ai_${Date.now()}_${idx}`,
            subject,
            topic,
          }));
          
          return new Response(JSON.stringify({ 
            questions: withIds,
            warning: `Generated ${mcqs} MCQ and ${ints} integer questions (requested ${mcqCount} + ${integerCount}). Please retry for full set.`
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        return new Response(JSON.stringify({ error: 'Failed to generate required mix (20 MCQ + 5 integer). Please try again.' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } else if (combined.length !== questionCount) {
      console.error(`Final count mismatch: got ${combined.length}, expected ${questionCount}`);
      
      // Return partial results with warning
      if (combined.length > 0) {
        const withIds = combined.map((q: any, idx: number) => ({
          ...q,
          id: `ai_${Date.now()}_${idx}`,
          subject,
          topic,
        }));
        
        return new Response(JSON.stringify({ 
          questions: withIds,
          warning: `Generated ${combined.length} of ${questionCount} questions. Please retry for full set.`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ error: `Failed to generate ${questionCount} questions. Please try again.` }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Success path
    const withIds = combined.map((q: any, idx: number) => ({
      ...q,
      id: `ai_${Date.now()}_${idx}`,
      subject,
      topic,
    }));

    return new Response(JSON.stringify({ questions: withIds }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating questions:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Please try again or contact support if the issue persists.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
