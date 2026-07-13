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
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  )

  const anonClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: auth } } }
  )

  const { data: { user } } = await anonClient.auth.getUser()
  if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: cors })

  const { request_id, phone, amount, provider } = await req.json()

  // Demo mode — always succeed (replace with real M-Pesa API in production)
  const isProduction = Deno.env.get("ENVIRONMENT") === "production"
  const mpesaApiKey  = Deno.env.get("MPESA_API_KEY") ?? ""

  let paymentResult = {
    status:         "success" as "success" | "failed",
    transaction_id: `DEMO_${Date.now()}`,
    receipt:        `WNG${Math.random().toString(36).slice(2,8).toUpperCase()}`,
    message:        `Malipo ya TZS ${amount.toLocaleString()} yamekubaliwa`,
  }

  if (isProduction && mpesaApiKey) {
    // TODO: Real M-Pesa call here
    // const res = await fetch("https://openapi.m-pesa.com/...", {...})
  }

  // Record payment
  await supabase.from("payments").insert({
    request_id,
    customer_id:    user.id,
    amount,
    provider,
    status:         paymentResult.status,
    transaction_id: paymentResult.transaction_id,
    receipt:        paymentResult.receipt,
  })

  // Update request if paid
  if (paymentResult.status === "success") {
    await supabase.from("requests").update({
      final_price:    amount,
      payment_status: "paid",
    }).eq("id", request_id)
  }

  return new Response(JSON.stringify(paymentResult), {
    status: paymentResult.status === "success" ? 200 : 402,
    headers: cors,
  })
})
