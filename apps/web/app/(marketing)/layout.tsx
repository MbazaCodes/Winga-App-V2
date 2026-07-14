import type { Metadata, Viewport } from 'next'
import './globals.css'
import Toast from '@/components/shared/Toast'

export const metadata: Metadata = {
  title: 'Winga — Shopping Guide Dashboard',
  description: 'Winga Dashboard — Tanzania Shopping Guide Platform',
  manifest: '/manifest.json',
  icons: { icon: '/logo/logo.png', apple: '/logo/logo.png' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0A8F4D',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sw">
      <body className="bg-white max-w-md mx-auto min-h-screen relative overflow-x-hidden">
        {children}
        <Toast />
      </body>
    </html>
  )
}
