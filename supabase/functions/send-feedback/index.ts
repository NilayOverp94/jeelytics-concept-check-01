import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { message, phone } = await req.json();

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (message.length > 5000) {
      return new Response(JSON.stringify({ error: 'Message too long' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Store feedback in DB
    await supabase.from('feedback').insert({
      user_id: user.id,
      message: message.trim(),
      phone: phone?.trim() || null,
    });

    // Send email notification using Resend-like approach or simple fetch
    // For now, we'll use a simple SMTP-less approach via Supabase's built-in
    // We'll log it and the admin can check the feedback table
    console.log(`New feedback from ${user.email}: ${message.substring(0, 100)}`);

    // Try to send email via a simple webhook/email service
    // Using a free email API - we'll use the Supabase edge function to notify
    try {
      const emailBody = `
New Feedback from JEElytics User

From: ${user.email}
Phone: ${phone || 'Not provided'}
Time: ${new Date().toISOString()}

Message:
${message}
      `.trim();

      // Send via Resend if available, otherwise just log
      const resendKey = Deno.env.get('RESEND_API_KEY');
      if (resendKey) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: 'JEElytics Feedback <onboarding@resend.dev>',
            to: ['nilayraj712@gmail.com'],
            subject: `JEElytics Feedback from ${user.email}`,
            text: emailBody,
          }),
        });
      }
    } catch (emailErr) {
      console.error('Email send failed (non-critical):', emailErr);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Feedback error:', error);
    return new Response(JSON.stringify({ error: 'Failed to submit feedback' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
