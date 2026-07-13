'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) { toast.error('Weka email na nenosiri'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
    if (email === 'support@winga.com') { toast.success('Karibu Admin!'); router.replace('/dashboard') }
    else toast.error('Barua pepe au nenosiri si sahihi')
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo/logo.png" alt="Winga" width={64} height={64} className="object-contain mb-3" />
          <h1 className="text-2xl font-extrabold text-text-dark">Winga Admin</h1>
          <p className="text-sm text-text-muted mt-1">Panel ya Wasimamizi</p>
        </div>
        <div className="card p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Barua Pepe</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="support@winga.com" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Nenosiri</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="••••••••" className="input-field" />
          </div>
          <button onClick={handleLogin} disabled={loading} className="btn-primary w-full h-11 mt-2">
            {loading ? 'Inaingia...' : 'Ingia →'}
          </button>
        </div>
        <p className="text-center text-xs text-text-muted mt-4">Demo: support@winga.com / nenosiri lolote</p>
      </div>
    </div>
  )
}
