'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ReducedMotionConfig,
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
import { CountingNumber } from '@animate-ui/react/primitives/texts/counting-number';
import { AnimateIcon } from '@animate-ui/react/icons';
import {
  Search,
  MapPin,
  Award,
  ShieldCheck,
  X,
  Wheat,
  Volume2,
  SlidersHorizontal,
} from 'lucide-react';
import { HeartSparkIcon } from '@/components/animate-ui/icons/heart-spark';
import { SuperStarIcon } from '@/components/animate-ui/icons/super-star';
import type { CowProfile, MatchPurpose } from '@/data/cows';
import { playMooSound } from '@/lib/moo-sound';
import { cn } from '@/lib/utils';

const PURPOSE_FILTERS: ('Tất cả' | MatchPurpose)[] = [
  'Tất cả',
  'Hẹn hò lãng mạn',
  'Phối giống VIP',
  'Bạn đồng cỏ',
  'Thi Hoa Hậu Bò',
];

export type SortKey = 'distance' | 'marbling' | 'weight';

export function ExplorerGrid({
  cows,
  matchedCowIds,
  onLikeCow,
  onSuperMooCow,
}: {
  cows: CowProfile[];
  matchedCowIds: Set<string>;
  onLikeCow: (cow: CowProfile) => void;
  onSuperMooCow: (cow: CowProfile) => void;
}) {
  return (
    <ReducedMotionConfig>
      <ExplorerGridInner
        cows={cows}
        matchedCowIds={matchedCowIds}
        onLikeCow={onLikeCow}
        onSuperMooCow={onSuperMooCow}
      />
    </ReducedMotionConfig>
  );
}

function ExplorerGridInner({
  cows,
  matchedCowIds,
  onLikeCow,
  onSuperMooCow,
}: {
  cows: CowProfile[];
  matchedCowIds: Set<string>;
  onLikeCow: (cow: CowProfile) => void;
  onSuperMooCow: (cow: CowProfile) => void;
}) {
  const reduce = useShouldReduceMotion();
  const move = useTempoTransition(spring.reflow);
  const fade = useTempoTransition(motionTransition.fade);
  const morph = useTempoTransition(spring.dialog);
  const overlay = useTempoTransition(motionTransition.overlay);
  const reveal = useTempoTransition(motionTransition.reveal);
  const swap = useTempoTransition(motionTransition.swap);
  const selectionSpring = useTempoTransition(spring.selection);
  const pressSpring = useTempoTransition(spring.press);

  const [selectedPurpose, setSelectedPurpose] = React.useState<
    'Tất cả' | MatchPurpose
  >('Tất cả');
  const [genderFilter, setGenderFilter] = React.useState<
    'Tất cả' | 'Bò Cái' | 'Bò Đực'
  >('Tất cả');
  const [sortBy, setSortBy] = React.useState<SortKey>('distance');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [expandedCow, setExpandedCow] = React.useState<CowProfile | null>(null);

  React.useEffect(() => {
    if (!expandedCow) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExpandedCow(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expandedCow]);

  const filteredCows = React.useMemo(() => {
    return cows
      .filter((cow) => {
        if (selectedPurpose !== 'Tất cả' && cow.purpose !== selectedPurpose) {
          return false;
        }
        if (genderFilter !== 'Tất cả' && cow.gender !== genderFilter) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            cow.name.toLowerCase().includes(q) ||
            cow.breed.toLowerCase().includes(q) ||
            cow.region.toLowerCase().includes(q) ||
            cow.earTag.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
        if (sortBy === 'marbling')
          return b.stats.marblingScore - a.stats.marblingScore;
        return b.stats.weightKg - a.stats.weightKg;
      });
  }, [cows, selectedPurpose, genderFilter, searchQuery, sortBy]);

  const pressedChoice = reduce ? 'scale(1)' : `scale(${scale.choice})`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Header & Filter Bar */}
      <div className="rounded-3xl border border-amber-200/80 bg-white/90 p-5 shadow-sm backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/90">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-stone-900 dark:text-white">
              Sổ Phả Hệ & Khám Phá Đàn Bò VIP
            </h1>
            <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
              Bấm vào bất kỳ thẻ bò nào để trải nghiệm hiệu ứng Expanding Card (Shared layoutId) của Animate UI.
            </p>
          </div>

          {/* Search Input + Sort Selector */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tên bò, giống, vùng..."
                className="h-10 w-56 rounded-xl border border-stone-200 bg-stone-50 pr-3 pl-9 text-xs font-medium text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100"
              />
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs dark:border-stone-800 dark:bg-stone-950">
              <SlidersHorizontal className="h-3.5 w-3.5 text-amber-600" />
              <label htmlFor="cow-sort" className="font-semibold text-stone-600 dark:text-stone-400">
                Xếp theo:
              </label>
              <select
                id="cow-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="bg-transparent font-bold text-stone-900 focus:outline-none dark:text-stone-100"
              >
                <option value="distance">Gần nhất (km)</option>
                <option value="marbling">Vân mỡ BMS cao</option>
                <option value="weight">Cân nặng khủng</option>
              </select>
            </div>
          </div>
        </div>

        {/* Purpose Filter Pills using Animate UI Highlight */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-4 dark:border-stone-800/80">
          <Highlight
            controlledItems
            mode="parent"
            value={selectedPurpose}
            onValueChange={(v) => {
              if (v && (PURPOSE_FILTERS as readonly string[]).includes(v)) {
                setSelectedPurpose(v as 'Tất cả' | MatchPurpose);
              }
            }}
            click
            hover={false}
            transition={selectionSpring}
            containerClassName="flex flex-wrap items-center gap-1 rounded-2xl bg-stone-100/80 p-1 dark:bg-stone-950"
            className="rounded-xl bg-amber-500 shadow-xs"
          >
            {PURPOSE_FILTERS.map((purpose) => {
              const active = selectedPurpose === purpose;
              return (
                <HighlightItem key={purpose} value={purpose} asChild>
                  <button
                    type="button"
                    onClick={() => setSelectedPurpose(purpose)}
                    className={cn(
                      'relative z-10 rounded-xl px-3 py-1.5 text-xs font-bold transition-colors',
                      active
                        ? 'text-white'
                        : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200',
                    )}
                  >
                    {purpose}
                  </button>
                </HighlightItem>
              );
            })}
          </Highlight>

          {/* Gender Filter Pills */}
          <div className="flex items-center gap-1 rounded-xl bg-stone-100/80 p-1 dark:bg-stone-950">
            {(['Tất cả', 'Bò Cái', 'Bò Đực'] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGenderFilter(g)}
                className={cn(
                  'rounded-lg px-3 py-1 text-xs font-bold transition-colors',
                  genderFilter === g
                    ? 'bg-white text-stone-900 shadow-2xs dark:bg-stone-800 dark:text-white'
                    : 'text-stone-500 hover:text-stone-800 dark:text-stone-400',
                )}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filtered & Sorted Grid (interactions/filter-grid.md + recipes/card.md) */}
      <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {filteredCows.map((cow) => {
            const isMatched = matchedCowIds.has(cow.id);
            return (
              <motion.li
                key={cow.id}
                layout
                layoutId={`card-${cow.id}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: fade }}
                transition={{ ...move, opacity: fade }}
                className="overflow-hidden rounded-3xl border border-stone-200/90 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900"
              >
                <motion.button
                  type="button"
                  onClick={() => setExpandedCow(cow)}
                  initial={{ transform: 'scale(1)' }}
                  whileTap={{ transform: pressedChoice }}
                  transition={pressSpring}
                  className="group flex h-full w-full flex-col text-left focus:outline-none"
                >
                  <div className="relative aspect-[4/4.3] w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                    <motion.img
                      layoutId={`image-${cow.id}`}
                      transition={morph}
                      src={cow.images[0]}
                      alt={cow.name}
                      className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-xs">
                        {cow.breed}
                      </span>
                      {isMatched && (
                        <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-extrabold text-white shadow-xs">
                          Đã Tương Hợp 💚
                        </span>
                      )}
                    </div>
                    <div className="absolute right-3 bottom-3 rounded-xl bg-amber-500/95 px-2.5 py-1 text-[10px] font-extrabold text-stone-950 shadow-xs">
                      BMS {cow.stats.marblingScore} • {cow.stats.weightKg}kg
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <motion.h3
                          layoutId={`title-${cow.id}`}
                          transition={morph}
                          className="font-display text-lg font-extrabold text-stone-900 dark:text-white"
                        >
                          {cow.name}
                        </motion.h3>
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                          {cow.ageLabel}
                        </span>
                      </div>

                      <p className="mt-1 flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                        <span className="truncate">{cow.region}</span>
                        <span>• {cow.distanceKm}km</span>
                      </p>

                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-stone-600 dark:text-stone-300">
                        {cow.bio}
                      </p>
                    </div>

                    <div className="mt-3.5 flex items-center justify-between border-t border-stone-100 pt-3 text-[11px] font-bold text-amber-700 dark:border-stone-800 dark:text-amber-400">
                      <span>{cow.purpose}</span>
                      <span className="underline-offset-2 group-hover:underline">
                        Mở thẻ phả hệ →
                      </span>
                    </div>
                  </div>
                </motion.button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      {/* Expanding Card Modal Overlay (interactions/expanding-card.md) */}
      <AnimatePresence>
        {expandedCow && (
          <motion.div
            key="expanding-overlay"
            className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: overlay }}
            exit={{ opacity: 0, transition: overlay }}
            onClick={() => setExpandedCow(null)}
          />
        )}
        {expandedCow && (
          <motion.div
            key="expanding-panel"
            role="dialog"
            aria-modal="true"
            aria-label={expandedCow.name}
            layoutId={`card-${expandedCow.id}`}
            transition={morph}
            className="fixed inset-x-0 top-[6vh] z-50 mx-auto max-h-[88vh] w-[min(680px,92vw)] overflow-y-auto rounded-3xl border border-stone-200 bg-white shadow-2xl dark:border-stone-800 dark:bg-stone-900"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-900">
              <motion.img
                layoutId={`image-${expandedCow.id}`}
                transition={morph}
                src={expandedCow.images[0]}
                alt={expandedCow.name}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                aria-label="Đóng cửa sổ"
                onClick={() => setExpandedCow(null)}
                className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-black/55 text-white backdrop-blur-md transition-colors hover:bg-black/75"
              >
                <X className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => playMooSound(expandedCow.stats.mooPitchHz, true)}
                className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-md transition-colors hover:bg-black/80"
              >
                <Volume2 className="h-4 w-4 text-amber-400" />
                <span>Nghe giọng {expandedCow.name} ({expandedCow.stats.mooPitchHz}Hz)</span>
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <motion.h3
                    layoutId={`title-${expandedCow.id}`}
                    transition={morph}
                    className="font-display text-2xl font-extrabold text-stone-900 dark:text-white"
                  >
                    {expandedCow.name}
                  </motion.h3>
                  {expandedCow.verified && (
                    <ShieldCheck className="h-6 w-6 fill-sky-400 text-white dark:text-stone-900" />
                  )}
                  <span className="rounded-lg bg-stone-100 px-2.5 py-1 font-mono text-xs font-bold text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                    {expandedCow.earTag}
                  </span>
                </div>

                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                  <Award className="h-3.5 w-3.5" />
                  {expandedCow.awardBadge}
                </span>
              </div>

              {/* Body that only exists in the expanded view fades on transition.reveal / transition.swap */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: reveal }}
                exit={{ opacity: 0, transition: swap }}
              >
                <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
                  {expandedCow.bio}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-2xl border border-stone-200/70 bg-stone-50 p-3 dark:border-stone-800 dark:bg-stone-950">
                    <span className="text-[11px] text-stone-500">Cân nặng</span>
                    <div className="mt-0.5 font-display text-xl font-extrabold text-stone-900 tabular-nums dark:text-white">
                      <CountingNumber
                        number={expandedCow.stats.weightKg}
                        fromNumber={350}
                      />{' '}
                      kg
                    </div>
                  </div>
                  <div className="rounded-2xl border border-stone-200/70 bg-stone-50 p-3 dark:border-stone-800 dark:bg-stone-950">
                    <span className="text-[11px] text-stone-500">Điểm Vân Mỡ</span>
                    <div className="mt-0.5 font-display text-xl font-extrabold text-amber-600 tabular-nums dark:text-amber-400">
                      BMS <CountingNumber number={expandedCow.stats.marblingScore} />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-stone-200/70 bg-stone-50 p-3 dark:border-stone-800 dark:bg-stone-950">
                    <span className="text-[11px] text-stone-500">Độ điềm đạm</span>
                    <div className="mt-0.5 font-display text-xl font-extrabold text-emerald-600 tabular-nums dark:text-emerald-400">
                      <CountingNumber
                        number={expandedCow.stats.calmness}
                        fromNumber={70}
                      />
                      %
                    </div>
                  </div>
                  <div className="rounded-2xl border border-stone-200/70 bg-stone-50 p-3 dark:border-stone-800 dark:bg-stone-950">
                    <span className="text-[11px] text-stone-500">Sức bền đồng cỏ</span>
                    <div className="mt-0.5 font-display text-xl font-extrabold text-sky-600 tabular-nums dark:text-sky-400">
                      <CountingNumber
                        number={expandedCow.stats.pastureStamina}
                        fromNumber={70}
                      />
                      %
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-2xl bg-emerald-50 p-3.5 text-xs text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200">
                  <Wheat className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>
                    <strong>Thực đơn yêu thích:</strong>{' '}
                    {expandedCow.favoriteGrass} • Cung hoàng đạo:{' '}
                    <strong>{expandedCow.zodiac}</strong>
                  </span>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                  <AnimateIcon animateOnHover asChild>
                    <motion.button
                      type="button"
                      onClick={() => {
                        onSuperMooCow(expandedCow);
                        setExpandedCow(null);
                      }}
                      initial={{ transform: 'scale(1)' }}
                      whileTap={{
                        transform: reduce
                          ? 'scale(1)'
                          : `scale(${scale.press})`,
                      }}
                      transition={pressSpring}
                      className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-extrabold text-amber-900 transition-colors hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200"
                    >
                      <SuperStarIcon size={16} />
                      <span>Thả Siêu Bò VIP</span>
                    </motion.button>
                  </AnimateIcon>

                  <AnimateIcon animateOnHover asChild>
                    <motion.button
                      type="button"
                      onClick={() => {
                        onLikeCow(expandedCow);
                        setExpandedCow(null);
                      }}
                      initial={{ transform: 'scale(1)' }}
                      whileTap={{
                        transform: reduce
                          ? 'scale(1)'
                          : `scale(${scale.press})`,
                      }}
                      transition={pressSpring}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-md hover:from-emerald-600 hover:to-teal-700"
                    >
                      <HeartSparkIcon size={16} />
                      <span>Thả Tim Ghép Đôi</span>
                    </motion.button>
                  </AnimateIcon>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
