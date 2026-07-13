'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ClipboardList, Search, TrendingUp, User } from 'lucide-react'

const items = [
  { href:'/winga/home',     icon:LayoutDashboard, label:'Dashboard' },
  { href:'/winga/requests', icon:ClipboardList,   label:'Maombi'    },
  { href:'/winga/search',   icon:Search,          label:'Tafuta', fab:true },
  { href:'/winga/earnings', icon:TrendingUp,      label:'Mapato'    },
  { href:'/winga/profile',  icon:User,            label:'Wasifu'    },
]

export default function WingaBottomNav() {
  const path = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-card-border
                    flex items-center justify-around px-2"
         style={{ paddingBottom:'max(16px,env(safe-area-inset-bottom))' }}>
      {items.map(({ href, icon:Icon, label, fab }) => {
        const active = path === href
        if (fab) return (
          <Link key={href} href={href} className="flex flex-col items-center -mt-6">
            <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center
                            shadow-card-lg active:scale-90 transition-transform">
              <Icon size={24} color="white" />
            </div>
            <span className="text-[10px] font-semibold text-primary mt-1">{label}</span>
          </Link>
        )
        return (
          <Link key={href} href={href}
            className={`nav-item py-3 px-3 ${active ? 'active' : ''}`}>
            <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            <span className="text-[10px] font-semibold">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
