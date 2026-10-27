'use client';

import * as React from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from 'motion/react';
import {
  blur,
  ReducedMotionConfig,
  scale,
  spring,
  transition as motionTransition,
  useShouldReduceMotion,
  useTempoTransition,
} from '@animate-ui/react/utils/motion';
import {
  Particles,
  ParticlesEffect,
} from '@animate-ui/react/primitives/effects/particles';
import { CountingNumber } from '@animate-ui/react/primitives/texts/counting-number';
import * as TooltipPrimitive from '@animate-ui/react/primitives/radix-ui/tooltip';
import * as DialogPrimitive from '@animate-ui/react/primitives/radix-ui/dialog';
import { AnimateIcon } from '@animate-ui/react/icons';
import {
  RotateCcw,
  X,
  Zap,
  MapPin,
  ShieldCheck,
  Award,
  Sparkles,
  Volume2,
  Info,
  ChevronLeft,
  ChevronRight,
  Wheat,
  Music,
  Scale,
  Droplets,
} from 'lucide-react';
import { HeartSparkIcon } from '@/components/animate-ui/icons/heart-spark';
import { SuperStarIcon } from '@/components/animate-ui/icons/super-star';
import { CowBellIcon } from '@/components/animate-ui/icons/cow-bell';
import type { CowProfile } from '@/data/cows';
import { playMooSound } from '@/lib/moo-sound';
import { cn } from '@/lib/utils';

export type SwipeDirection = 'left' | 'right' | 'super';

export function SwipeDeck({
  deck,
  swipedHistory,
  superMooCount,
  boostActive,
  onSwipe,
  onRewind,
  onResetDeck,
  onTriggerBoost,
}: {
  deck: CowProfile[];
  swipedHistory: { cow: CowProfile; direction: SwipeDirection }[];
  superMooCount: number;
  boostActive: boolean;
  onSwipe: (cow: CowProfile, direction: SwipeDirection) => void;
  onRewind: () => void;
  onResetDeck: () => void;
  onTriggerBoost: () => void;
}) {
  return (
    <ReducedMotionConfig>
      <SwipeDeckInner
        deck={deck}
        swipedHistory={swipedHistory}
        superMooCount={superMooCount}
        boostActive={boostActive}
        onSwipe={onSwipe}
        onRewind={onRewind}
        onResetDeck={onResetDeck}
        onTriggerBoost={onTriggerBoost}
      />
    </ReducedMotionConfig>
  );
}

function SwipeDeckInner({
  deck,
  swipedHistory,
  superMooCount,
  boostActive,
  onSwipe,
  onRewind,
  onResetDeck,
  onTriggerBoost,
}: {
  deck: CowProfile[];
  swipedHistory: { cow: CowProfile; direction: SwipeDirection }[];
  superMooCount: number;
  boostActive: boolean;
  onSwipe: (cow: CowProfile, direction: SwipeDirection) => void;
  onRewind: () => void;
  onResetDeck: () => void;
  onTriggerBoost: () => void;
}) {
  const reduce = useShouldReduceMotion();
  const pressSpring = useTempoTransition(spring.press);
  const slideSpring = useTempoTransition(spring.slide);
  const dismissTransition = useTempoTransition(motionTransition.dismiss);
  const swapTransition = useTempoTransition(motionTransition.swap);

  const currentCow = deck[0] ?? null;
  const nextCow = deck[1] ?? null;

  const [photoIndex, setPhotoIndex] = React.useState(0);
  const [exitDirection, setExitDirection] = React.useState<SwipeDirection>('right');
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [superBurst, setSuperBurst] = React.useState(false);
  const [likeBurst, setLikeBurst] = React.useState(false);

  // Motion values for zero-re-render pointer tracking (Rule A10)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateCard = useTransform(x, [-260, 0, 260], reduce ? [0, 0, 0] : [-13, 0, 13]);
  const likeStampOpacity = useTransform(x, [25, 130], [0, 1]);
  const nopeStampOpacity = useTransform(x, [-25, -130], [0, 1]);
  const superStampOpacity = useTransform(y, [-25, -120], [0, 1]);
  const nextCardScale = useTransform(
    x,
    [-220, 0, 220],
    reduce ? [1, 1, 1] : [1, 0.95, 1],
  );

  // Reset photo index and drag coordinates when top cow changes
  React.useEffect(() => {
    setPhotoIndex(0);
    x.set(0);
    y.set(0);
  }, [currentCow?.id, x, y]);

  const triggerSwipe = React.useCallback(
    (direction: SwipeDirection) => {
      if (!currentCow) return;
      setExitDirection(direction);
      if (direction === 'super') {
        setSuperBurst(true);
        playMooSound(currentCow.stats.mooPitchHz * 1.15, true);
        setTimeout(() => setSuperBurst(false), 650);
      } else if (direction === 'right') {
        setLikeBurst(true);
        playMooSound(currentCow.stats.mooPitchHz, false);
        setTimeout(() => setLikeBurst(false), 550);
      }
      onSwipe(currentCow, direction);
    },
    [currentCow, onSwipe],
  );

  // Keyboard navigation animates identically to pointer (Rule A2)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        detailOpen ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        triggerSwipe('left');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        triggerSwipe('right');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        triggerSwipe('super');
      } else if (e.key === 'Backspace' || e.key.toLowerCase() === 'z') {
        if (swipedHistory.length > 0) {
          e.preventDefault();
          onRewind();
        }
      } else if (e.key === ' ') {
        if (currentCow) {
          e.preventDefault();
          setDetailOpen((prev) => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentCow, detailOpen, onRewind, swipedHistory.length, triggerSwipe]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (!currentCow) return;
    if (info.offset.y < -115 && Math.abs(info.offset.x) < 110) {
      x.stop();
      y.stop();
      triggerSwipe('super');
    } else if (info.offset.x > 115 || info.velocity.x > 520) {
      x.stop();
      y.stop();
      triggerSwipe('right');
    } else if (info.offset.x < -115 || info.velocity.x < -520) {
      x.stop();
      y.stop();
      triggerSwipe('left');
    }
  };

  const exitVariants = {
    exit: (dir: SwipeDirection) => ({
      opacity: 0,
      x: reduce ? 0 : dir === 'left' ? -420 : dir === 'right' ? 420 : 0,
      y: reduce ? 0 : dir === 'super' ? -420 : 20,
      rotate: reduce ? 0 : dir === 'left' ? -18 : dir === 'right' ? 18 : 0,
      scale: reduce ? scale.toast : 0.92,
      filter: blur.surface,
      transition: dismissTransition,
    }),
  };

  return (
    <TooltipPrimitive.Provider delayDuration={180}>
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-8 px-4 py-6 lg:grid-cols-12 sm:px-6">
        {/* Left Column: Pasture Radar & Daily Herd Stats */}
        <aside className="order-2 flex flex-col gap-4 lg:order-1 lg:col-span-4">
          <div className="rounded-3xl border border-amber-200/80 bg-white/90 p-5 shadow-sm backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/90">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Radar Đồng Cỏ Đang Bật
              </span>
              {boostActive && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-0.5 text-[11px] font-bold text-white">
                  <Zap className="h-3 w-3 fill-current" /> x2 Tương Hợp
                </span>
              )}
            </div>

            <h2 className="font-display mt-3 text-lg font-extrabold text-stone-900 dark:text-white">
              Thống Kê Đàn Bò Hôm Nay
            </h2>
            <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
              Cập nhật trực tiếp từ các thảo nguyên Mộc Châu, Đà Lạt, Ba Vì & Củ Chi.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-stone-200/70 bg-stone-50/80 p-3 dark:border-stone-800 dark:bg-stone-950/60">
                <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                  Ứng viên trên đồng
                </span>
                <div className="mt-1 flex items-baseline gap-1 font-display text-2xl font-extrabold text-stone-900 tabular-nums dark:text-white">
                  <CountingNumber number={deck.length} />
                  <span className="text-xs font-semibold text-stone-500">bò VIP</span>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200/70 bg-amber-50/60 p-3 dark:border-amber-900/40 dark:bg-amber-950/30">
                <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300">
                  Siêu Sao (Super Moo)
                </span>
                <div className="mt-1 flex items-baseline gap-1 font-display text-2xl font-extrabold text-amber-600 tabular-nums dark:text-amber-400">
                  <CountingNumber number={superMooCount} />
                  <span className="text-xs font-semibold text-amber-700/80 dark:text-amber-300/80">
                    lượt còn lại
                  </span>
                </div>
              </div>
            </div>

            {/* Keyboard Shortcut Guide */}
            <div className="mt-4 rounded-2xl border border-stone-200/60 bg-stone-50/60 p-3.5 dark:border-stone-800/80 dark:bg-stone-950/50">
              <p className="text-xs font-bold text-stone-700 dark:text-stone-300">
                Phím tắt bàn phím (Chuẩn Rule A2)
              </p>
              <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs text-stone-600 dark:text-stone-400">
                <div className="flex items-center gap-2">
                  <kbd className="rounded-md border border-stone-300 bg-white px-1.5 py-0.5 font-mono text-[11px] font-bold shadow-2xs dark:border-stone-700 dark:bg-stone-800">
                    ←
                  </kbd>
                  <span>Bỏ qua</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="rounded-md border border-stone-300 bg-white px-1.5 py-0.5 font-mono text-[11px] font-bold shadow-2xs dark:border-stone-700 dark:bg-stone-800">
                    →
                  </kbd>
                  <span>Thả tim</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="rounded-md border border-stone-300 bg-white px-1.5 py-0.5 font-mono text-[11px] font-bold shadow-2xs dark:border-stone-700 dark:bg-stone-800">
                    ↑
                  </kbd>
                  <span>Siêu Bò</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="rounded-md border border-stone-300 bg-white px-1.5 py-0.5 font-mono text-[11px] font-bold shadow-2xs dark:border-stone-700 dark:bg-stone-800">
                    Space
                  </kbd>
                  <span>Mở phả hệ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Current Cow Quick Pedigree Highlights */}
          {currentCow && (
            <div className="rounded-3xl border border-stone-200/80 bg-white/90 p-5 shadow-sm backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/90">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Chỉ Số Giống Nổi Bật
                </span>
                <span className="rounded-lg bg-stone-100 px-2 py-0.5 font-mono text-xs font-bold text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                  {currentCow.earTag}
                </span>
              </div>

              <div className="mt-3.5 grid grid-cols-3 gap-2.5 text-center">
                <div className="rounded-2xl bg-stone-100/80 p-2.5 dark:bg-stone-800/70">
                  <Scale className="mx-auto h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <div className="mt-1 font-display text-base font-extrabold text-stone-900 tabular-nums dark:text-white">
                    <CountingNumber
                      number={currentCow.stats.weightKg}
                      fromNumber={400}
                    />
                    <span className="text-[11px] font-medium">kg</span>
                  </div>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400">
                    Cân nặng
                  </p>
                </div>

                <div className="rounded-2xl bg-stone-100/80 p-2.5 dark:bg-stone-800/70">
                  <Sparkles className="mx-auto h-4 w-4 text-rose-500" />
                  <div className="mt-1 font-display text-base font-extrabold text-stone-900 tabular-nums dark:text-white">
                    BMS <CountingNumber number={currentCow.stats.marblingScore} />
                  </div>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400">
                    Vân mỡ
                  </p>
                </div>

                <div className="rounded-2xl bg-stone-100/80 p-2.5 dark:bg-stone-800/70">
                  <Droplets className="mx-auto h-4 w-4 text-sky-500" />
                  <div className="mt-1 font-display text-base font-extrabold text-stone-900 tabular-nums dark:text-white">
                    <CountingNumber
                      number={currentCow.stats.calmness}
                      fromNumber={75}
                    />
                    <span className="text-[11px] font-medium">%</span>
                  </div>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400">
                    Điềm đạm
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-2xl bg-emerald-50/90 px-3.5 py-2.5 text-xs text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200">
                <Wheat className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>
                  <strong>Món khoái khẩu:</strong> {currentCow.favoriteGrass}
                </span>
              </div>
            </div>
          )}
        </aside>

        {/* Center/Right Column: Interactive Card Stack & Action Dock */}
        <section
          aria-label="Bộ bài quẹt ghép đôi bò"
          className="order-1 flex flex-col items-center lg:order-2 lg:col-span-8"
        >
          <div className="relative flex h-[590px] w-full max-w-[430px] items-center justify-center select-none">
            {/* Background Next Card Preview */}
            {nextCow && (
              <motion.div
                key={`preview-${nextCow.id}`}
                style={{ scale: nextCardScale }}
                className="pointer-events-none absolute inset-0 overflow-hidden rounded-[32px] border border-stone-200/80 bg-white shadow-md dark:border-stone-800 dark:bg-stone-900"
                aria-hidden
              >
                <img
                  src={nextCow.images[0]}
                  alt=""
                  className="h-full w-full object-cover opacity-60 blur-[1px]"
                />
              </motion.div>
            )}

            {/* Active Top Swipe Card */}
            <AnimatePresence mode="popLayout" custom={exitDirection}>
              {currentCow ? (
                <motion.article
                  key={currentCow.id}
                  custom={exitDirection}
                  variants={exitVariants}
                  initial={{
                    opacity: 0,
                    scale: reduce ? 1 : 0.94,
                    filter: blur.surface,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    filter: 'blur(0px)',
                    transition: slideSpring,
                  }}
                  exit="exit"
                  drag={reduce ? false : true}
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  dragElastic={0.85}
                  dragTransition={{
                    bounceStiffness: slideSpring.stiffness as number,
                    bounceDamping: slideSpring.damping as number,
                  }}
                  onDragEnd={handleDragEnd}
                  style={{ x, y, rotate: rotateCard }}
                  className="relative h-full w-full cursor-grab overflow-hidden rounded-[32px] border border-stone-200/90 bg-stone-900 shadow-2xl active:cursor-grabbing dark:border-stone-700"
                >
                  {/* Photo Gallery with Swap Blur */}
                  <div className="relative h-full w-full">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.img
                        key={`${currentCow.id}-photo-${photoIndex}`}
                        src={currentCow.images[photoIndex]}
                        alt={`${currentCow.name} - ảnh ${photoIndex + 1}`}
                        draggable={false}
                        initial={{ opacity: 0, filter: blur.icon }}
                        animate={{
                          opacity: 1,
                          filter: 'blur(0px)',
                          transition: swapTransition,
                        }}
                        exit={{
                          opacity: 0,
                          filter: blur.icon,
                          transition: swapTransition,
                        }}
                        className="h-full w-full object-cover select-none"
                      />
                    </AnimatePresence>

                    {/* Top Photo Progress Bars */}
                    <div className="absolute inset-x-4 top-3.5 z-20 flex gap-1.5">
                      {currentCow.images.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          aria-label={`Xem ảnh ${idx + 1}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setPhotoIndex(idx);
                          }}
                          className="group relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/35 backdrop-blur-xs"
                        >
                          <span
                            className={cn(
                              'block h-full rounded-full bg-white transition-opacity',
                              idx === photoIndex ? 'opacity-100' : 'opacity-0',
                            )}
                          />
                        </button>
                      ))}
                    </div>

                    {/* Left / Right Photo Switch Buttons */}
                    <button
                      type="button"
                      aria-label="Ảnh trước"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPhotoIndex((prev) =>
                          prev > 0 ? prev - 1 : currentCow.images.length - 1,
                        );
                      }}
                      className="absolute top-1/3 left-2.5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/25 text-white/90 backdrop-blur-xs transition-colors hover:bg-black/45"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Ảnh tiếp theo"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPhotoIndex((prev) =>
                          prev < currentCow.images.length - 1 ? prev + 1 : 0,
                        );
                      }}
                      className="absolute top-1/3 right-2.5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/25 text-white/90 backdrop-blur-xs transition-colors hover:bg-black/45"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>

                    {/* Gesture Stamps (Driven by MotionValues without re-renders) */}
                    <motion.div
                      style={{ opacity: likeStampOpacity }}
                      className="pointer-events-none absolute top-14 left-6 z-20 -rotate-12 rounded-2xl border-4 border-emerald-400 bg-emerald-950/75 px-4 py-1.5 font-display text-2xl font-extrabold tracking-wider text-emerald-300 uppercase shadow-lg backdrop-blur-xs"
                    >
                      HỢP ĐỒNG CỎ 💚
                    </motion.div>

                    <motion.div
                      style={{ opacity: nopeStampOpacity }}
                      className="pointer-events-none absolute top-14 right-6 z-20 rotate-12 rounded-2xl border-4 border-rose-400 bg-rose-950/75 px-4 py-1.5 font-display text-2xl font-extrabold tracking-wider text-rose-300 uppercase shadow-lg backdrop-blur-xs"
                    >
                      LƯỚT QUA 👋
                    </motion.div>

                    <motion.div
                      style={{ opacity: superStampOpacity }}
                      className="pointer-events-none absolute inset-x-0 top-24 z-20 mx-auto w-fit rounded-2xl border-4 border-amber-300 bg-amber-950/85 px-5 py-1.5 font-display text-2xl font-extrabold tracking-wider text-amber-300 uppercase shadow-lg backdrop-blur-xs"
                    >
                      SIÊU BÒ VIP ⭐
                    </motion.div>

                    {/* Acoustic Moo Sound Pill on Card */}
                    <div className="absolute top-11 right-4 z-20">
                      <motion.button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playMooSound(currentCow.stats.mooPitchHz, true);
                        }}
                        initial={{ transform: 'scale(1)' }}
                        whileTap={{
                          transform: reduce ? 'scale(1)' : `scale(${scale.press})`,
                        }}
                        transition={pressSpring}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/45 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md transition-colors hover:bg-black/65"
                      >
                        <Volume2 className="h-3.5 w-3.5 text-amber-300" />
                        <span>Nghe giọng ({currentCow.stats.mooPitchHz}Hz)</span>
                      </motion.button>
                    </div>

                    {/* Bottom Info Overlay */}
                    <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/95 via-black/75 to-transparent p-6 pt-20 text-white">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-2.5 py-0.5 text-[11px] font-extrabold text-stone-950">
                          <Award className="h-3 w-3" />
                          {currentCow.awardBadge}
                        </span>
                        <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur-xs">
                          {currentCow.purpose}
                        </span>
                      </div>

                      <div className="mt-2 flex items-end justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h1 className="font-display text-3xl font-extrabold tracking-tight">
                              {currentCow.name}
                            </h1>
                            <span className="text-xl font-semibold text-amber-300">
                              {currentCow.ageLabel}
                            </span>
                            {currentCow.verified && (
                              <ShieldCheck
                                className="h-6 w-6 fill-sky-400 text-stone-950"
                                aria-label="Đã xác minh sổ phả hệ"
                              />
                            )}
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-stone-200">
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-amber-400" />
                              {currentCow.region} • Cách {currentCow.distanceKm} km
                            </span>
                            <span className="rounded-md bg-white/15 px-2 py-0.5 font-semibold">
                              {currentCow.breed}
                            </span>
                          </div>
                        </div>

                        <motion.button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDetailOpen(true);
                          }}
                          initial={{ transform: 'scale(1)' }}
                          whileTap={{
                            transform: reduce
                              ? 'scale(1)'
                              : `scale(${scale.press})`,
                          }}
                          transition={pressSpring}
                          aria-label="Xem chi tiết phả hệ"
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/25 bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/25"
                        >
                          <Info className="h-5 w-5" />
                        </motion.button>
                      </div>

                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-stone-200/95">
                        {currentCow.bio}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {currentCow.badges.map((badge) => (
                          <span
                            key={badge}
                            className="rounded-lg border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-medium text-stone-100"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.article>
              ) : (
                /* Empty Deck State */
                <motion.div
                  key="empty-deck"
                  initial={{ opacity: 0, filter: blur.surface }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  className="flex h-full w-full flex-col items-center justify-center rounded-[32px] border border-dashed border-amber-300 bg-white/90 p-8 text-center shadow-lg dark:border-stone-700 dark:bg-stone-900/90"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-100 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400">
                    <CowBellIcon size={42} animate loop loopDelay={1.2} />
                  </div>
                  <h3 className="font-display mt-5 text-2xl font-extrabold text-stone-900 dark:text-white">
                    Đã Hết Bò Trên Đồng Cỏ Này!
                  </h3>
                  <p className="mt-2 max-w-xs text-sm text-stone-600 dark:text-stone-400">
                    Bạn đã xem hết tất cả ứng viên bò VIP quanh khu vực. Muốn gọi đàn bò quay trở lại đồng cỏ không?
                  </p>
                  <motion.button
                    type="button"
                    onClick={onResetDeck}
                    initial={{ transform: 'scale(1)' }}
                    whileTap={{
                      transform: reduce ? 'scale(1)' : `scale(${scale.press})`,
                    }}
                    transition={pressSpring}
                    className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-bold text-white shadow-md hover:from-amber-600 hover:to-orange-600"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Gọi Đàn Bò Quay Lại</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Dock with Animate UI Tooltips, Particles, and Animated Icons */}
          <div className="mt-5 flex items-center justify-center gap-3.5 sm:gap-5">
            {/* 1. Rewind Button */}
            <TooltipPrimitive.Root>
              <TooltipPrimitive.Trigger asChild>
                <motion.button
                  type="button"
                  disabled={swipedHistory.length === 0}
                  onClick={onRewind}
                  initial={{ transform: 'scale(1)' }}
                  whileTap={{
                    transform: reduce ? 'scale(1)' : `scale(${scale.press})`,
                  }}
                  transition={pressSpring}
                  aria-label="Hoàn tác lượt quẹt trước"
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-stone-200 bg-white text-amber-600 shadow-md transition-colors hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-stone-800 dark:bg-stone-900 dark:text-amber-400 dark:hover:bg-stone-800"
                >
                  <RotateCcw className="h-5 w-5" />
                </motion.button>
              </TooltipPrimitive.Trigger>
              <TooltipPrimitive.Portal>
                <TooltipPrimitive.Content
                  sideOffset={8}
                  className="z-50 rounded-xl bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white shadow-md dark:bg-stone-100 dark:text-stone-900"
                >
                  Hoàn tác (Backspace)
                </TooltipPrimitive.Content>
              </TooltipPrimitive.Portal>
            </TooltipPrimitive.Root>

            {/* 2. Pass / Nope Button */}
            <TooltipPrimitive.Root>
              <TooltipPrimitive.Trigger asChild>
                <motion.button
                  type="button"
                  disabled={!currentCow}
                  onClick={() => triggerSwipe('left')}
                  initial={{ transform: 'scale(1)' }}
                  whileTap={{
                    transform: reduce ? 'scale(1)' : `scale(${scale.press})`,
                  }}
                  transition={pressSpring}
                  aria-label="Bỏ qua ứng viên này"
                  className="flex h-15 w-15 items-center justify-center rounded-3xl border-2 border-rose-200 bg-white text-rose-500 shadow-lg transition-colors hover:border-rose-300 hover:bg-rose-50 disabled:opacity-40 dark:border-rose-900/60 dark:bg-stone-900 dark:hover:bg-rose-950/50"
                >
                  <X className="h-7 w-7 stroke-[2.5]" />
                </motion.button>
              </TooltipPrimitive.Trigger>
              <TooltipPrimitive.Portal>
                <TooltipPrimitive.Content
                  sideOffset={8}
                  className="z-50 rounded-xl bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white shadow-md dark:bg-stone-100 dark:text-stone-900"
                >
                  Bỏ qua (Phím ←)
                </TooltipPrimitive.Content>
              </TooltipPrimitive.Portal>
            </TooltipPrimitive.Root>

            {/* 3. Super Moo Button with Animate UI Particles Burst */}
            <Particles animate={superBurst}>
              <TooltipPrimitive.Root>
                <TooltipPrimitive.Trigger asChild>
                  <motion.button
                    type="button"
                    disabled={!currentCow}
                    onClick={() => triggerSwipe('super')}
                    initial={{ transform: 'scale(1)' }}
                    whileTap={{
                      transform: reduce
                        ? 'scale(1)'
                        : `scale(${scale.press})`,
                    }}
                    transition={pressSpring}
                    aria-label="Thả Siêu Bò (Super Moo)"
                    className="relative flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/25 transition-colors hover:from-amber-500 hover:to-orange-600 disabled:opacity-40"
                  >
                    <AnimateIcon animateOnHover className="inline-flex">
                      <SuperStarIcon size={26} />
                    </AnimateIcon>
                  </motion.button>
                </TooltipPrimitive.Trigger>
                <TooltipPrimitive.Portal>
                  <TooltipPrimitive.Content
                    sideOffset={8}
                    className="z-50 rounded-xl bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white shadow-md dark:bg-stone-100 dark:text-stone-900"
                  >
                    Siêu Bò VIP (Phím ↑)
                  </TooltipPrimitive.Content>
                </TooltipPrimitive.Portal>
              </TooltipPrimitive.Root>
              <ParticlesEffect
                side="top"
                count={10}
                radius={44}
                spread={140}
                className="pointer-events-none h-2 w-2 rounded-full bg-amber-400"
              />
            </Particles>

            {/* 4. Like / Heart Button with Animate UI Particles Burst */}
            <Particles animate={likeBurst}>
              <TooltipPrimitive.Root>
                <TooltipPrimitive.Trigger asChild>
                  <motion.button
                    type="button"
                    disabled={!currentCow}
                    onClick={() => triggerSwipe('right')}
                    initial={{ transform: 'scale(1)' }}
                    whileTap={{
                      transform: reduce
                        ? 'scale(1)'
                        : `scale(${scale.press})`,
                    }}
                    transition={pressSpring}
                    aria-label="Thả tim ghép đôi"
                    className="relative flex h-15 w-15 items-center justify-center rounded-3xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 transition-colors hover:from-emerald-600 hover:to-teal-700 disabled:opacity-40 dark:border-emerald-800"
                  >
                    <AnimateIcon animateOnHover className="inline-flex">
                      <HeartSparkIcon size={28} />
                    </AnimateIcon>
                  </motion.button>
                </TooltipPrimitive.Trigger>
                <TooltipPrimitive.Portal>
                  <TooltipPrimitive.Content
                    sideOffset={8}
                    className="z-50 rounded-xl bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white shadow-md dark:bg-stone-100 dark:text-stone-900"
                  >
                    Hợp Đồng Cỏ (Phím →)
                  </TooltipPrimitive.Content>
                </TooltipPrimitive.Portal>
              </TooltipPrimitive.Root>
              <ParticlesEffect
                side="top"
                count={8}
                radius={40}
                spread={120}
                className="pointer-events-none h-2.5 w-2.5 rounded-full bg-emerald-400"
              />
            </Particles>

            {/* 5. Pasture Boost Button */}
            <TooltipPrimitive.Root>
              <TooltipPrimitive.Trigger asChild>
                <motion.button
                  type="button"
                  onClick={onTriggerBoost}
                  initial={{ transform: 'scale(1)' }}
                  whileTap={{
                    transform: reduce ? 'scale(1)' : `scale(${scale.press})`,
                  }}
                  transition={pressSpring}
                  aria-label="Kích hoạt Tăng tốc đồng cỏ"
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-2xl border shadow-md transition-colors',
                    boostActive
                      ? 'border-purple-400 bg-purple-600 text-white'
                      : 'border-stone-200 bg-white text-purple-600 hover:bg-purple-50 dark:border-stone-800 dark:bg-stone-900 dark:text-purple-400 dark:hover:bg-stone-800',
                  )}
                >
                  <Zap className="h-5 w-5" />
                </motion.button>
              </TooltipPrimitive.Trigger>
              <TooltipPrimitive.Portal>
                <TooltipPrimitive.Content
                  sideOffset={8}
                  className="z-50 rounded-xl bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white shadow-md dark:bg-stone-100 dark:text-stone-900"
                >
                  Tăng Tốc Chuồng Trại
                </TooltipPrimitive.Content>
              </TooltipPrimitive.Portal>
            </TooltipPrimitive.Root>
          </div>
        </section>
      </div>

      {/* Detailed Pedigree Modal using @animate-ui/react/primitives/radix-ui/dialog */}
      <DialogPrimitive.Root open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs" />
          {currentCow && (
            <DialogPrimitive.Content
              from="bottom"
              className="fixed inset-x-0 top-[6vh] z-50 mx-auto max-h-[88vh] w-[min(620px,92vw)] overflow-y-auto rounded-3xl border border-stone-200 bg-white p-6 shadow-2xl focus:outline-none dark:border-stone-800 dark:bg-stone-900"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    <Award className="h-3.5 w-3.5" />
                    {currentCow.awardBadge}
                  </span>
                  <DialogPrimitive.Title className="font-display mt-2 text-2xl font-extrabold text-stone-900 dark:text-white">
                    Hồ Sơ Phả Hệ: {currentCow.name} ({currentCow.ageLabel})
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="text-xs text-stone-500 dark:text-stone-400">
                    Mã định danh: {currentCow.earTag} • {currentCow.breed} •{' '}
                    {currentCow.region}
                  </DialogPrimitive.Description>
                </div>

                <DialogPrimitive.Close asChild>
                  <button
                    type="button"
                    aria-label="Đóng hồ sơ"
                    className="rounded-xl border border-stone-200 p-2 text-stone-500 transition-colors hover:bg-stone-100 dark:border-stone-800 dark:hover:bg-stone-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </DialogPrimitive.Close>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2.5">
                {currentCow.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${currentCow.name} góc ${i + 1}`}
                    className="aspect-[4/5] w-full rounded-2xl border border-stone-200/70 object-cover dark:border-stone-800"
                  />
                ))}
              </div>

              <p className="mt-4 text-sm leading-relaxed text-stone-700 dark:text-stone-300">
                {currentCow.bio}
              </p>

              {/* Prompts Q&A */}
              <div className="mt-5 flex flex-col gap-3">
                {currentCow.prompts.map((prompt, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-amber-200/70 bg-amber-50/50 p-4 dark:border-amber-900/40 dark:bg-amber-950/25"
                  >
                    <p className="text-xs font-bold text-amber-800 dark:text-amber-400">
                      <Music className="mr-1.5 inline h-3.5 w-3.5" />
                      {prompt.question}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">
                      “{prompt.answer}”
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <DialogPrimitive.Close asChild>
                  <button
                    type="button"
                    onClick={() => triggerSwipe('left')}
                    className="rounded-xl border border-rose-200 px-4 py-2.5 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400"
                  >
                    Bỏ qua
                  </button>
                </DialogPrimitive.Close>
                <DialogPrimitive.Close asChild>
                  <button
                    type="button"
                    onClick={() => triggerSwipe('right')}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-emerald-500"
                  >
                    <HeartSparkIcon size={16} />
                    <span>Thả Tim Ghép Đôi Ngay</span>
                  </button>
                </DialogPrimitive.Close>
              </div>
            </DialogPrimitive.Content>
          )}
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
