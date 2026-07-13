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

    // Create anon client to verify the JWT
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

    // ── Verify this user is the winga they claim to be ──
    const { request_id, winga_id } = await req.json();
    if (!request_id || !winga_id) {
      return new Response(JSON.stringify({ success: false, error: "Missing request_id or winga_id" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check that the authenticated user owns this winga profile
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: wingaProfile, error: wingaErr } = await supabase
      .from("wingas")
      .select("id, user_id, status, verification_status")
      .eq("id", winga_id)
      .single();

    if (wingaErr || !wingaProfile) {
      return new Response(JSON.stringify({ success: false, error: "Winga profile not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (wingaProfile.user_id !== user.id) {
      return new Response(JSON.stringify({ success: false, error: "You can only accept requests for your own profile" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Check availability ──
    const { data: available } = await supabase.rpc("is_winga_available", { p_winga_id: winga_id });
    if (!available) {
      return new Response(JSON.stringify({ success: false, error: "Winga not available" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Accept request ──
    const { data, error } = await supabase
      .from("requests")
      .update({ winga_id, status: "accepted", accepted_at: new Date().toISOString() })
      .eq("id", request_id)
      .eq("status", "searching")
      .select()
      .single();

    if (error) throw error;

    // Notify customer
    const { data: req } = await supabase
      .from("requests")
      .select("customer_id")
      .eq("id", request_id)
      .single();

    if (req) {
      await supabase.from("notifications").insert({
        user_id: req.customer_id,
        title: "Winga Amekubali!",
        body: "Winga amekubali ombi lako.",
        type: "request",
        data: { request_id },
      });
    }

    return new Response(JSON.stringify({ success: true, request: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});