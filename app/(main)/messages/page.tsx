'use client'
import PageHeader from '@/components/shared/PageHeader'
import EmptyState from '@/components/shared/EmptyState'
import Link from 'next/link'

const MOCK_CONVOS = [
  { id:'req1', winga:'Amina Hassan', lastMsg:'Nimefika Kariakoo, unaweza kuja?', time:'10:32', unread:2, online:true },
  { id:'req2', winga:'John Mwangi',  lastMsg:'Asante, safari imekamilika!',       time:'Jana',  unread:0, online:false },
]

export default function MessagesPage() {
  return (
    <div className="bg-white">
      <PageHeader title="Ujumbe" showBack={false} />

      <div className="px-5 pb-6">
        {MOCK_CONVOS.length === 0 ? (
          <EmptyState icon="💬" title="Hakuna ujumbe bado"
            subtitle="Unapoomba Winga, mazungumzo yataonekana hapa." />
        ) : (
          <div className="space-y-2">
            {MOCK_CONVOS.map(c => (
              <Link key={c.id} href={`/messages/${c.id}`}>
                <div className="card p-4 flex items-center gap-3 active:scale-95 transition-transform">
                  <div className="relative shrink-0">
                    <div className="w-13 h-13 w-[52px] h-[52px] bg-primary-soft rounded-2xl
                                    flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">{c.winga[0]}</span>
                    </div>
                    {c.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500
                                      rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-text-dark text-sm">{c.winga}</span>
                      <span className="text-[10px] text-text-muted">{c.time}</span>
                    </div>
                    <p className="text-xs text-text-muted truncate mt-0.5">{c.lastMsg}</p>
                  </div>
                  {c.unread > 0 && (
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-white">{c.unread}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
