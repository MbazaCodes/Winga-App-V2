'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import toast from 'react-hot-toast'
import Button from '@/components/shared/Button'
import OTPVerification from '@/components/login/OTPVerification'
import { sendOTP } from '@/lib/supabase/auth'
import { cleanPhone } from '@/lib/utils/phoneUtils'

type Step = 1 | 2 | 3

const CITIES = ['Dar es Salaam','Mwanza','Arusha','Dodoma','Mbeya','Tanga','Zanzibar','Morogoro']
const SPECIALTIES = ['Vyakula','Mavazi','Dawa','Simu/Elec','Samani','Ujenzi','Uzuri','Shule','Nyumba/Ardhi','Magari','MC/DJ','Nyingine']

export default function WingaRegisterPage() {
  const router = useRouter()
  const [step, setStep]       = useState<Step>(1)
  const [loading, setLoading] = useState(false)

  // Step 1 — Personal
  const [firstName, setFirstName] = useState('')
  const [lastName,  setLastName]  = useState('')
  const [phone,     setPhone]     = useState('')
  const [email,     setEmail]     = useState('')
  const [nida,      setNida]      = useState('')

  // Step 2 — Work
  const [specialty, setSpecialty] = useState<string[]>([])
  const [city,      setCity]      = useState('Dar es Salaam')
  const [area,      setArea]      = useState('')
  const [bio,       setBio]       = useState('')

  // Step 3 — OTP
  const [digits, setDigits] = useState(['','','','','',''])
  const [otpError, setOtpError] = useState<string|null>(null)

  const completion = Math.min(100, 20
    + (firstName ? 10 : 0) + (lastName ? 10 : 0)
    + (phone ? 15 : 0) + (nida ? 15 : 0)
    + (specialty.length ? 15 : 0) + (area ? 10 : 0) + (bio ? 5 : 0))

  const toggleSpecialty = (s: string) =>
    setSpecialty(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])

  const goToStep2 = () => {
    if (!firstName || !lastName) { toast.error('Weka jina lako kamili'); return }
    if (!phone || cleanPhone(phone).length < 9) { toast.error('Weka namba ya simu sahihi'); return }
    if (!nida) { toast.error('Namba ya NIDA inahitajika'); return }
    setStep(2)
  }

  const goToStep3 = async () => {
    if (specialty.length === 0) { toast.error('Chagua utaalamu mmoja angalau'); return }
    if (!area) { toast.error('Weka eneo lako'); return }
    setLoading(true)
    const clean = cleanPhone(phone)
    const { error } = await sendOTP(clean)
    setLoading(false)
    if (error) { toast.error(error); return }
    setStep(3)
  }

  const handleVerify = async () => {
    const code = digits.join('')
    if (code !== '123456') { setOtpError('Nambari ya siri si sahihi. Tumia 123456.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    toast.success('🎉 Umesajiliwa! Karibu Winga App.')
    router.replace('/winga/home')
  }

  const STEP_LABELS = ['Kibinafsi','Kazi','Thibitisha']

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex flex-col items-center pt-10 pb-4 px-5">
        <Image src="/logo/logo.png" alt="Winga" width={70} height={70} className="object-contain mb-3" />
        <h1 className="text-xl font-extrabold text-text-dark">Jiunge kama Winga</h1>
        <p className="text-sm text-text-muted mt-1">Hatua {step} ya 3</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center px-8 mb-6">
        {STEP_LABELS.map((label, i) => {
          const num = i + 1
          const done = step > num
          const active = step === num
          return (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                  transition-all ${done ? 'bg-green-500 text-white' : active ? 'bg-primary text-white' : 'bg-input-bg text-text-muted'}`}>
                  {done ? '✓' : num}
                </div>
                <span className={`text-[10px] font-semibold mt-1 ${active ? 'text-primary' : 'text-text-muted'}`}>
                  {label}
                </span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-4 rounded-full transition-all
                  ${step > num ? 'bg-green-500' : 'bg-input-bg'}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Completion */}
      <div className="px-5 mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-xs text-text-muted font-semibold">Ukamilifu wa Wasifu</span>
          <span className={`text-xs font-extrabold ${completion >= 75 ? 'text-green-600' : 'text-warning'}`}>
            {completion}%
          </span>
        </div>
        <div className="h-2 bg-input-bg rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width:`${completion}%` }} />
        </div>
      </div>

      <div className="px-5 pb-10">
        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-extrabold text-text-dark">Maelezo ya Kibinafsi</h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Jina la Kwanza</label>
                <input value={firstName} onChange={e => setFirstName(e.target.value)}
                  placeholder="David" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Jina la Mwisho</label>
                <input value={lastName} onChange={e => setLastName(e.target.value)}
                  placeholder="Mbazza" className="input-field" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Namba ya Simu</label>
              <div className="flex items-center bg-input-bg rounded-2xl border-2 border-transparent
                              focus-within:border-primary focus-within:shadow-input transition-all">
                <span className="pl-4 pr-3 text-sm font-bold text-text-dark border-r border-card-border mr-1">
                  🇹🇿 +255
                </span>
                <input type="tel" inputMode="numeric" placeholder="712 345 678"
                  value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g,''))}
                  className="flex-1 h-14 bg-transparent outline-none px-3 text-base text-text-dark placeholder:text-text-muted" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Barua Pepe (Hiari)</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="david@example.com" className="input-field" />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                Namba ya NIDA <span className="text-danger">*</span>
              </label>
              <input value={nida} onChange={e => setNida(e.target.value)}
                placeholder="19XXXXXXXXXXXXXXXXX" className="input-field font-mono" />
              <p className="text-xs text-text-muted mt-1">Inahifadhiwa salama — admin peke yake anaona</p>
            </div>

            <Button onClick={goToStep2}>Endelea → Hatua 2</Button>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-extrabold text-text-dark">Maelezo ya Kazi</h2>

            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                Utaalamu ({specialty.length} ulichochagua)
              </label>
              <div className="flex flex-wrap gap-2">
                {SPECIALTIES.map(s => (
                  <button key={s} onClick={() => toggleSpecialty(s)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all
                      ${specialty.includes(s) ? 'bg-primary text-white shadow-card' : 'bg-input-bg text-text-mid'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Mji</label>
              <select value={city} onChange={e => setCity(e.target.value)} className="input-field">
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Eneo</label>
              <input value={area} onChange={e => setArea(e.target.value)}
                placeholder="Mfano: Kariakoo, Mwenge, Mikocheni..." className="input-field" />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Bio (Hiari)</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                placeholder="Niambie kuhusu uzoefu wako wa ununuzi..."
                className="w-full bg-input-bg rounded-2xl p-4 text-sm text-text-dark
                           placeholder:text-text-muted outline-none border-2 border-transparent
                           focus:border-primary resize-none" />
            </div>

            {/* Badge info */}
            <div className="card p-4">
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Badge System</p>
              {[
                { badge:'⭐ Starter', req:'0–9 safari', color:'text-gray-600' },
                { badge:'🔵 Mid',     req:'10+ safari, alama 60%+', color:'text-blue-600' },
                { badge:'✅ Verified',req:'30+ safari, alama 80%+', color:'text-primary' },
              ].map(b => (
                <div key={b.badge} className="flex items-center justify-between py-2 border-b border-card-border last:border-0">
                  <span className={`text-sm font-bold ${b.color}`}>{b.badge}</span>
                  <span className="text-xs text-text-muted">{b.req}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="flex-1 h-14 border-2 border-card-border text-text-mid font-bold
                           rounded-2xl active:scale-95 transition-transform">
                ← Rudi
              </button>
              <div className="flex-1">
                <Button onClick={goToStep3} loading={loading}>Endelea → OTP</Button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && (
          <OTPVerification
            phone={cleanPhone(phone)}
            digits={digits}
            onChange={setDigits}
            onVerify={handleVerify}
            onResend={() => sendOTP(cleanPhone(phone))}
            onBack={() => setStep(2)}
            isLoading={loading}
            error={otpError}
          />
        )}
      </div>
    </div>
  )
}
