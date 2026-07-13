import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    // ── Auth verification ──
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ success: false, error: "Missing authorization header" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    const anonClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await anonClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ success: false, error: "Invalid or expired token" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { request_id, payment_method, mobile_number } = await req.json();
    if (!request_id) {
      return new Response(JSON.stringify({ success: false, error: "Missing request_id" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // ── Verify the authenticated user is the customer for this request ──
    const { data: request, error: reqErr } = await supabase
      .from("requests")
      .select("id, customer_id, winga_id, estimated_price, status")
      .eq("id", request_id)
      .single();

    if (reqErr || !request) {
      return new Response(JSON.stringify({ success: false, error: "Request not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (request.customer_id !== user.id) {
      return new Response(JSON.stringify({ success: false, error: "You can only pay for your own requests" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (request.status !== 'accepted' && request.status !== 'shopping') {
      return new Response(JSON.stringify({ success: false, error: "Request must be accepted or in shopping status to pay" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Calculate fees ──
    const gross = request.estimated_price;
    const platformFee = Math.round(gross * 0.12);
    const tax = Math.round(gross * 0.03);
    const wingaPayout = gross - platformFee - tax;
    const providerRef = "SIM_" + Date.now();

    // ── Create transaction ──
    const { data: tx, error } = await supabase.from("transactions").insert({
      request_id,
      winga_id: request.winga_id,
      customer_id: request.customer_id,
      gross_amount: gross,
      platform_fee: platformFee,
      winga_payout: wingaPayout,
      tax,
      payment_method: payment_method || "mpesa",
      mobile_number,
      provider_ref: providerRef,
      status: "success",
    }).select().single();

    if (error) throw error;

    // ── Complete the request ──
    await supabase
      .from("requests")
      .update({
        final_price: gross,
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", request_id);

    // Notify winga
    if (request.winga_id) {
      const { data: winga } = await supabase
        .from("wingas")
        .select("user_id")
        .eq("id", request.winga_id)
        .single();
      if (winga) {
        await supabase.from("notifications").insert({
          user_id: winga.user_id,
          title: "Malipo Yamewasilishwa!",
          body: `Malipo ya TZS ${gross.toLocaleString()} yamefanywa. Ulichapwa TZS ${(gross * 0.03).toLocaleString()} kodi.`,
          type: "payment",
          data: { request_id, amount: gross },
        });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      transaction: tx,
      breakdown: { gross, platformFee, wingaPayout, tax },
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});