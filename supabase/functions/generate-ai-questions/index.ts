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

Make sure all questions are unique, conceptually sound, and test different aspects of the topic.`;

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
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4000,
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
        .replace(/"\s*:\s*"([^"]*)"C"\s*:/g, '": "$1°C":'); // Fix temperature symbols
      
      questions = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Failed to parse JSON:', jsonMatch[0]);
      return new Response(JSON.stringify({ error: 'Failed to parse AI response. Please try again.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate questions structure
    if (!Array.isArray(questions) || questions.length === 0) {
      console.error('Invalid questions format:', questions);
      return new Response(JSON.stringify({ error: 'Invalid questions format' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
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