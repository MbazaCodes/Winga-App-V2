import { useState, useCallback } from 'react'
import { cleanPhone } from '@/lib/utils/phoneUtils'

export function usePhoneFormat() {
  const [value, setValue] = useState('')
  const [clean, setClean] = useState('')

  const onChange = useCallback((raw: string) => {
    const digits = raw.replace(/\D/g, '')
    setValue(digits)
    setClean(cleanPhone(digits))
  }, [])

  return { value, clean, onChange }
}
