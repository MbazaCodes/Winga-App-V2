import type { Metadata } from 'next'
import './globals.css'
import Toast from '@/components/shared/Toast'

export const metadata: Metadata = {
  title: 'Winga Admin — Panel ya Wasimamizi',
  description: 'Winga Admin Web App',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sw">
      <body className="bg-[#F8F9FC]">
        {children}
        <Toast />
      </body>
    </html>
  )
}
