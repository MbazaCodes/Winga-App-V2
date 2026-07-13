'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, UserCheck, ClipboardList,
  TrendingUp, CreditCard, Star, FileText, Calculator,
  Bell, Settings, Shield, LogOut
} from 'lucide-react'

const NAV = [
  { group:'Muhtasari', items:[
    { href:'/dashboard',     icon:LayoutDashboard, label:'Dashboard' },
    { href:'/notifications', icon:Bell,            label:'Arifa' },
  ]},
  { group:'Usimamizi', items:[
    { href:'/wingas',        icon:UserCheck,       label:'Wingas' },
    { href:'/clients',       icon:Users,           label:'Wateja' },
    { href:'/requests',      icon:ClipboardList,   label:'Maombi' },
  ]},
  { group:'Fedha', items:[
    { href:'/earnings',      icon:TrendingUp,      label:'Mapato' },
    { href:'/transactions',  icon:CreditCard,      label:'Malipo' },
    { href:'/taxes',         icon:Calculator,      label:'Kodi TRA' },
  ]},
  { group:'Ripoti', items:[
    { href:'/ratings',       icon:Star,            label:'Tathmini' },
    { href:'/reports',       icon:FileText,        label:'Ripoti' },
  ]},
  { group:'Mfumo', items:[
    { href:'/admins',        icon:Shield,          label:'Wasimamizi' },
    { href:'/settings',      icon:Settings,        label:'Mipangilio' },
  ]},
]

export default function Sidebar() {
  const path = usePathname()
  return (
    <aside className="w-60 min-h-screen bg-white border-r border-card-border flex flex-col fixed top-0 left-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-card-border">
        <Image src="/logo/logo.png" alt="Winga" width={36} height={36} className="object-contain" />
        <div>
          <p className="text-sm font-extrabold text-text-dark">Winga Admin</p>
          <p className="text-[10px] text-text-muted">Panel ya Wasimamizi</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {NAV.map(group => (
          <div key={group.group}>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-4 mb-1">
              {group.group}
            </p>
            {group.items.map(({ href, icon:Icon, label }) => (
              <Link key={href} href={href}
                className={`sidebar-item ${path === href ? 'active' : ''}`}>
                <Icon size={17} />
                {label}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-card-border">
        <Link href="/login" className="sidebar-item text-danger hover:bg-red-50">
          <LogOut size={17} /> Toka
        </Link>
      </div>
    </aside>
  )
}
