'use client'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface Props {
  title: string
  showBack?: boolean
  right?: React.ReactNode
}

export default function PageHeader({ title, showBack = true, right }: Props) {
  const router = useRouter()
  return (
    <div className="flex items-center justify-between px-5 py-4">
      {showBack ? (
        <button onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-2xl bg-input-bg active:scale-90 transition-transform">
          <ArrowLeft size={20} className="text-text-dark" />
        </button>
      ) : <div className="w-10" />}
      <h1 className="text-base font-bold text-text-dark">{title}</h1>
      <div className="w-10 flex justify-end">{right}</div>
    </div>
  )
}
