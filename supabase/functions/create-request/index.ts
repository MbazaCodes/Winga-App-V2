import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const cors = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

const PRICES: Record<string, number> = { hourly: 5000, half_day: 15000, full_day: 25000 }

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors })

  const auth = req.headers.get("Authorization")
  if (!auth) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: cors })

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: auth } } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: cors })

  const body = await req.json()
  const { data, error } = await supabase.from("requests").insert({
    customer_id:     user.id,
    category:        body.category,
    service_type:    body.service_type,
    delivery_method: body.delivery_method,
    meeting_point:   body.meeting_point ?? "",
    shopping_area:   body.shopping_area ?? "",
    notes:           body.notes ?? null,
    status:          "searching",
    estimated_price: PRICES[body.service_type] ?? 5000,
  }).select().single()

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: cors })

  // Notify nearby Wingas via send-notification
  return new Response(JSON.stringify({ data }), { status: 201, headers: cors })
})
