import { useState, useEffect, useCallback, useRef } from 'react'

export function useTimer(initial = 60) {
  const [timeLeft, setTimeLeft] = useState(0)
  const ref = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = useCallback(() => {
    setTimeLeft(initial)
    if (ref.current) clearInterval(ref.current)
    ref.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(ref.current!); return 0 }
        return t - 1
      })
    }, 1000)
  }, [initial])

  useEffect(() => () => { if (ref.current) clearInterval(ref.current) }, [])

  const format = useCallback(() => {
    const m = Math.floor(timeLeft / 60).toString().padStart(2, '0')
    const s = (timeLeft % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }, [timeLeft])

  return { timeLeft, isRunning: timeLeft > 0, start, format }
}
