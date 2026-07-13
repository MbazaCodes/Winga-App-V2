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

    // ── Validate request body ──
    const body = await req.json();
    const { category, meeting_point, estimated_price } = body;
    if (!category || !meeting_point || !estimated_price) {
      return new Response(JSON.stringify({
        success: false,
        error: "Missing required fields: category, meeting_point, estimated_price",
      }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ── Force customer_id to the authenticated user ──
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data, error } = await supabase.from("requests").insert({
      customer_id: user.id,  // Use authenticated user's ID, ignore body.customer_id
      category,
      meeting_point,
      shopping_area: body.shopping_area || "Kariakoo Market",
      service_type: body.service_type || "hourly",
      delivery_method: body.delivery_method || "with_client",
      estimated_price,
      note: body.note,
      city: body.city,
      area: body.area,
      location_id: body.location_id,
      status: "searching",
    }).select().single();

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, request: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});