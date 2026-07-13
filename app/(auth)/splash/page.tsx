'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { storage } from '@/lib/utils/storage'

export default function SplashPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      const user     = storage.get('winga_user')
      const onboarded = storage.get('winga_onboarded')
      if (user)      router.replace('/home')
      else if (onboarded) router.replace('/login')
      else           router.replace('/onboarding')
    }, 2500)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">

      <div className="flex flex-col items-center"
           style={{ animation: 'popIn 0.8s cubic-bezier(.34,1.56,.64,1) both' }}>

        {/* mix-blend-mode:multiply dissolves white PNG background into white page */}
        <Image
          src="/logo/logo.png"
          alt="Winga"
          width={180}
          height={180}
          priority
          style={{ mixBlendMode: 'multiply', objectFit: 'contain' }}
        />

        <p className="text-xs font-semibold text-text-muted tracking-[2px] uppercase mt-2">
          Tanzania&apos;s Services Guide
        </p>
      </div>

      {/* Progress bar */}
      <div className="mt-16 w-48 h-1 bg-input-bg rounded-full overflow-hidden"
           style={{ animation: 'fadeUp 0.6s 0.6s ease both' }}>
        <div className="h-full bg-primary rounded-full"
             style={{ animation: 'load 2.3s 0.8s ease forwards', width: 0 }} />
      </div>

      <style>{`
        @keyframes popIn  { from{opacity:0;transform:scale(.7) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes load   { from{width:0} to{width:100%} }
      `}</style>
    </div>
  )
}
