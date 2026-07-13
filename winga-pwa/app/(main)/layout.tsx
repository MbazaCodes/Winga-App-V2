import WingaBottomNav from '@/components/winga/WingaBottomNav'

export default function WingaMainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white pb-24">
      {children}
      <WingaBottomNav />
    </div>
  )
}
