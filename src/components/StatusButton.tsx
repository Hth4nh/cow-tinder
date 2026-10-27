'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  blur,
  ReducedMotionConfig,
  scale,
  spring,
  transition as motionTransition,
  useShouldReduceMotion,
  useTempoTransition,
} from '@animate-ui/react/utils/motion';
import { Check, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ActionStatus = 'idle' | 'loading' | 'success' | 'error';

const DEFAULT_LABELS: Record<ActionStatus, string> = {
  idle: 'Lưu hồ sơ đồng cỏ',
  loading: 'Đang đồng bộ chuồng…',
  success: 'Đã lưu sổ phả hệ!',
  error: 'Thử lại lần nữa',
};

export function useActionStatus(action: () => Promise<unknown>, hold = 1500) {
  const [status, setStatus] = React.useState<ActionStatus>('idle');
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  const run = React.useCallback(async () => {
    clearTimeout(timer.current);
    setStatus('loading');
    try {
      await action();
      setStatus('success');
      timer.current = setTimeout(() => setStatus('idle'), hold);
    } catch (error) {
      setStatus('error');
      console.error(error);
    }
  }, [action, hold]);

  return [status, run] as const;
}

export function StatusButton({
  status,
  onClick,
  labels = DEFAULT_LABELS,
  className,
}: {
  status: ActionStatus;
  onClick: () => void;
  labels?: Record<ActionStatus, string>;
  className?: string;
}) {
  return (
    <ReducedMotionConfig>
      <StatusButtonMotion
        status={status}
        onClick={onClick}
        labels={labels}
        className={className}
      />
    </ReducedMotionConfig>
  );
}

function StatusButtonMotion({
  status,
  onClick,
  labels,
  className,
}: {
  status: ActionStatus;
  onClick: () => void;
  labels: Record<ActionStatus, string>;
  className?: string;
}) {
  const reduce = useShouldReduceMotion();
  const press = useTempoTransition(spring.press);
  const resize = useTempoTransition(spring.reflow);
  const swap = useTempoTransition(motionTransition.swap);

  return (
    <motion.button
      type="button"
      layout
      onClick={onClick}
      disabled={status === 'loading'}
      aria-live="polite"
      initial={{ transform: 'scale(1)' }}
      whileTap={{ transform: reduce ? 'scale(1)' : `scale(${scale.press})` }}
      transition={{ ...press, layout: resize }}
      className={cn(
        'inline-flex h-11 items-center justify-center gap-2.5 overflow-hidden rounded-xl px-5 text-sm font-bold text-white shadow-sm transition-colors disabled:opacity-75',
        status === 'success'
          ? 'bg-emerald-600 hover:bg-emerald-500'
          : status === 'error'
            ? 'bg-rose-600 hover:bg-rose-500'
            : 'bg-amber-600 hover:bg-amber-500',
        className,
      )}
    >
      <span className="relative inline-flex items-center justify-center">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={status}
            initial={{ opacity: 0, scale: scale.icon, filter: blur.icon }}
            animate={{
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)',
              transition: swap,
            }}
            exit={{
              opacity: 0,
              scale: scale.icon,
              filter: blur.icon,
              transition: swap,
            }}
            className="inline-flex"
          >
            {status === 'loading' ? (
              <Loader2 className="h-4 w-4 motion-safe:animate-spin" />
            ) : status === 'success' ? (
              <Check className="h-4 w-4" />
            ) : status === 'error' ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
          </motion.span>
        </AnimatePresence>
      </span>

      <span className="relative inline-flex">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={status}
            layout="position"
            initial={{ opacity: 0, filter: blur.icon }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: blur.icon, transition: swap }}
            transition={{ ...swap, layout: resize }}
          >
            {labels[status]}
          </motion.span>
        </AnimatePresence>
      </span>
    </motion.button>
  );
}

/**
 * Swap Label button following `references/recipes/swap.md` § "A label taking turns in a control"
 * Every label sits invisible in the same grid cell `[grid-area:1/1]` so the control never jumps in width.
 */
export function CopyEarTagButton({ earTag }: { earTag: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(earTag).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <ReducedMotionConfig>
      <CopyEarTagButtonInner
        earTag={earTag}
        copied={copied}
        onCopy={handleCopy}
      />
    </ReducedMotionConfig>
  );
}

function CopyEarTagButtonInner({
  earTag,
  copied,
  onCopy,
}: {
  earTag: string;
  copied: boolean;
  onCopy: () => void;
}) {
  const reduce = useShouldReduceMotion();
  const press = useTempoTransition(spring.press);
  const swap = useTempoTransition(motionTransition.swap);

  const labels = {
    idle: `Mã tai: ${earTag}`,
    copied: 'Đã chép mã tai!',
  } as const;

  return (
    <motion.button
      type="button"
      onClick={onCopy}
      initial={{ transform: 'scale(1)' }}
      whileTap={{ transform: reduce ? 'scale(1)' : `scale(${scale.press})` }}
      transition={press}
      className="inline-flex items-center gap-2 rounded-xl border border-amber-300/80 bg-amber-50/90 px-3.5 py-2 text-xs font-bold text-amber-900 transition-colors hover:bg-amber-100 dark:border-amber-800/70 dark:bg-amber-950/60 dark:text-amber-200 dark:hover:bg-amber-900/60"
    >
      <span className="relative inline-grid place-items-center">
        {Object.values(labels).map((label) => (
          <span key={label} aria-hidden className="invisible [grid-area:1/1]">
            {label}
          </span>
        ))}
        <span className="[grid-area:1/1]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={copied ? 'copied' : 'idle'}
              className="inline-block"
              initial={{ opacity: 0, filter: blur.icon }}
              animate={{ opacity: 1, filter: 'blur(0px)', transition: swap }}
              exit={{ opacity: 0, filter: blur.icon, transition: swap }}
            >
              {copied ? labels.copied : labels.idle}
            </motion.span>
          </AnimatePresence>
        </span>
      </span>
    </motion.button>
  );
}
