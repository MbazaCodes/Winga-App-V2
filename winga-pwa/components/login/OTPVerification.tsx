'use client'
import { useRef, useEffect, useCallback } from 'react'
import { ArrowLeft } from 'lucide-react'
import OTPInput from './OTPInput'
import Button from '@/components/shared/Button'
import Spinner from '@/components/shared/Spinner'
import { useTimer } from '@/hooks/useTimer'

interface Props {
  phone: string
  digits: string[]
  onChange: (digits: string[]) => void
  onVerify: () => void
  onResend: () => void
  onBack: () => void
  isLoading: boolean
  error: string | null
}

export default function OTPVerification({
  phone, digits, onChange, onVerify, onResend, onBack, isLoading, error
}: Props) {
  const refs = useRef<(HTMLInputElement | null)[]>([])
  const { timeLeft, isRunning, start, format } = useTimer(60)

  useEffect(() => { start() }, [])

  const handleChange = useCallback((idx: number, val: string) => {
    const next = [...digits]
    next[idx] = val
    onChange(next)
    if (val && idx < 5) refs.current[idx + 1]?.focus()
    if (next.every(d => d) && next.join('').length === 6) {
      setTimeout(() => onVerify(), 50)
    }
  }, [digits, onChange, onVerify])

  const handleKeyDown = useCallback((idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      refs.current[idx - 1]?.focus()
    }
  }, [digits])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (text.length === 6) {
      onChange(text.split(''))
      setTimeout(() => onVerify(), 50)
    }
  }, [onChange, onVerify])

  const handleResend = () => { onResend(); start() }

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-text-muted text-sm mb-6
                                          active:scale-95 transition-transform">
        <ArrowLeft size={16} /> Rudi nyuma
      </button>

      <h2 className="text-2xl font-extrabold text-text-dark mb-1">Ingiza Nambari ya Siri</h2>
      <p className="text-sm text-text-muted mb-8">
        Tumia OTP iliyotumwa kwa <span className="font-bold text-text-dark">+255 {phone}</span>
      </p>

      <div className="flex justify-between gap-2 mb-6" onPaste={handlePaste}>
        {digits.map((d, i) => (
          <OTPInput
            key={i}
            ref={el => { refs.current[i] = el }}
            value={d}
            autoFocus={i === 0}
            onChange={v => handleChange(i, v)}
            onKeyDown={e => handleKeyDown(i, e)}
          />
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-danger text-sm font-semibold
                        rounded-2xl px-4 py-3 mb-4 text-center">
          {error}
        </div>
      )}

      <Button onClick={onVerify} loading={isLoading} className="mb-6">
        {isLoading ? '' : 'Thibitisha →'}
      </Button>

      <div className="text-center">
        {isRunning ? (
          <p className="text-sm text-text-muted">
            Tuma tena baada ya <span className="font-bold text-warning">{format()}</span>
          </p>
        ) : (
          <button onClick={handleResend}
            className="text-sm font-bold text-primary active:scale-95 transition-transform">
            Tuma tena OTP
          </button>
        )}
      </div>
    </div>
  )
}
