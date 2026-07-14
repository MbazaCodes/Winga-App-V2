'use client'
import { useState, useRef, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Send, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const MOCK_MSGS = [
  { id:'1', sender:'winga', text:'Habari, niko Kariakoo sasa.', time:'10:15' },
  { id:'2', sender:'me',    text:'Sawa, nakuja dakika 10.',      time:'10:16' },
  { id:'3', sender:'winga', text:'Nimefika mlangoni, unaweza kuja?', time:'10:32' },
]

export default function ChatPage() {
  const { id } = useParams()
  const [messages, setMessages] = useState(MOCK_MSGS)
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages])

  const send = () => {
    if (!input.trim()) return
    setMessages(m => [...m, {
      id: Date.now().toString(), sender:'me', text:input.trim(),
      time: new Date().toLocaleTimeString('sw-TZ', { hour:'2-digit', minute:'2-digit' })
    }])
    setInput('')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-card-border bg-white sticky top-0">
        <Link href="/messages" className="w-9 h-9 flex items-center justify-center bg-input-bg rounded-xl">
          <ArrowLeft size={18} className="text-text-dark" />
        </Link>
        <div className="w-10 h-10 bg-primary-soft rounded-xl flex items-center justify-center">
          <span className="font-bold text-primary text-sm">A</span>
        </div>
        <div>
          <p className="font-bold text-text-dark text-sm">Amina Hassan</p>
          <p className="text-[10px] text-green-500 font-semibold">● Mtandaoni</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl
              ${msg.sender === 'me'
                ? 'bg-primary text-white rounded-br-sm'
                : 'bg-input-bg text-text-dark rounded-bl-sm'}`}>
              <p className="text-sm">{msg.text}</p>
              <p className={`text-[10px] mt-1 ${msg.sender === 'me' ? 'text-white/60' : 'text-text-muted'}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-card-border bg-white flex gap-2"
           style={{ paddingBottom:'max(12px,env(safe-area-inset-bottom))' }}>
        <input type="text" placeholder="Andika ujumbe..."
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          className="flex-1 h-12 bg-input-bg rounded-2xl px-4 text-sm text-text-dark
                     placeholder:text-text-muted outline-none border-2 border-transparent
                     focus:border-primary transition-all" />
        <button onClick={send}
          className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center
                     active:scale-90 transition-transform shrink-0">
          <Send size={18} color="white" />
        </button>
      </div>
    </div>
  )
}
