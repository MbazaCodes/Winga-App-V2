'use client'
import { Toaster } from 'react-hot-toast'

export default function Toast() {
  return (
    <Toaster position="top-center" toastOptions={{
      duration: 3000,
      style: {
        background: '#1A1A2E',
        color: '#fff',
        borderRadius: '14px',
        fontSize: '14px',
        fontWeight: '600',
        padding: '12px 18px',
      },
      success: { iconTheme: { primary: '#22C55E', secondary: '#fff' } },
      error:   { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
    }} />
  )
}
