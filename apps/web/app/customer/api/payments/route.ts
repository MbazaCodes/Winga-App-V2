import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { initiatePayment, PaymentProvider } from '@/lib/payments/mpesa'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
)

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: { user } } = await supabase.auth.getUser(token)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { requestId, phone, amount, provider } = await req.json()

  if (!requestId || !phone || !amount || !provider) {
    return NextResponse.json({ error: 'Taarifa zote zinahitajika' }, { status: 400 })
  }

  // Initiate payment with selected provider
  const result = await initiatePayment({
    phone:     phone.startsWith('255') ? phone : `255${phone}`,
    amount,
    reference: requestId,
    provider:  provider as PaymentProvider,
  })

  // Record payment attempt in DB
  await supabase.from('payments').insert({
    request_id:     requestId,
    customer_id:    user.id,
    amount,
    provider,
    status:         result.status,
    transaction_id: result.transactionId,
    receipt:        result.receipt ?? null,
  })

  // If successful, update request final_price
  if (result.status === 'success') {
    await supabase.from('requests').update({
      final_price: amount,
      payment_status: 'paid',
    }).eq('id', requestId)
  }

  return NextResponse.json(result, {
    status: result.status === 'success' ? 200 : 402
  })
}
