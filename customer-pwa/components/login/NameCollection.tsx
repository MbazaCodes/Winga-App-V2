'use client'
import { useState } from 'react'
import Button from '@/components/shared/Button'

const PLACEHOLDER_NAMES = ['mteja', 'mteja mpya', 'customer', 'user', '']

interface Props {
  onSave: (name: string) => void
  onSkip: () => void
  isLoading: boolean
}

export default function NameCollection({ onSave, onSkip, isLoading }: Props) {
  const [name, setName] = useState('')
  const isValid = name.trim().length >= 2

  return (
    <div>
      <div className="text-4xl mb-4">👋</div>
      <h2 className="text-2xl font-extrabold text-text-dark mb-2">Jina lako ni nani?</h2>
      <p className="text-sm text-text-muted mb-8">
        Tutakusaidia vizuri zaidi tukijua jina lako.
      </p>

      <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
        Jina Kamili
      </label>
      <input
        type="text"
        placeholder="Mfano: David Mbazza"
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && isValid && onSave(name.trim())}
        className="input-field mb-6"
        autoFocus
      />

      <Button onClick={() => onSave(name.trim())} loading={isLoading}
        disabled={!isValid} className="mb-3">
        Hifadhi Jina →
      </Button>

      <button onClick={onSkip}
        className="w-full text-sm font-semibold text-text-muted py-3
                   active:scale-95 transition-transform">
        Ruka kwa sasa
      </button>
    </div>
  )
}
