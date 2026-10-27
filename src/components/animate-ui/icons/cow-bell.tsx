'use client';

import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@animate-ui/react/icons';

type CowBellProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    group: {
      initial: { rotate: 0 },
      animate: {
        rotate: [0, 20, -10, 10, -5, 3, 0],
        transformOrigin: 'top center',
        transition: { duration: 0.9, ease: 'easeInOut' },
      },
    },
    clapper: {
      initial: { x: 0 },
      animate: {
        x: [0, -5, 4, -4, 3, -2, 1, 0],
        transition: { duration: 1.1, ease: 'easeInOut' },
      },
    },
    strap: {},
    body: {},
  } satisfies Record<string, Variants>,
  ring: {
    group: {
      initial: { rotate: 0 },
      animate: {
        rotate: [0, 22, -16, 13, -10, 7, -4, 2, 0],
        transformOrigin: 'top center',
        transition: { duration: 1.2, ease: 'easeInOut' },
      },
    },
    clapper: {
      initial: { x: 0 },
      animate: {
        x: [0, -6, 5, -5, 4, -3, 2, 0],
        transition: { duration: 1.25, ease: 'easeInOut' },
      },
    },
    strap: {},
    body: {},
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size = 24, ...props }: CowBellProps) {
  const { controls } = useAnimateIconContext();
  const variants = getVariants(animations);

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      variants={variants.group}
      initial="initial"
      animate={controls}
      {...props}
    >
      <motion.path
        d="M9 3h6v3H9z"
        variants={variants.strap}
        initial="initial"
        animate={controls}
      />
      <motion.path
        d="M6 6h12l2 11H4L6 6z"
        variants={variants.body}
        initial="initial"
        animate={controls}
      />
      <motion.path
        d="M10 17a2 2 0 0 0 4 0"
        variants={variants.clapper}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

function CowBell(props: CowBellProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  CowBell,
  CowBell as CowBellIcon,
  type CowBellProps,
  type CowBellProps as CowBellIconProps,
};
