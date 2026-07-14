import Spinner from './Spinner'

interface Props {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  variant?: 'primary' | 'ghost'
  type?: 'button' | 'submit'
  className?: string
}

export default function Button({
  children, onClick, disabled, loading, variant = 'primary', type = 'button', className = ''
}: Props) {
  const base = variant === 'primary' ? 'btn-primary' : 'btn-ghost'
  return (
    <button type={type} onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${className}`}>
      {loading ? <Spinner /> : children}
    </button>
  )
}
