import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subject, topic } = await req.json();

    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY not found');
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Generating AI questions for ${subject} - ${topic}`);

    const prompt = `Generate 5 high-quality JEE (Joint Entrance Examination) multiple choice questions for ${subject} topic: ${topic}.

Each question should:
1. Be challenging and at JEE level difficulty
2. Have exactly 4 options (A, B, C, D)
3. Have only one correct answer
4. Include a detailed explanation for the correct answer
5. Be based on previous year question patterns or similar conceptual depth
6. Use only basic HTML tags like <sub>, <sup>, <em>, <strong> if needed for formatting

IMPORTANT: Return ONLY valid JSON. Do not include any markdown formatting, code blocks, or explanations outside the JSON.

Format the response as a JSON array with this exact structure:
[
  {
    "question": "Question text here",
    "options": [
      {"label": "A", "text": "Option A text"},
      {"label": "B", "text": "Option B text"},
      {"label": "C", "text": "Option C text"},
      {"label": "D", "text": "Option D text"}
    ],
    "correctAnswer": "A",
    "explanation": "Detailed explanation of why this answer is correct and why others are wrong"
  }
]

Topic: ${topic}
Subject: ${subject}

Make sure all questions are unique, conceptually sound, and test different aspects of the topic. Return ONLY the JSON array, nothing else.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8000,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      return new Response(JSON.stringify({ error: 'Failed to generate questions' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('Gemini API response:', JSON.stringify(data, null, 2));

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      console.error('No content generated from Gemini');
      return new Response(JSON.stringify({ error: 'No content generated' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extract JSON from the response (remove any markdown formatting)
    let jsonText = generatedText;
    
    // Remove markdown code blocks if present
    const codeBlockMatch = generatedText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1];
    }
    
    // Find JSON array
    const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('No JSON found in response:', generatedText);
      return new Response(JSON.stringify({ error: 'Invalid response format' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let questions;
    try {
      // Clean up common JSON issues before parsing
      let cleanJson = jsonMatch[0]
        .replace(/[\u201C\u201D]/g, '"') // Replace smart quotes
        .replace(/[\u2018\u2019]/g, "'") // Replace smart apostrophes
        .replace(/([^\\])\\([^"\\\/bfnrtu])/g, '$1\\\\$2') // Fix unescaped backslashes
        .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
        .replace(/"\s*:\s*"([^"]*)"C"\s*:/g, '": "$1°C":') // Fix temperature symbols
        .replace(/\n\s*/g, ' ') // Remove line breaks and extra spaces
        .replace(/"\s*:\s*"([^"]*)",\s*"([^"]*)":\s*"([^"]*)"/g, '": "$1", "$2": "$3"') // Fix malformed key-value pairs
        .trim();

      // Additional cleanup for common issues
      cleanJson = cleanJson
        .replace(/([^\\])\\n/g, '$1\\\\n') // Fix single backslash-n
        .replace(/([^\\])\\t/g, '$1\\\\t') // Fix single backslash-t
        .replace(/\\"([A-D])\\"/g, '"$1"') // Fix escaped option labels
        .replace(/,\s*}/g, '}') // Remove trailing commas before closing braces
        .replace(/,\s*]/g, ']'); // Remove trailing commas before closing brackets
      
      console.log('Attempting to parse cleaned JSON:', cleanJson.substring(0, 500) + '...');
      questions = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Failed to parse JSON:', jsonMatch[0].substring(0, 1000) + '...');
      
      // Try a more aggressive cleanup as fallback
      try {
        let aggressiveClean = jsonMatch[0]
          .replace(/```json|```/g, '') // Remove any remaining code blocks
          .replace(/[\u201C\u201D\u2018\u2019]/g, '"') // All smart quotes to regular quotes
          .replace(/\\(?!["\\/bfnrtu])/g, '\\\\') // Escape unescaped backslashes
          .replace(/,(\s*[}\]])/g, '$1') // Remove all trailing commas
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim();
        
        console.log('Attempting aggressive cleanup parse...');
        questions = JSON.parse(aggressiveClean);
        console.log('Aggressive cleanup successful!');
      } catch (aggressiveError) {
        console.error('Aggressive cleanup also failed:', aggressiveError);
        return new Response(JSON.stringify({ 
          error: 'Failed to parse AI response. The AI returned malformed JSON. Please try again.' 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Validate questions structure
    if (!Array.isArray(questions) || questions.length === 0) {
      console.error('Invalid questions format:', questions);
      return new Response(JSON.stringify({ 
        error: 'Invalid questions format received from AI. Please try again.' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate each question has the required structure
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || !q.correctAnswer || !q.explanation) {
        console.error(`Question ${i + 1} has invalid structure:`, q);
        return new Response(JSON.stringify({ 
          error: `Question ${i + 1} has invalid structure. Please try again.` 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Validate options structure
      for (let j = 0; j < q.options.length; j++) {
        const opt = q.options[j];
        if (!opt.label || !opt.text) {
          console.error(`Question ${i + 1}, option ${j + 1} has invalid structure:`, opt);
          return new Response(JSON.stringify({ 
            error: `Question ${i + 1} has malformed options. Please try again.` 
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }
    }
    
    // Add unique IDs to questions for tracking
    const questionsWithIds = questions.map((q: any, index: number) => ({
      ...q,
      id: `ai_${Date.now()}_${index}`,
      topic,
      subject
    }));

    console.log(`Generated ${questionsWithIds.length} AI questions successfully`);

    return new Response(JSON.stringify({ questions: questionsWithIds }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-ai-questions function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});