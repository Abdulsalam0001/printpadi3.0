// ============================================================
// PrintPadi – features/product/components/design-method-options.tsx
// Exact port of design-method-options.tsx from the Next.js project.
// ============================================================

import { cn } from '@/lib/utils';
import { DESIGN_METHOD_OPTIONS } from '@/features/product/lib/design-options';

type DesignMethodOptionsProps = {
  value: string;
  onChange: (id: string) => void;
  variant?: 'panel' | 'drawer';
};

export function DesignMethodOptions({
  value,
  onChange,
  variant = 'panel',
}: DesignMethodOptionsProps) {
  const isDrawer = variant === 'drawer';

  return (
    <div>
      <h3
        className={cn(
          'font-medium capitalize text-black',
          isDrawer ? 'text-xs mb-2.75' : 'text-[15px] mb-3',
        )}
      >
        Select Design option
      </h3>
      <div className="flex flex-wrap gap-2">
        {DESIGN_METHOD_OPTIONS.map(option => {
          const isSelected = !option.disabled && value === option.id;

          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-disabled={option.disabled || undefined}
              disabled={option.disabled}
              onClick={() => {
                if (option.disabled) {
                  return;
                }
                onChange(value === option.id ? '' : option.id);
              }}
              className="cursor-pointer disabled:cursor-not-allowed"
            >
              <div
                className={cn(
                  'rounded-full border-[0.5px] border-[#AAAAAA] px-2 py-1 text-[10px] text-[#AAAAAA]',
                  isSelected && 'bg-[#000000] text-white border-[#000000]',
                  option.disabled && 'opacity-50',
                )}
              >
                {option.title}
                {option.disabled ? ' (Coming soon)' : ''}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
