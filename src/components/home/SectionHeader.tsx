import React from 'react';
import { ChevronRight, LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  onViewAll?: () => void;
  actionText?: string;
  icon?: LucideIcon;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  onViewAll,
  actionText = 'Ver todo',
  icon: Icon,
}) => {
  return (
    <div className="flex items-center justify-between px-4 pt-6 pb-2.5">
      <div>
        <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-1.5">
          {Icon && <Icon className="w-4 h-4 text-[#FF4D8D] shrink-0" aria-hidden />}
          {title}
        </h2>
        {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      {onViewAll && (
        <button
          onClick={onViewAll}
          className="min-h-[44px] px-2 text-xs font-semibold text-[#00F2FE] hover:text-white flex items-center gap-0.5 cursor-pointer active:scale-95 transition-all"
        >
          <span>{actionText}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
