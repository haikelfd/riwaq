interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'accent' | 'sold';
  className?: string;
}

const variantClasses = {
  default: 'bg-slate-100 text-slate-600',
  success: 'bg-accent-50 text-accent-700',
  warning: 'bg-brand-50 text-brand-600',
  accent: 'bg-accent-100 text-accent-700',
  sold: 'bg-red-50 text-red-600',
};

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
