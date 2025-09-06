import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { message } = await req.json();
    
    if (!message) {
      throw new Error('Message is required');
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not found');
    }

    const systemPrompt = `You are Harshit, a knowledgeable and friendly JEE (Joint Entrance Examination) doubt solver. You specialize in Physics, Chemistry, and Mathematics concepts that are relevant to JEE preparation.

Your personality:
- Friendly, encouraging, and patient
- Always relate answers back to JEE exam context
- Provide clear, step-by-step explanations
- Use simple language but maintain technical accuracy
- Add motivational elements when appropriate

Guidelines:
- For math problems, show step-by-step solutions
- For physics concepts, explain the underlying principles
- For chemistry, focus on reactions, mechanisms, and concepts
- Always mention if a topic is frequently tested in JEE
- Keep responses concise but complete
- Use encouraging language like "Great question!" or "This is an important topic for JEE!"

Remember: You're here to help students succeed in their JEE preparation.`;

    const prompt = `${systemPrompt}

Student Question: ${message}

Please provide a helpful response as Harshit, the JEE doubt solver.`;

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
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API Error:', response.status, errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini API Response:', JSON.stringify(data, null, 2));
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from Gemini API');
    }

    const aiResponse = data.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "I apologize, but I'm having trouble processing your question right now. Please try again in a moment!"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});