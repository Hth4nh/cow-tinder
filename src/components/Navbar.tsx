'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  blur,
  ReducedMotionConfig,
  rotate,
  scale,
  spring,
  transition as motionTransition,
  useShouldReduceMotion,
  useTempoTransition,
} from '@animate-ui/react/utils/motion';
import {
  Highlight,
  HighlightItem,
} from '@animate-ui/react/primitives/effects/highlight';
import {
  RotatingText,
  RotatingTextContainer,
} from '@animate-ui/react/primitives/texts/rotating';
import { ThemeToggler } from '@animate-ui/react/primitives/effects/theme-toggler';
import { AnimateIcon } from '@animate-ui/react/icons';
import { Compass, MessageCircleHeart, SlidersHorizontal, Sun, Moon, Volume2 } from 'lucide-react';
import { CowBellIcon } from '@/components/animate-ui/icons/cow-bell';
import { FlameHerdIcon } from '@/components/animate-ui/icons/flame-herd';
import { CountBadge } from '@/components/CountBadge';
import { playMooSound } from '@/lib/moo-sound';
import { cn } from '@/lib/utils';

export type ActiveTab = 'swipe' | 'explore' | 'matches' | 'profile';

const CYCLING_WORDS = [
  'Đồng Cỏ Xanh',
  'Vân Mỡ A5',
  'Sữa Tươi 42L',
  'Hẹn Hò Chuẩn VIP',
];

export function Navbar({
  activeTab,
  onTabChange,
  unreadMatchesCount,
  totalMatchesCount,
  theme,
  onThemeChange,
  tempo,
  onQuickTempoCycle,
}: {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  unreadMatchesCount: number;
  totalMatchesCount: number;
  theme: 'light' | 'dark';
  onThemeChange: (next: 'light' | 'dark') => void;
  tempo: number;
  onQuickTempoCycle: () => void;
}) {
  return (
    <ReducedMotionConfig>
      <NavbarInner
        activeTab={activeTab}
        onTabChange={onTabChange}
        unreadMatchesCount={unreadMatchesCount}
        totalMatchesCount={totalMatchesCount}
        theme={theme}
        onThemeChange={onThemeChange}
        tempo={tempo}
        onQuickTempoCycle={onQuickTempoCycle}
      />
    </ReducedMotionConfig>
  );
}

function NavbarInner({
  activeTab,
  onTabChange,
  unreadMatchesCount,
  totalMatchesCount,
  theme,
  onThemeChange,
  tempo,
  onQuickTempoCycle,
}: {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  unreadMatchesCount: number;
  totalMatchesCount: number;
  theme: 'light' | 'dark';
  onThemeChange: (next: 'light' | 'dark') => void;
  tempo: number;
  onQuickTempoCycle: () => void;
}) {
  const reduce = useShouldReduceMotion();
  const selectionSpring = useTempoTransition(spring.selection);
  const pressSpring = useTempoTransition(spring.press);
  const spinTransition = useTempoTransition(motionTransition.spin);

  const navItems: {
    id: ActiveTab;
    label: string;
    shortLabel: string;
    badge?: number;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'swipe',
      label: 'Quẹt Đồng Cỏ',
      shortLabel: 'Quẹt',
      icon: <FlameHerdIcon size={18} aria-hidden />,
    },
    {
      id: 'explore',
      label: 'Sổ Phả Hệ',
      shortLabel: 'Phả Hệ',
      badge: totalMatchesCount > 0 ? undefined : undefined,
      icon: <Compass className="h-[18px] w-[18px]" aria-hidden />,
    },
    {
      id: 'matches',
      label: 'Tương Hợp & Chat',
      shortLabel: 'Chat',
      badge: unreadMatchesCount,
      icon: <MessageCircleHeart className="h-[18px] w-[18px]" aria-hidden />,
    },
    {
      id: 'profile',
      label: 'Hồ Sơ & Tempo',
      shortLabel: 'Hồ Sơ',
      icon: <SlidersHorizontal className="h-[18px] w-[18px]" aria-hidden />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-amber-200/70 bg-white/85 backdrop-blur-xl dark:border-stone-800/80 dark:bg-stone-950/85">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Brand Logo + Rotating Text Tagline */}
        <div className="flex items-center gap-3">
          <AnimateIcon animateOnHover asChild>
            <motion.button
              type="button"
              onClick={() => {
                playMooSound(138, true);
                onTabChange('swipe');
              }}
              initial={{ transform: 'scale(1)' }}
              whileTap={{
                transform: reduce ? 'scale(1)' : `scale(${scale.press})`,
              }}
              transition={pressSpring}
              className="group flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white shadow-md shadow-amber-500/20">
                <CowBellIcon size={22} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-lg font-extrabold tracking-tight text-stone-900 dark:text-white">
                    Cow<span className="text-amber-600 dark:text-amber-400">Tinder</span>
                  </span>
                  <span className="hidden rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 sm:inline-block dark:bg-amber-950/80 dark:text-amber-300">
                    Animate UI 2.3
                  </span>
                </div>
                <div className="hidden text-xs text-stone-500 md:block dark:text-stone-400">
                  Kết nối đam mê{' '}
                  <RotatingTextContainer
                    text={CYCLING_WORDS}
                    duration={2600}
                    align="start"
                    style={{ display: 'inline-block', overflow: 'clip' }}
                  >
                    <RotatingText className="font-bold text-amber-600 dark:text-amber-400" />
                  </RotatingTextContainer>
                </div>
              </div>
            </motion.button>
          </AnimateIcon>
        </div>

        {/* Navigation Pill Bar using Animate UI Highlight (recipes/indicator.md) */}
        <nav aria-label="Điều hướng chính" className="flex items-center">
          <Highlight
            controlledItems
            mode="parent"
            value={activeTab}
            onValueChange={(val) => {
              if (
                val === 'swipe' ||
                val === 'explore' ||
                val === 'matches' ||
                val === 'profile'
              ) {
                onTabChange(val);
              }
            }}
            click
            hover={false}
            transition={selectionSpring}
            containerClassName="relative flex items-center rounded-2xl border border-stone-200/80 bg-stone-100/80 p-1 dark:border-stone-800 dark:bg-stone-900/80"
            className="rounded-xl bg-white shadow-sm dark:bg-stone-800"
          >
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <HighlightItem key={item.id} value={item.id} asChild>
                  <button
                    type="button"
                    onClick={() => onTabChange(item.id)}
                    className={cn(
                      'relative z-10 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-colors sm:px-4 sm:text-sm',
                      isActive
                        ? 'text-amber-700 dark:text-amber-300'
                        : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200',
                    )}
                  >
                    <AnimateIcon animateOnHover className="inline-flex">
                      {item.icon}
                    </AnimateIcon>
                    <span className="hidden sm:inline">{item.label}</span>
                    <span className="sm:hidden">{item.shortLabel}</span>
                    {typeof item.badge === 'number' && item.badge > 0 && (
                      <CountBadge count={item.badge} label="tin nhắn mới" />
                    )}
                  </button>
                </HighlightItem>
              );
            })}
          </Highlight>
        </nav>

        {/* Right Controls: Acoustic Moo Test, Tempo Indicator, and Theme Wipe Toggler */}
        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            onClick={() => playMooSound(140, true)}
            initial={{ transform: 'scale(1)' }}
            whileTap={{
              transform: reduce ? 'scale(1)' : `scale(${scale.press})`,
            }}
            transition={pressSpring}
            title="Nghe tiếng bò Mooo & Chuông đồng cỏ"
            className="hidden items-center gap-1.5 rounded-xl border border-amber-200/80 bg-amber-50/80 px-3 py-2 text-xs font-bold text-amber-800 transition-colors hover:bg-amber-100 lg:inline-flex dark:border-amber-900/50 dark:bg-amber-950/50 dark:text-amber-300 dark:hover:bg-amber-900/50"
          >
            <Volume2 className="h-3.5 w-3.5" />
            <span>Mooo!</span>
          </motion.button>

          <motion.button
            type="button"
            onClick={onQuickTempoCycle}
            initial={{ transform: 'scale(1)' }}
            whileTap={{
              transform: reduce ? 'scale(1)' : `scale(${scale.press})`,
            }}
            transition={pressSpring}
            title="Đổi nhịp độ chuyển động AnimateUIProvider (tempo)"
            className="hidden items-center gap-1.5 rounded-xl border border-stone-200/80 bg-stone-100/70 px-2.5 py-2 text-xs font-semibold text-stone-700 transition-colors hover:bg-stone-200/70 sm:inline-flex dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 dark:hover:bg-stone-800"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="tabular-nums">Tempo {tempo}x</span>
          </motion.button>

          {/* Theme Toggler from @animate-ui/react/primitives/effects/theme-toggler */}
          <ThemeToggler
            theme={theme}
            resolvedTheme={theme}
            setTheme={(next) =>
              onThemeChange(next === 'dark' ? 'dark' : 'light')
            }
            direction="ltr"
          >
            {({ resolved, toggleTheme }) => (
              <motion.button
                type="button"
                aria-label={
                  resolved === 'dark'
                    ? 'Chuyển sang giao diện ban ngày'
                    : 'Chuyển sang giao diện ban đêm'
                }
                onClick={() =>
                  toggleTheme(resolved === 'dark' ? 'light' : 'dark')
                }
                initial={{ transform: 'scale(1)' }}
                whileTap={{
                  transform: reduce ? 'scale(1)' : `scale(${scale.press})`,
                }}
                transition={pressSpring}
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200/80 bg-white text-stone-700 shadow-xs transition-colors hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800"
              >
                <span className="relative inline-flex">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={resolved}
                      initial={{
                        opacity: 0,
                        scale: scale.icon,
                        rotate: -rotate.icon,
                        filter: blur.icon,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        rotate: 0,
                        filter: 'blur(0px)',
                        transition: spinTransition,
                      }}
                      exit={{
                        opacity: 0,
                        scale: scale.icon,
                        rotate: rotate.icon,
                        filter: blur.icon,
                        transition: spinTransition,
                      }}
                      className="inline-flex"
                    >
                      {resolved === 'dark' ? (
                        <Moon className="h-4 w-4 text-amber-300" />
                      ) : (
                        <Sun className="h-4 w-4 text-amber-600" />
                      )}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </motion.button>
            )}
          </ThemeToggler>
        </div>
      </div>
    </header>
  );
}
