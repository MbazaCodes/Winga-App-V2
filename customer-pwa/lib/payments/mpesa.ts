/**
 * Winga App — M-Pesa Tanzania Integration
 * Provider: Vodacom Tanzania M-Pesa API
 * Docs: https://developers.vodacom.co.tz/api
 */

const MPESA_BASE_URL   = process.env.MPESA_BASE_URL   ?? 'https://openapi.m-pesa.com'
const MPESA_API_KEY    = process.env.MPESA_API_KEY    ?? ''
const MPESA_PUBLIC_KEY = process.env.MPESA_PUBLIC_KEY ?? ''
const BUSINESS_SHORT   = process.env.MPESA_SHORTCODE  ?? '000000'

export type PaymentProvider = 'mpesa' | 'airtel' | 'tigo' | 'halopesa'
export type PaymentStatus   = 'pending' | 'success' | 'failed' | 'cancelled'

export interface PaymentRequest {
  phone:     string      // 255XXXXXXXXX format
  amount:    number      // TZS
  reference: string      // Request ID
  provider:  PaymentProvider
}

export interface PaymentResult {
  status:        PaymentStatus
  transactionId: string | null
  message:       string
  receipt?:      string
}

// ─── Encrypt API key with public key (M-Pesa requirement) ─────────────────
function encryptApiKey(): string {
  // In production: RSA encrypt MPESA_API_KEY with MPESA_PUBLIC_KEY
  // For now return placeholder — replace with real crypto implementation
  if (!MPESA_API_KEY || !MPESA_PUBLIC_KEY) return 'DEMO_ENCRYPTED_KEY'
  return Buffer.from(`${MPESA_API_KEY}:${Date.now()}`).toString('base64')
}

// ─── Get session key ───────────────────────────────────────────────────────
async function getSessionKey(): Promise<string> {
  if (MPESA_API_KEY === '' || process.env.NODE_ENV !== 'production') {
    return 'DEMO_SESSION_KEY'
  }

  const res = await fetch(`${MPESA_BASE_URL}/openapi/ipg/v2/vodacomTZN/getSession/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${encryptApiKey()}`,
      'Origin': process.env.NEXT_PUBLIC_APP_URL ?? 'https://winga-app-5wtq.vercel.app',
    },
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message ?? 'Failed to get M-Pesa session')
  return data.output_SessionID
}

// ─── C2B Push (customer pays) ─────────────────────────────────────────────
export async function initiateMpesaPayment(req: PaymentRequest): Promise<PaymentResult> {
  // Demo mode — always succeed
  if (!MPESA_API_KEY || process.env.NODE_ENV !== 'production') {
    await new Promise(r => setTimeout(r, 1500))
    return {
      status: 'success',
      transactionId: `DEMO_${Date.now()}`,
      message: `Malipo ya TZS ${req.amount.toLocaleString()} yamekubaliwa (Demo)`,
      receipt: `WNG${Math.random().toString(36).slice(2,8).toUpperCase()}`,
    }
  }

  try {
    const sessionKey = await getSessionKey()

    const payload = {
      input_Amount:              req.amount.toString(),
      input_Country:             'TZN',
      input_Currency:            'TZS',
      input_CustomerMSISDN:      req.phone,
      input_ServiceProviderCode: BUSINESS_SHORT,
      input_ThirdPartyConversationID: `WNG-${req.reference}-${Date.now()}`,
      input_TransactionReference: req.reference,
      input_PurchasedItemsDesc:  `Winga Service #${req.reference}`,
    }

    const res = await fetch(`${MPESA_BASE_URL}/openapi/ipg/v2/vodacomTZN/c2bPayment/singleStage/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sessionKey}`,
        'Content-Type':  'application/json',
        'Origin':        process.env.NEXT_PUBLIC_APP_URL ?? '',
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (data.output_ResponseCode === 'INS-0') {
      return {
        status: 'success',
        transactionId: data.output_TransactionID,
        receipt:       data.output_ConversationID,
        message: 'Malipo yamekubaliwa! Asante.',
      }
    }

    // Map M-Pesa response codes to Swahili messages
    const MSG: Record<string, string> = {
      'INS-1':   'Mtumiaji hakubali malipo.',
      'INS-6':   'Pesa haitoshi kwenye akaunti yako.',
      'INS-9':   'Ombi limeisha muda. Jaribu tena.',
      'INS-10':  'Shughuli nyingine inaendelea. Subiri.',
      'INS-2006':'Namba ya PIN si sahihi.',
    }

    return {
      status: 'failed',
      transactionId: null,
      message: MSG[data.output_ResponseCode] ?? 'Malipo yameshindwa. Jaribu tena.',
    }
  } catch (err: any) {
    return {
      status: 'failed',
      transactionId: null,
      message: 'Hitilafu ya mtandao. Jaribu tena.',
    }
  }
}

// ─── Airtel Money ──────────────────────────────────────────────────────────
export async function initiateAirtelPayment(req: PaymentRequest): Promise<PaymentResult> {
  // Airtel Money Tanzania — AirtelTigo API
  // Docs: https://developers.airtel.africa/
  if (process.env.NODE_ENV !== 'production') {
    await new Promise(r => setTimeout(r, 1200))
    return {
      status: 'success',
      transactionId: `AIRTEL_DEMO_${Date.now()}`,
      message: `Airtel Money: TZS ${req.amount.toLocaleString()} yamekubaliwa (Demo)`,
    }
  }
  // TODO: implement Airtel Money API
  return { status: 'failed', transactionId: null, message: 'Airtel Money haijasanidiwa.' }
}

// ─── Tigo Pesa ─────────────────────────────────────────────────────────────
export async function initiateTigoPayment(req: PaymentRequest): Promise<PaymentResult> {
  if (process.env.NODE_ENV !== 'production') {
    await new Promise(r => setTimeout(r, 1200))
    return {
      status: 'success',
      transactionId: `TIGO_DEMO_${Date.now()}`,
      message: `Tigo Pesa: TZS ${req.amount.toLocaleString()} yamekubaliwa (Demo)`,
    }
  }
  return { status: 'failed', transactionId: null, message: 'Tigo Pesa haijasanidiwa.' }
}

// ─── Unified payment dispatcher ────────────────────────────────────────────
export async function initiatePayment(req: PaymentRequest): Promise<PaymentResult> {
  switch (req.provider) {
    case 'mpesa':    return initiateMpesaPayment(req)
    case 'airtel':   return initiateAirtelPayment(req)
    case 'tigo':     return initiateTigoPayment(req)
    case 'halopesa': return { status: 'failed', transactionId: null, message: 'Halopesa haijaungwa mkono bado.' }
    default:         return { status: 'failed', transactionId: null, message: 'Mtoa huduma wa malipo si sahihi.' }
  }
}
