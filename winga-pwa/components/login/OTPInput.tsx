'use client'
import { useRef, forwardRef } from 'react'

interface Props {
  value: string
  onChange: (v: string) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  autoFocus?: boolean
}

const OTPInput = forwardRef<HTMLInputElement, Props>(({ value, onChange, onKeyDown, autoFocus }, ref) => (
  <input
    ref={ref}
    type="tel"
    inputMode="numeric"
    maxLength={1}
    value={value}
    autoFocus={autoFocus}
    onChange={e => onChange(e.target.value.replace(/\D/g, ''))}
    onKeyDown={onKeyDown}
    className="otp-box"
  />
))
OTPInput.displayName = 'OTPInput'
export default OTPInput
