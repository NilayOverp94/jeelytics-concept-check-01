import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const AVAILABLE_LECTURES = {
  Mathematics: [
    'Vectors', 'Matrices', 'Basic Math', 'Determinants', 'Quadratic Equations',
    'Sequence and Series', '3D Geometry', 'Binomial Theorem', 'Relations & Functions',
    'Permutation & Combination', 'Inverse Trigonometric Functions', 'Trigonometric Functions & Equations',
    'Straight Lines', 'Definite Integration', 'Circles', 'Limits, Continuity & Differentiability',
    'Parabola', 'Application of Derivatives', 'Hyperbola', 'Complex Numbers', 'Statistics',
    'Differential Equations', 'Probability', 'Methods of Differentiation', 'Indefinite Integration',
    'Ellipse', 'Area Under Curves', 'Sets'
  ],
  Physics: [
    'Basic Maths', 'Electric Charges and Fields', 'Motion in a Straight Line',
    'Electric Potential, Dipole & Conductor', 'Motion in a Plane', 'Capacitor',
    'Laws of Motion', 'Current Electricity', 'Work, Energy & Power', 'Magnetism',
    'Circular Motion', 'Electromagnetic Induction', 'Alternating Current',
    'Rotational Motion', 'Modern Physics', 'Gravitation',
    'Mechanical Properties of Solids & Fluid', 'KTG & Thermodynamics', 'Optics',
    'Thermal Properties of Matter', 'Oscillations', 'Waves', 'Wave Optics',
    'Electromagnetic Waves', 'Centre of Mass', 'Semiconductor'
  ],
  Chemistry: [
    'Periodic Table', 'Chemical Bonding', 'Coordination Compound', 'P-Block',
    'D and F Block', 'Salt Analysis', 'Mole Concept', 'Atomic Structure (States of Matter)',
    'Thermodynamics & Thermochemistry', 'Solution', 'Redox', 'Electrochemistry',
    'Thermodynamics', 'Chemical Equilibrium', 'Ionic Equilibrium', 'Chemical Kinetics',
    'Structure of Atoms', 'IUPAC Nomenclature', 'GOC', 'Isomerism', 'Hydrocarbon',
    'Haloalkanes and Haloarenes', 'Alcohol, Phenol and Ethers',
    'Aldehydes, Ketones and Carboxylic Acids', 'Amines', 'Biomolecules'
  ]
};

const AVAILABLE_TOPICS = {
  Physics: ['Mechanics', 'Thermodynamics', 'Waves & Oscillations', 'Optics', 
    'Electricity & Magnetism', 'Modern Physics', 'Current Electricity',
    'Electromagnetic Induction', 'AC Circuits', 'Atomic Physics', 'Semiconductors'],
  Chemistry: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 
    'Chemical Bonding', 'Thermodynamics', 'Electrochemistry',
    'Chemical Kinetics', 'Coordination Compounds', 'P-Block Elements',
    'S-Block Elements', 'Hydrocarbons', 'Alcohols & Ethers'],
  Mathematics: ['Algebra', 'Trigonometry', 'Calculus', 'Coordinate Geometry',
    'Vectors', 'Probability', 'Statistics', 'Complex Numbers',
    'Sequences & Series', 'Matrices & Determinants', 'Functions',
    'Binomial Theorem', 'Permutations & Combinations']
};

const AVAILABLE_PYQ_EXAMS = ['JEE Main', 'JEE Advanced', 'CUET', 'MHTCET', 'BITSAT'];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ 
        error: 'Authentication required',
        response: 'Please log in to use the AI assistant.'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      return new Response(JSON.stringify({ 
        error: 'Invalid authentication',
        response: 'Your session has expired. Please log in again.'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Authenticated user:', user.id);

    const { message, conversationHistory } = await req.json();
    
    if (!message) {
      throw new Error('Message is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not found');
    }

    const systemPrompt = `You are ASK AI, a knowledgeable and friendly JEE doubt solver and assistant. You specialize in Physics, Chemistry, and Mathematics.

IMPORTANT: You have special capabilities:

1. **OPEN LECTURES**: When a user asks to open/watch/show a video lecture, respond with a JSON command block.
   CRITICAL: You MUST set the "subject" field correctly based on the lecture topic:
   - Physics lectures: ${AVAILABLE_LECTURES.Physics.join(', ')}
   - Chemistry lectures: ${AVAILABLE_LECTURES.Chemistry.join(', ')}
   - Mathematics lectures: ${AVAILABLE_LECTURES.Mathematics.join(', ')}
   
   Examples:
   - "open optics lecture" → subject is "Physics" because Optics is a Physics topic
   - "open chemical bonding" → subject is "Chemistry"
   - "open vectors lecture" → subject is "Mathematics"
   - "show me motion in straight line" → subject is "Physics"
   - "open GOC lecture" → subject is "Chemistry"
   
   \`\`\`command
   {"type": "open_lecture", "lectureSearch": "<lecture name>", "subject": "<Physics|Chemistry|Mathematics>"}
   \`\`\`
   Then add a friendly message.

2. **START TESTS**: When a user asks to generate/start a test/quiz:
   Available subjects: Physics, Chemistry, Mathematics
   Available topics: ${JSON.stringify(AVAILABLE_TOPICS)}
   Difficulty levels: cbse, jee-mains, jee-advanced
   Question count: 3 to 25 (default 5)
   
   \`\`\`command
   {"type": "start_test", "subject": "Physics", "topic": "Semiconductors", "difficulty": "jee-mains", "questionCount": 5}
   \`\`\`

3. **OPEN PYQ SECTION**: When a user asks to open/show PYQ papers for any exam (JEE Main, JEE Advanced, BITSAT, CUET, MHTCET):
   Available exams: ${AVAILABLE_PYQ_EXAMS.join(', ')}
   
   Examples:
   - "open BITSAT PYQ" → exam is "bitsat"
   - "show JEE Advanced 2023 papers" → exam is "jee-advanced"
   - "open CUET previous year" → exam is "cuet"
   
   \`\`\`command
   {"type": "open_pyq", "exam": "<jee-main|jee-advanced|cuet|mhtcet|bitsat>"}
   \`\`\`
   Then add a friendly message. Note: PYQ section is premium-only, so mention that if relevant.

4. **REGULAR QUESTIONS**: For JEE concept doubts, provide helpful explanations.

Your personality:
- Friendly, encouraging, and patient
- Always relate answers back to JEE exam context
- Provide clear, step-by-step explanations
- Use simple language but maintain technical accuracy

Guidelines:
- For math problems, show step-by-step solutions
- For physics concepts, explain underlying principles
- For chemistry, focus on reactions, mechanisms, and concepts
- Always mention if a topic is frequently tested in JEE
- Keep responses concise but complete

CRITICAL RULE: When opening lectures, ALWAYS determine the correct subject. Do NOT default to Mathematics. Check which subject list contains the lecture name.

Remember: Always use command blocks wrapped in \`\`\`command ... \`\`\` tags.`;

    const messages: any[] = [
      { role: 'system', content: systemPrompt }
    ];
    
    if (conversationHistory && Array.isArray(conversationHistory)) {
      for (const msg of conversationHistory) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }
    
    messages.push({ role: 'user', content: message });

    console.log('Calling Lovable AI Gateway, message count:', messages.length);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        temperature: 0.7,
        top_p: 0.9,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI Gateway Error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limits exceeded',
          response: "I'm receiving too many questions right now. Please try again in a moment!"
        }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'Payment required',
          response: "AI credits have been exhausted. Please add funds to continue using this feature."
        }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      
      throw new Error(`Lovable AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Lovable AI Gateway Response received');
    
    const aiResponse = data.choices?.[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('Invalid response format from Lovable AI Gateway');
    }

    const commandRegex = /```command\s*([\s\S]*?)```/g;
    const commandMatch = commandRegex.exec(aiResponse);
    
    let command = null;
    let cleanResponse = aiResponse;
    
    if (commandMatch) {
      try {
        command = JSON.parse(commandMatch[1].trim());
        cleanResponse = aiResponse.replace(commandRegex, '').trim();
        console.log('Detected command:', command);
      } catch (e) {
        console.error('Failed to parse command:', e);
      }
    }

    return new Response(JSON.stringify({ 
      response: cleanResponse,
      command 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      response: "I apologize, but I'm having trouble processing your question right now. Please try again in a moment!"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
