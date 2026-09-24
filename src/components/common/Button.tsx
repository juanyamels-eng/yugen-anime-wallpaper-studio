import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-xl gap-1.5 h-8',
    md: 'text-sm px-4 py-2.5 rounded-2xl gap-2 h-11',
    lg: 'text-base px-6 py-3 rounded-2xl gap-2.5 h-13 font-semibold',
  }[size];

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-[#FF4D8D] to-[#EC4899] text-white shadow-lg shadow-[#FF4D8D]/25 hover:shadow-[#FF4D8D]/40 active:scale-[0.98]',
    secondary:
      'bg-[#1E2536] hover:bg-[#252E42] text-white border border-white/10 active:scale-[0.98]',
    ghost:
      'bg-transparent hover:bg-white/10 text-slate-200 active:scale-[0.98]',
    outline:
      'border border-white/20 hover:border-white/40 text-slate-200 bg-transparent active:scale-[0.98]',
    danger:
      'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 active:scale-[0.98]',
  }[variant];

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D8D]/60 ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
