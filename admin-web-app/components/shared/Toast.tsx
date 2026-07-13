'use client'
import { Toaster } from 'react-hot-toast'
export default function Toast() {
  return <Toaster position="top-right" toastOptions={{
    style: { background:'#1A1A2E', color:'#fff', borderRadius:'12px', fontSize:'13px' },
    success: { iconTheme: { primary:'#22C55E', secondary:'#fff' } },
    error:   { iconTheme: { primary:'#EF4444', secondary:'#fff' } },
  }} />
}
