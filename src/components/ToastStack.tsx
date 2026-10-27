'use client';

import { AnimatePresence, motion } from 'motion/react';
import {
  blur,
  ReducedMotionConfig,
  scale,
  spring,
  transition as motionTransition,
  useTempoTransition,
} from '@animate-ui/react/utils/motion';
import { X, Sparkles, Heart, BellRing } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'match' | 'super' | 'info';
}

export function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  const enter = useTempoTransition(spring.toast);
  const leave = useTempoTransition(motionTransition.dismiss);

  return (
    <ReducedMotionConfig>
      <ol
        className="pointer-events-none fixed right-4 bottom-4 z-50 flex max-w-sm flex-col gap-2.5"
        aria-live="polite"
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <motion.li
              key={toast.id}
              layout="position"
              initial={{
                opacity: 0,
                y: '100%',
                scale: scale.toast,
                filter: blur.surface,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                filter: 'blur(0px)',
                transition: enter,
              }}
              exit={{
                opacity: 0,
                scale: scale.toast,
                filter: blur.surface,
                transition: leave,
              }}
              transition={enter}
              style={{ originY: 1 }}
              className={cn(
                'pointer-events-auto flex items-start gap-3 rounded-2xl border p-3.5 shadow-lg backdrop-blur-md',
                toast.variant === 'match'
                  ? 'border-rose-300 bg-rose-950/90 text-white dark:border-rose-700'
                  : toast.variant === 'super'
                    ? 'border-amber-300 bg-amber-950/90 text-amber-50 dark:border-amber-600'
                    : 'border-stone-200/90 bg-white/95 text-stone-900 dark:border-stone-800 dark:bg-stone-900/95 dark:text-stone-100',
              )}
            >
              <div
                className={cn(
                  'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl',
                  toast.variant === 'match'
                    ? 'bg-rose-500/25 text-rose-300'
                    : toast.variant === 'super'
                      ? 'bg-amber-500/25 text-amber-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
                )}
              >
                {toast.variant === 'match' ? (
                  <Heart className="h-4 w-4 fill-current" />
                ) : toast.variant === 'super' ? (
                  <Sparkles className="h-4 w-4" />
                ) : (
                  <BellRing className="h-4 w-4" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold leading-tight">{toast.title}</p>
                {toast.description && (
                  <p className="mt-1 text-xs opacity-85">{toast.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                aria-label="Đóng thông báo"
                className="rounded-lg p-1 opacity-70 transition-colors hover:bg-black/10 hover:opacity-100 dark:hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
    </ReducedMotionConfig>
  );
}
