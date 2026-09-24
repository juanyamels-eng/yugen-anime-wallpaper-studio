import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  variant?: 'glass' | 'solid' | 'ghost' | 'active';
  size?: 'sm' | 'md' | 'lg';
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  variant = 'glass',
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'w-9 h-9 min-w-[36px] min-h-[36px]',
    md: 'w-11 h-11 min-w-[44px] min-h-[44px]',
    lg: 'w-13 h-13 min-w-[52px] min-h-[52px]',
  }[size];

  const variantStyles = {
    glass: 'bg-black/40 backdrop-blur-md text-white border border-white/15 hover:bg-black/60 active:scale-95',
    solid: 'bg-[#181D29] text-white hover:bg-[#202738] active:scale-95 border border-white/10',
    ghost: 'bg-transparent text-slate-300 hover:text-white hover:bg-white/10 active:scale-95',
    active: 'bg-[#FF4D8D] text-white shadow-lg shadow-[#FF4D8D]/30 active:scale-95',
  }[variant];

  return (
    <button
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center rounded-2xl transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D8D]/60 ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
};
