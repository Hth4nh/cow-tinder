'use client';

import { motion } from 'motion/react';
import {
  ReducedMotionConfig,
  scale,
  spring,
  useShouldReduceMotion,
  useTempoTransition,
} from '@animate-ui/react/utils/motion';
import * as DialogPrimitive from '@animate-ui/react/primitives/radix-ui/dialog';
import {
  Particles,
  ParticlesEffect,
} from '@animate-ui/react/primitives/effects/particles';
import { AnimateIcon } from '@animate-ui/react/icons';
import { MessageCircleHeart, Sparkles, Volume2 } from 'lucide-react';
import { CowBellIcon } from '@/components/animate-ui/icons/cow-bell';
import { HeartSparkIcon } from '@/components/animate-ui/icons/heart-spark';
import { ICEBREAKER_SUGGESTIONS, type CowProfile } from '@/data/cows';
import { playMooSound } from '@/lib/moo-sound';

export function MatchModal({
  matchedCow,
  isSuperMoo,
  onClose,
  onSendIcebreaker,
}: {
  matchedCow: CowProfile | null;
  isSuperMoo: boolean;
  onClose: () => void;
  onSendIcebreaker: (cow: CowProfile, messageText: string) => void;
}) {
  return (
    <ReducedMotionConfig>
      <MatchModalInner
        matchedCow={matchedCow}
        isSuperMoo={isSuperMoo}
        onClose={onClose}
        onSendIcebreaker={onSendIcebreaker}
      />
    </ReducedMotionConfig>
  );
}

function MatchModalInner({
  matchedCow,
  isSuperMoo,
  onClose,
  onSendIcebreaker,
}: {
  matchedCow: CowProfile | null;
  isSuperMoo: boolean;
  onClose: () => void;
  onSendIcebreaker: (cow: CowProfile, messageText: string) => void;
}) {
  const reduce = useShouldReduceMotion();
  const pressSpring = useTempoTransition(spring.press);

  return (
    <DialogPrimitive.Root
      open={Boolean(matchedCow)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm" />
        {matchedCow && (
          <DialogPrimitive.Content
            from="top"
            className="fixed inset-x-0 top-[8vh] z-50 mx-auto w-[min(510px,92vw)] overflow-hidden rounded-[32px] border border-amber-300/70 bg-gradient-to-b from-amber-50 via-white to-rose-50 p-6 text-center shadow-2xl focus:outline-none dark:border-amber-700/60 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950"
          >
            {/* Celebration Badge with Particles */}
            <div className="flex justify-center">
              <Particles animate>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-4 py-1.5 text-xs font-extrabold tracking-wider text-white uppercase shadow-md">
                  <Sparkles className="h-3.5 w-3.5" />
                  {isSuperMoo
                    ? 'Siêu Tương Hợp Đồng Cỏ!'
                    : "It's a Moo-tch! Tâm Đầu Ý Hợp"}
                </span>
                <ParticlesEffect
                  side="top"
                  count={14}
                  radius={56}
                  spread={180}
                  className="pointer-events-none h-2.5 w-2.5 rounded-full bg-amber-400"
                />
              </Particles>
            </div>

            <DialogPrimitive.Title className="font-display mt-3 text-3xl font-extrabold text-stone-900 dark:text-white">
              Bạn & {matchedCow.name} Đã Hợp Ý!
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="mt-1 text-sm text-stone-600 dark:text-stone-300">
              Cả hai đều yêu thích <strong>{matchedCow.favoriteGrass}</strong>!
              Hãy gửi tiếng Mooo đầu tiên để bắt đầu câu chuyện.
            </DialogPrimitive.Description>

            {/* Paired Avatars */}
            <div className="my-6 flex items-center justify-center gap-4">
              <div className="relative h-28 w-28 overflow-hidden rounded-3xl border-4 border-amber-400 bg-amber-100 shadow-lg">
                <img
                  src={matchedCow.images[0]}
                  alt={matchedCow.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-md">
                <HeartSparkIcon size={26} animate />
              </div>

              <div className="flex h-28 w-28 flex-col items-center justify-center rounded-3xl border-4 border-emerald-400 bg-gradient-to-br from-amber-400 to-emerald-600 p-3 text-white shadow-lg">
                <CowBellIcon size={38} animate />
                <span className="mt-1.5 text-xs font-extrabold">
                  Kobe #01 (Bạn)
                </span>
              </div>
            </div>

            {/* Quick Icebreaker Suggestions */}
            <div className="text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Chọn nhanh lời chào đồng cỏ:
              </p>
              <div className="mt-2 flex flex-col gap-2">
                {ICEBREAKER_SUGGESTIONS.slice(0, 3).map((text, idx) => (
                  <motion.button
                    key={idx}
                    type="button"
                    onClick={() => onSendIcebreaker(matchedCow, text)}
                    initial={{ transform: 'scale(1)' }}
                    whileTap={{
                      transform: reduce ? 'scale(1)' : `scale(${scale.choice})`,
                    }}
                    transition={pressSpring}
                    className="w-full rounded-2xl border border-amber-200/90 bg-white/90 px-3.5 py-2.5 text-left text-xs font-semibold text-stone-800 shadow-2xs transition-colors hover:border-amber-400 hover:bg-amber-50 dark:border-stone-800 dark:bg-stone-800/90 dark:text-stone-200 dark:hover:border-amber-600 dark:hover:bg-stone-800"
                  >
                    “{text}”
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <motion.button
                type="button"
                onClick={() => playMooSound(matchedCow.stats.mooPitchHz, true)}
                initial={{ transform: 'scale(1)' }}
                whileTap={{
                  transform: reduce ? 'scale(1)' : `scale(${scale.press})`,
                }}
                transition={pressSpring}
                className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-xs font-bold text-stone-700 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
              >
                <Volume2 className="h-4 w-4 text-amber-500" />
                <span>Nghe {matchedCow.name} Mooo</span>
              </motion.button>

              <div className="flex items-center gap-2.5">
                <DialogPrimitive.Close asChild>
                  <button
                    type="button"
                    className="rounded-xl px-4 py-2.5 text-xs font-bold text-stone-600 transition-colors hover:bg-stone-200/60 dark:text-stone-400 dark:hover:bg-stone-800"
                  >
                    Quẹt tiếp
                  </button>
                </DialogPrimitive.Close>

                <AnimateIcon animateOnHover asChild>
                  <motion.button
                    type="button"
                    onClick={() =>
                      onSendIcebreaker(
                        matchedCow,
                        ICEBREAKER_SUGGESTIONS[0],
                      )
                    }
                    initial={{ transform: 'scale(1)' }}
                    whileTap={{
                      transform: reduce ? 'scale(1)' : `scale(${scale.press})`,
                    }}
                    transition={pressSpring}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-5 py-2.5 text-xs font-extrabold text-white shadow-md hover:from-amber-600 hover:to-rose-600"
                  >
                    <MessageCircleHeart className="h-4 w-4" />
                    <span>Nhắn Tin Ngay</span>
                  </motion.button>
                </AnimateIcon>
              </div>
            </div>
          </DialogPrimitive.Content>
        )}
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
