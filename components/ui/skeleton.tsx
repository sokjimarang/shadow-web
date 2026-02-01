import { cn } from '@/lib/utils';

export interface SkeletonProps {
  width?: string;
  height?: string;
  variant?: 'rectangular' | 'circular' | 'text' | 'rounded';
  animation?: 'wave' | 'pulse' | false;
  className?: string;
}

const formatSize = (size?: string): string => {
  if (!size) return '';
  if (size.startsWith('w-') || size.startsWith('h-')) return size;
  if (/^\d+$/.test(size)) return `${size}px`;
  return size;
};

export function Skeleton({
  width,
  height,
  variant = 'rectangular',
  animation = 'wave',
  className,
}: SkeletonProps) {
  const variantClasses = {
    rectangular: 'rounded-none',
    circular: 'rounded-full',
    text: 'rounded scale-y-60 origin-[0_60%]',
    rounded: 'rounded-xl',
  };

  const animationClasses = {
    wave: 'bg-skeleton-gradient animate-skeleton-wave',
    pulse: 'bg-black/[0.08] animate-skeleton-pulse',
  };

  const baseClasses = 'inline-block relative overflow-hidden';
  const noAnimationBg = 'bg-black/[0.08]';

  const widthStyle = width ? { width: formatSize(width) } : { width: '100%' };
  const heightStyle = height ? { height: formatSize(height) } : { height: '20px' };

  return (
    <span
      className={cn(
        baseClasses,
        variantClasses[variant],
        animation ? animationClasses[animation] : noAnimationBg,
        'motion-reduce:animate-none',
        className
      )}
      style={{ ...widthStyle, ...heightStyle }}
    />
  );
}
