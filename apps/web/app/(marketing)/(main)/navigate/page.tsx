export const dynamic = 'force-dynamic'
import { Suspense } from 'react'
import NavigateClient from './NavigateClient'

export default function NavigatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-text-muted">Inapakia ukurasa...</p>
      </div>
    }>
      <NavigateClient />
    </Suspense>
  )
}
