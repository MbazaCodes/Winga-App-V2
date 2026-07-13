'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'
import { useOTP } from '@/hooks/useOTP'
import { cleanPhone } from '@/lib/utils/phoneUtils'
import { formatWingaId } from '@/lib/utils/wingaUtils'
import { saveName, lookupWingaById } from '@/lib/supabase/auth'
import { phoneSchema, wingaIdSchema, otpSchema } from '@/lib/validations/loginSchemas'
import EntryTabs from '@/components/login/EntryTabs'
import PhoneInput from '@/components/login/PhoneInput'
import WingaIdInput from '@/components/login/WingaIdInput'
import OTPVerification from '@/components/login/OTPVerification'
import NameCollection from '@/components/login/NameCollection'
import type { LoginStep, EntryTab } from '@/types/auth'

const PLACEHOLDER_NAMES = ['mteja', 'mteja mpya', 'customer', 'user', '']

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useAuthStore()
  const { send, verify, isLoading, error: otpError, setError } = useOTP()

  const [step, setStep] = useState<LoginStep>('entry')
  const [tab, setTab]   = useState<EntryTab>('phone')
  const [phone, setPhone]     = useState('')
  const [wingaId, setWingaId] = useState('')
  const [wingaIdError, setWingaIdError] = useState<string | null>(null)
  const [digits, setDigits]   = useState(['','','','','',''])
  const [nameLoading, setNameLoading] = useState(false)

  const handleSendOTP = useCallback(async () => {
    setError(null)
    if (tab === 'phone') {
      const clean = cleanPhone(phone)
      const result = phoneSchema.safeParse(clean)
      if (!result.success) { toast.error(result.error.issues[0].message); return }
      const ok = await send(clean)
      if (ok) setStep('otp')
    } else {
      const fmt = formatWingaId(wingaId)
      const result = wingaIdSchema.safeParse(fmt)
      if (!result.success) { setWingaIdError(result.error.issues[0].message); return }
      const { phone: foundPhone, error } = await lookupWingaById(fmt)
      if (error || !foundPhone) { setWingaIdError('Winga ID haikupatikana.'); return }
      setPhone(cleanPhone(foundPhone))
      const ok = await send(cleanPhone(foundPhone))
      if (ok) setStep('otp')
    }
  }, [tab, phone, wingaId, send, setError])

  const handleVerify = useCallback(async () => {
    const code = digits.join('')
    const result = otpSchema.safeParse(code)
    if (!result.success) { toast.error('Tafadhali jaza tarakimu 6'); return }
    const user = await verify(phone, code)
    if (!user) return
    setUser(user)
    // Check if name is needed
    const nameIsPlaceholder = !user.name || PLACEHOLDER_NAMES.includes(user.name.toLowerCase())
    if (nameIsPlaceholder) { setStep('name'); return }
    // Route
    router.replace(user.user_type === 'winga' ? '/winga/home' : '/home')
  }, [digits, phone, verify, setUser, router])

  const handleSaveName = useCallback(async (name: string) => {
    const { user } = useAuthStore.getState()
    if (!user) return
    setNameLoading(true)
    await saveName(user.id, name)
    setUser({ ...user, name })
    setNameLoading(false)
    router.replace(user.user_type === 'winga' ? '/winga/home' : '/home')
  }, [setUser, router])

  const handleSkipName = useCallback(() => {
    const { user } = useAuthStore.getState()
    if (!user) return
    router.replace(user.user_type === 'winga' ? '/winga/home' : '/home')
  }, [router])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Logo header */}
      <div className="flex flex-col items-center pt-12 pb-2">
        <Image src="/logo/logo.png" alt="Winga" width={100} height={100}
          className="object-contain" priority />
      </div>

      {/* Card */}
      <div className="flex-1 px-5 pt-2 pb-10">
        <div className="card p-6">
          {step === 'entry' && (
            <>
              <h1 className="text-2xl font-extrabold text-text-dark mb-1">
                {tab === 'phone' ? 'Karibu! 👋' : 'Ingia kwa Winga ID'}
              </h1>
              <p className="text-sm text-text-muted mb-6">
                {tab === 'phone'
                  ? 'Ingiza namba yako — utatumia code ya OTP bure.'
                  : 'Weka Winga ID yako ili uendelee.'}
              </p>

              <EntryTabs active={tab} onChange={t => { setTab(t); setWingaIdError(null); setError(null) }} />

              {tab === 'phone'
                ? <PhoneInput value={phone} onChange={setPhone} onSubmit={handleSendOTP} />
                : <WingaIdInput value={wingaId} onChange={setWingaId}
                    onSubmit={handleSendOTP} error={wingaIdError} />}

              <button
                onClick={handleSendOTP}
                disabled={isLoading}
                className="btn-primary mt-6">
                {isLoading
                  ? <span className="flex items-center gap-2"><span className="animate-spin">⏳</span> Inatuma...</span>
                  : 'Tuma Namba ya Siri →'}
              </button>
            </>
          )}

          {step === 'otp' && (
            <OTPVerification
              phone={phone}
              digits={digits}
              onChange={setDigits}
              onVerify={handleVerify}
              onResend={() => send(phone)}
              onBack={() => { setStep('entry'); setDigits(['','','','','','']); setError(null) }}
              isLoading={isLoading}
              error={otpError}
            />
          )}

          {step === 'name' && (
            <NameCollection
              onSave={handleSaveName}
              onSkip={handleSkipName}
              isLoading={nameLoading}
            />
          )}
        </div>

        {/* Test credentials notice */}
        <div className="mt-4 p-4 bg-primary-soft rounded-2xl text-center">
          <p className="text-xs font-semibold text-primary">
            🧪 Majaribio: Tumia OTP <span className="font-mono font-bold">123456</span>
          </p>
        </div>
      </div>
    </div>
  )
}
