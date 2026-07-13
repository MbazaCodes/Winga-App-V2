import AdminLayout from '@/components/admin/AdminLayout'

export default function Page() {
  return (
    <AdminLayout title="Arifa">
      <div className="card p-8 text-center">
        <p className="text-5xl mb-4">🔔</p>
        <h2 className="text-lg font-extrabold text-text-dark mb-2">Arifa</h2>
        <p className="text-sm text-text-muted">Ukurasa huu unajengwa — utakamilika hivi karibuni.</p>
      </div>
    </AdminLayout>
  )
}
