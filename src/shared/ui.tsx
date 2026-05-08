import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: 'primary' | 'secondary' | 'quiet' | 'danger'
}

export function Button({ children, className = '', tone = 'secondary', ...props }: ButtonProps) {
  return (
    <button className={`button ${tone} ${className}`.trim()} type="button" {...props}>
      {children}
    </button>
  )
}

export function ToolPanel({
  children,
  className = '',
  title,
}: PropsWithChildren<{ className?: string; title: string }>) {
  return (
    <section className={`tool-panel ${className}`.trim()} aria-label={title}>
      {children}
    </section>
  )
}

export function EmptyState({ children }: PropsWithChildren) {
  return <div className="empty-state">{children}</div>
}
