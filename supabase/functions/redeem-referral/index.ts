import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// The referral code is stored server-side only - never exposed to the client
const VALID_REFERRAL_CODE = "123456789Nilay123456789";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify user authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { code } = await req.json();

    if (!code || typeof code !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Referral code is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate the code server-side
    if (code.trim() !== VALID_REFERRAL_CODE) {
      return new Response(
        JSON.stringify({ error: 'Invalid referral code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user already has an active subscription
    const { data: existingSub } = await supabase
      .from('user_subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (existingSub) {
      return new Response(
        JSON.stringify({ error: 'You already have an active subscription' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the monthly plan
    const { data: monthlyPlan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('name', 'monthly')
      .eq('is_active', true)
      .single();

    if (planError || !monthlyPlan) {
      console.error('Plan error:', planError);
      return new Response(
        JSON.stringify({ error: 'Could not find monthly plan' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create active subscription for the user (free via referral)
    const now = new Date();
    const expiresAt = new Date(now.getTime() + monthlyPlan.duration_days * 24 * 60 * 60 * 1000);

    const { error: subError } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: user.id,
        plan_id: monthlyPlan.id,
        status: 'active',
        starts_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        razorpay_order_id: `referral_${Date.now()}`,
        razorpay_payment_id: 'referral_code_redemption',
      });

    if (subError) {
      console.error('Subscription insert error:', subError);
      return new Response(
        JSON.stringify({ error: 'Failed to activate subscription' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Referral code redeemed by user ${user.id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Monthly premium activated successfully!',
        expires_at: expiresAt.toISOString()
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error redeeming referral:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to redeem referral code' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
