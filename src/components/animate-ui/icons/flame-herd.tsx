'use client';

import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@animate-ui/react/icons';

type FlameHerdProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    group: {
      initial: { rotate: 0, scaleY: 1 },
      animate: {
        rotate: [0, -7, 9, -5, 3, 0],
        scaleY: [1, 1.05, 0.96, 1.03, 1],
        transformOrigin: '50% 100%',
        transition: { duration: 0.7, ease: 'easeInOut' },
      },
    },
    outerFlame: {},
    innerCore: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 1.12, 0.95, 1],
        transformOrigin: '50% 100%',
        transition: { duration: 0.7, ease: 'easeInOut' },
      },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size = 24, ...props }: FlameHerdProps) {
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
        d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
        variants={variants.outerFlame}
        initial="initial"
        animate={controls}
      />
      <motion.path
        d="M12 18a2.5 2.5 0 0 0 2.5-2.5c0-1-.6-1.8-1.5-2.5-.6 1-1.5 1.5-2 2.5a1.8 1.8 0 0 0 1 2.5z"
        variants={variants.innerCore}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

function FlameHerd(props: FlameHerdProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  FlameHerd,
  FlameHerd as FlameHerdIcon,
  type FlameHerdProps,
  type FlameHerdProps as FlameHerdIconProps,
};
