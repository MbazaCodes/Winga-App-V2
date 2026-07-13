import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const cors = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

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

  // Get winga record
  const { data: winga } = await supabase.from("wingas").select("id").eq("user_id", user.id).single()
  if (!winga) return new Response(JSON.stringify({ error: "Not a Winga" }), { status: 403, headers: cors })

  const { request_id, action } = await req.json()

  const statusMap: Record<string, string> = {
    accept:   "accepted",
    shopping: "shopping",
    complete: "completed",
  }

  const newStatus = statusMap[action]
  if (!newStatus) return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400, headers: cors })

  const update: Record<string, unknown> = { status: newStatus }
  if (action === "accept") update.winga_id = winga.id

  const { error } = await supabase.from("requests").update(update).eq("id", request_id)
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: cors })

  return new Response(JSON.stringify({ success: true, status: newStatus }), { headers: cors })
})
