'use client';

import * as React from 'react';
import { useAnimate } from 'motion/react';
import { SlidingNumber } from '@animate-ui/react/primitives/texts/sliding-number';
import {
  ReducedMotionConfig,
  spring,
  useShouldReduceMotion,
  useTempoTransition,
} from '@animate-ui/react/utils/motion';
import { cn } from '@/lib/utils';

export function CountBadge({
  count,
  label = 'thông báo',
  className,
}: {
  count: number;
  label?: string;
  className?: string;
}) {
  return (
    <ReducedMotionConfig>
      <CountBadgeInner count={count} label={label} className={className} />
    </ReducedMotionConfig>
  );
}

function CountBadgeInner({
  count,
  label,
  className,
}: {
  count: number;
  label: string;
  className?: string;
}) {
  const [scope, animate] = useAnimate<HTMLSpanElement>();
  const reduce = useShouldReduceMotion();
  const bump = useTempoTransition(spring.bounce);
  const previous = React.useRef(count);

  React.useEffect(() => {
    const grew = count > previous.current;
    previous.current = count;
    if (grew && !reduce && scope.current) {
      animate(scope.current, { scale: [1.15, 1] }, bump);
    }
  }, [count, reduce, animate, scope, bump]);

  if (count <= 0) return null;

  return (
    <span
      ref={scope}
      aria-label={`${count} ${label}`}
      className={cn(
        'inline-flex min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[11px] font-bold leading-none text-white shadow-xs tabular-nums',
        className,
      )}
    >
      <SlidingNumber number={count} />
    </span>
  );
}
