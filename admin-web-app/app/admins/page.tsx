'use client'
import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Shield } from 'lucide-react'

const ADMINS = [
  { id:'a1', name:'David Mbazza',   email:'david@winga.app',    role:'Super Admin', lastLogin:'2026-07-13 09:00', active:true },
  { id:'a2', name:'Lusaja Mkunza',  email:'lusaja@winga.app',   role:'Ops',         lastLogin:'2026-07-13 08:30', active:true },
  { id:'a3', name:'Finance Admin',  email:'finance@winga.app',  role:'Finance',     lastLogin:'2026-07-12 15:00', active:true },
  { id:'a4', name:'Support Agent',  email:'support@winga.app',  role:'Support',     lastLogin:'2026-07-11 10:00', active:false },
]

const ROLES = ['Super Admin','Ops','Finance','Support']
const PERMS: Record<string, string[]> = {
  'Super Admin': ['Dashboard','Wingas','Wateja','Maombi','Mapato','Miamala','Kodi','Tathmini','Ripoti','Arifa','Mipangilio','Wasimamizi'],
  'Ops':         ['Dashboard','Wingas','Wateja','Maombi','Arifa'],
  'Finance':     ['Dashboard','Mapato','Miamala','Kodi','Ripoti'],
  'Support':     ['Dashboard','Wateja','Arifa'],
}

const ROLE_COLORS: Record<string,string> = {
  'Super Admin':'bg-purple-50 text-primary',
  'Ops':        'bg-blue-50 text-blue-700',
  'Finance':    'bg-green-50 text-green-700',
  'Support':    'bg-yellow-50 text-yellow-700',
}

export default function AdminsPage() {
  const [selected, setSelected] = useState('Super Admin')

  return (
    <AdminLayout title="Wasimamizi">
      <div className="grid grid-cols-3 gap-4">
        {/* Admins table */}
        <div className="col-span-2 card overflow-hidden">
          <div className="p-4 border-b border-card-border flex items-center justify-between">
            <h2 className="font-bold text-text-dark">Wasimamizi Wote</h2>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-xl active:scale-95">
              <Shield size={12} /> Ongeza Admin
            </button>
          </div>
          <table className="w-full">
            <thead className="bg-[#F8F9FC] border-b border-card-border">
              <tr className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                {['Jina','Barua Pepe','Jukumu','Ingia Mara ya Mwisho','Hali'].map(h => (
                  <th key={h} className="px-4 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {ADMINS.map(a => (
                <tr key={a.id} className="hover:bg-[#F8F9FC]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary-soft rounded-xl flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">{a.name[0]}</span>
                      </div>
                      <span className="text-sm font-semibold text-text-dark">{a.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-text-muted">{a.email}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${ROLE_COLORS[a.role] || 'bg-gray-100 text-gray-600'}`}>
                      {a.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-text-muted">{a.lastLogin}</td>
                  <td className="px-4 py-3">
                    <div className={`w-2 h-2 rounded-full ${a.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Roles & Permissions */}
        <div className="card p-5">
          <h2 className="font-bold text-text-dark mb-4">🔐 Ruhusa za Jukumu</h2>
          <div className="flex flex-col gap-1 mb-4">
            {ROLES.map(r => (
              <button key={r} onClick={() => setSelected(r)}
                className={`text-left px-3 py-2 rounded-xl text-sm font-semibold transition-all
                  ${selected === r ? 'bg-primary text-white' : 'hover:bg-input-bg text-text-mid'}`}>
                {r}
              </button>
            ))}
          </div>
          <div className="border-t border-card-border pt-4">
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">
              Kurasa za {selected}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {PERMS[selected]?.map(p => (
                <span key={p} className="px-2 py-1 bg-primary-soft text-primary text-[10px] font-bold rounded-lg">
                  ✅ {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}