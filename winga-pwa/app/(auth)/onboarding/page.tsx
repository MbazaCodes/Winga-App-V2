'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { storage } from '@/lib/utils/storage'
import Button from '@/components/shared/Button'

const slides = [
  { emoji:'🛍️', title:'Karibu Winga App!',
    subtitle:'Winga App ni mwongozo wako wa ununuzi Tanzania — haraka, salama, na rahisi.' },
  { emoji:'🤝', title:'Jinsi Inavyofanya Kazi',
    subtitle:'Omba Winga wa karibu nawe → akununue → akuletee. Rahisi kama hiyo!' },
  { emoji:'🔒', title:'Salama na ya Kuaminika',
    subtitle:'Wingas wote wamethibitishwa. Malipo salama. Fuatilia safari yako wakati wote.' },
]

export default function OnboardingPage() {
  const [current, setCurrent] = useState(0)
  const router = useRouter()

  const finish = () => {
    storage.set('winga_onboarded', '1')
    router.replace('/login')
  }

  const next = () => {
    if (current < slides.length - 1) setCurrent(c => c + 1)
    else finish()
  }

  const { emoji, title, subtitle } = slides[current]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex justify-end p-5">
        <button onClick={finish} className="text-sm font-semibold text-text-muted active:scale-95">
          Ruka →
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <Image src="/logo/logo.png" alt="Winga" width={90} height={90}
          className="object-contain mb-8" />
        <div className="text-6xl mb-6">{emoji}</div>
        <h1 className="text-2xl font-extrabold text-text-dark mb-3">{title}</h1>
        <p className="text-sm text-text-muted leading-relaxed">{subtitle}</p>
      </div>

      <div className="flex justify-center gap-2 mb-8">
        {slides.map((_, i) => (
          <div key={i} onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer
              ${i === current ? 'w-6 bg-primary' : 'w-2 bg-input-bg'}`} />
        ))}
      </div>

      <div className="px-6 pb-10">
        <Button onClick={next}>
          {current < slides.length - 1 ? 'Endelea →' : 'Anza Sasa →'}
        </Button>
      </div>
    </div>
  )
}
