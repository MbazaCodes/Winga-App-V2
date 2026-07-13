interface Props {
  icon: string
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export default function EmptyState({ icon, title, subtitle, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="text-base font-bold text-text-dark mb-2">{title}</h3>
      {subtitle && <p className="text-sm text-text-muted mb-6">{subtitle}</p>}
      {action}
    </div>
  )
}
