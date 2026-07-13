import Sidebar from './Sidebar'
import Topbar from './Topbar'

interface Props { title: string; children: React.ReactNode }

export default function AdminLayout({ title, children }: Props) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-60">
        <Topbar title={title} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
