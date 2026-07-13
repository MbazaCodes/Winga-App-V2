import BottomNav from '@/components/shared/BottomNav'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white pb-24">
      {children}
      <BottomNav />
    </div>
  )
}
