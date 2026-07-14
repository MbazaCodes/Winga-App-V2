export const dynamic = 'force-dynamic'
import { Suspense } from 'react'
import TrackClient from './TrackClient'

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-text-muted">Inapakia ukurasa...</p>
      </div>
    }>
      <TrackClient />
    </Suspense>
  )
}
