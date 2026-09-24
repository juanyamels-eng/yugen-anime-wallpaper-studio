import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  subtitle: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  subtitle,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 min-h-[320px] max-w-md mx-auto">
      <div className="w-16 h-16 rounded-3xl bg-[#161B28] border border-white/10 flex items-center justify-center text-[#FF4D8D] mb-4 shadow-xl shadow-[#FF4D8D]/5">
        {icon || <Sparkles className="w-8 h-8 stroke-[1.5]" />}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed mb-6">{subtitle}</p>
      {actionText && onAction && (
        <Button onClick={onAction} size="md">
          {actionText}
        </Button>
      )}
    </div>
  );
};
