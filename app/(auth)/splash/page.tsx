'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { storage } from '@/lib/utils/storage'

export default function SplashPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      const onboarded = storage.get('winga_onboarded')
      const user = storage.get('winga_user')
      if (user) router.replace('/home')
      else if (onboarded) router.replace('/login')
      else router.replace('/onboarding')
    }, 2500)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="flex flex-col items-center animate-[popIn_0.8s_cubic-bezier(.34,1.56,.64,1)_both]">
        <Image src="/logo/logo.png" alt="Winga" width={160} height={160} priority
          className="object-contain mb-4 drop-shadow-lg" />
        <p className="text-xs font-semibold text-text-muted tracking-[2px] uppercase">
          Tanzania&apos;s Services Guide
        </p>
      </div>
      <div className="mt-16 w-48 h-1 bg-input-bg rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full animate-[load_2.3s_ease_forwards]" />
      </div>
      <style>{`
        @keyframes popIn { from{opacity:0;transform:scale(.7) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes load  { from{width:0} to{width:100%} }
      `}</style>
    </div>
  )
}
