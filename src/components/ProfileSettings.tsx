'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import {
  ReducedMotionConfig,
  scale,
  spring,
  useMotionTokens,
  useShouldReduceMotion,
  useTempoTransition,
  type CheckAnimation,
} from '@animate-ui/react/utils/motion';
import * as SwitchPrimitive from '@animate-ui/react/primitives/radix-ui/switch';
import {
  Highlight,
  HighlightItem,
} from '@animate-ui/react/primitives/effects/highlight';
import { CountingNumber } from '@animate-ui/react/primitives/texts/counting-number';
import { SlidingNumber } from '@animate-ui/react/primitives/texts/sliding-number';
import { AnimateIcon } from '@animate-ui/react/icons';
import {
  Award,
  Sparkles,
  Gauge,
  Volume2,
  ShieldCheck,
  MapPin,
  Wheat,
} from 'lucide-react';
import { CowBellIcon } from '@/components/animate-ui/icons/cow-bell';
import { HeartSparkIcon } from '@/components/animate-ui/icons/heart-spark';
import { SuperStarIcon } from '@/components/animate-ui/icons/super-star';
import { FlameHerdIcon } from '@/components/animate-ui/icons/flame-herd';
import {
  CopyEarTagButton,
  StatusButton,
  useActionStatus,
} from '@/components/StatusButton';
import { playMooSound } from '@/lib/moo-sound';
import { cn } from '@/lib/utils';

const TEMPO_OPTIONS: { value: number; label: string; desc: string }[] = [
  { value: 0.7, label: '0.7x Nhanh', desc: 'Snappy (Tốc độ cao)' },
  { value: 0.85, label: '0.85x Gọn', desc: 'Crisp (-1 bước)' },
  { value: 1, label: '1.0x Chuẩn', desc: 'Mặc định Animate UI' },
  { value: 1.15, label: '1.15x Dịu', desc: 'Calm (+1 bước)' },
  { value: 1.3, label: '1.3x Thư thái', desc: 'Relaxed (+2 bước)' },
];

export function ProfileSettings({
  tempo,
  onTempoChange,
  checkAnimation,
  onCheckAnimationChange,
  totalMatchesCount,
  totalSwipesCount,
  onShowToast,
}: {
  tempo: number;
  onTempoChange: (tempo: number) => void;
  checkAnimation: CheckAnimation;
  onCheckAnimationChange: (check: CheckAnimation) => void;
  totalMatchesCount: number;
  totalSwipesCount: number;
  onShowToast: (title: string, description: string) => void;
}) {
  return (
    <ReducedMotionConfig>
      <ProfileSettingsInner
        tempo={tempo}
        onTempoChange={onTempoChange}
        checkAnimation={checkAnimation}
        onCheckAnimationChange={onCheckAnimationChange}
        totalMatchesCount={totalMatchesCount}
        totalSwipesCount={totalSwipesCount}
        onShowToast={onShowToast}
      />
    </ReducedMotionConfig>
  );
}

function ProfileSettingsInner({
  tempo,
  onTempoChange,
  checkAnimation,
  onCheckAnimationChange,
  totalMatchesCount,
  totalSwipesCount,
  onShowToast,
}: {
  tempo: number;
  onTempoChange: (tempo: number) => void;
  checkAnimation: CheckAnimation;
  onCheckAnimationChange: (check: CheckAnimation) => void;
  totalMatchesCount: number;
  totalSwipesCount: number;
  onShowToast: (title: string, description: string) => void;
}) {
  const reduce = useShouldReduceMotion();
  const tokens = useMotionTokens();
  const pressSpring = useTempoTransition(spring.press);
  const selectionSpring = useTempoTransition(spring.selection);
  const numberSpring = useTempoTransition(spring.number);

  const [cowName, setCowName] = React.useState('Kobe Hoàng Gia #01');
  const [favoriteGrass, setFavoriteGrass] = React.useState(
    'Cỏ Linh Lăng ủ sương Đà Lạt & Mạch nha tươi',
  );
  const [bio, setBio] = React.useState(
    'Chàng bò Wagyu F1 lịch lãm, thích nghe nhạc Acoustic bên đồi thông và đi dạo lúc hoàng hôn. Sổ phả hệ 5 đời chuẩn quốc tế.',
  );
  const [maxDistanceKm, setMaxDistanceKm] = React.useState(25);
  const [autoMooSound, setAutoMooSound] = React.useState(true);
  const [verifiedOnly, setVerifiedOnly] = React.useState(true);

  const [saveStatus, runSave] = useActionStatus(async () => {
    await new Promise((resolve) => setTimeout(resolve, 650));
    onShowToast(
      'Đã cập nhật Hồ Sơ Đồng Cỏ!',
      `${cowName} đã sẵn sàng tỏa sáng trong bán kính ${maxDistanceKm}km.`,
    );
  });

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-12 sm:px-6">
      {/* Left Column: My Prize Cow Profile Editor */}
      <section
        aria-label="Hồ sơ bò của tôi"
        className="flex flex-col gap-5 rounded-3xl border border-amber-200/80 bg-white/95 p-6 shadow-sm lg:col-span-7 dark:border-stone-800 dark:bg-stone-900/95"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl border-4 border-amber-400 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white shadow-lg">
              <CowBellIcon size={40} animateOnHover />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-extrabold text-stone-900 dark:text-white">
                  {cowName}
                </h1>
                <ShieldCheck className="h-5 w-5 fill-sky-400 text-white dark:text-stone-900" />
              </div>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
                <MapPin className="h-3.5 w-3.5 text-amber-500" />
                Đà Lạt, Lâm Đồng • Hạng Phả Hệ Kim Cương
              </p>
              <div className="mt-2">
                <CopyEarTagButton earTag="VN-KOBE-001" />
              </div>
            </div>
          </div>

          <motion.button
            type="button"
            onClick={() => playMooSound(128, true)}
            initial={{ transform: 'scale(1)' }}
            whileTap={{
              transform: reduce ? 'scale(1)' : `scale(${scale.press})`,
            }}
            transition={pressSpring}
            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-xs font-bold text-stone-700 transition-colors hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-800 dark:text-stone-200"
          >
            <Volume2 className="h-4 w-4 text-amber-500" />
            <span>Thử giọng Mooo (128Hz)</span>
          </motion.button>
        </div>

        {/* Profile Stats Bar with CountingNumber and SlidingNumber */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-stone-200/70 bg-stone-50/80 p-3.5 dark:border-stone-800 dark:bg-stone-950/60">
            <span className="text-xs text-stone-500 dark:text-stone-400">
              Tổng lượt quẹt
            </span>
            <div className="mt-1 font-display text-2xl font-extrabold text-stone-900 tabular-nums dark:text-white">
              <SlidingNumber number={totalSwipesCount + 18} />
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200/70 bg-stone-50/80 p-3.5 dark:border-stone-800 dark:bg-stone-950/60">
            <span className="text-xs text-stone-500 dark:text-stone-400">
              Đôi bò tương hợp
            </span>
            <div className="mt-1 font-display text-2xl font-extrabold text-emerald-600 tabular-nums dark:text-emerald-400">
              <SlidingNumber number={totalMatchesCount} />
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200/70 bg-stone-50/80 p-3.5 dark:border-stone-800 dark:bg-stone-950/60">
            <span className="text-xs text-stone-500 dark:text-stone-400">
              Điểm Uy Tín Đàn
            </span>
            <div className="mt-1 font-display text-2xl font-extrabold text-amber-600 tabular-nums dark:text-amber-400">
              <CountingNumber
                number={99.4}
                fromNumber={90}
                decimalPlaces={1}
              />
              %
            </div>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="flex flex-col gap-4 border-t border-stone-100 pt-4 dark:border-stone-800">
          <div>
            <label
              htmlFor="cow-name-input"
              className="block text-xs font-bold text-stone-700 dark:text-stone-300"
            >
              Nghệ danh trên đồng cỏ
            </label>
            <input
              id="cow-name-input"
              type="text"
              value={cowName}
              onChange={(e) => setCowName(e.target.value)}
              className="mt-1.5 h-10 w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 text-sm font-semibold text-stone-900 focus:border-amber-500 focus:outline-none dark:border-stone-800 dark:bg-stone-950 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="cow-grass-input"
              className="block text-xs font-bold text-stone-700 dark:text-stone-300"
            >
              <Wheat className="mr-1 inline h-3.5 w-3.5 text-emerald-600" />
              Thực đơn cỏ yêu thích
            </label>
            <input
              id="cow-grass-input"
              type="text"
              value={favoriteGrass}
              onChange={(e) => setFavoriteGrass(e.target.value)}
              className="mt-1.5 h-10 w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 text-sm text-stone-900 focus:border-amber-500 focus:outline-none dark:border-stone-800 dark:bg-stone-950 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="cow-bio-input"
              className="block text-xs font-bold text-stone-700 dark:text-stone-300"
            >
              Lời giới thiệu bản thân (Bio)
            </label>
            <textarea
              id="cow-bio-input"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50 p-3.5 text-sm text-stone-900 focus:border-amber-500 focus:outline-none dark:border-stone-800 dark:bg-stone-950 dark:text-white"
            />
          </div>

          {/* Pasture Radius Bar using spring.number (Rule B9: translate inside clipped track, never scaleX/scaleY) */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-stone-700 dark:text-stone-300">
                Bán kính tìm kiếm đồng cỏ
              </span>
              <span className="text-amber-600 tabular-nums dark:text-amber-400">
                <SlidingNumber number={maxDistanceKm} /> km
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={50}
              step={5}
              value={maxDistanceKm}
              onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
              aria-label="Bán kính tìm kiếm đồng cỏ"
              className="mt-2 w-full accent-amber-500"
            />
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
              <motion.div
                initial={false}
                animate={{
                  transform: `translateX(${(maxDistanceKm / 50) * 100 - 100}%)`,
                }}
                transition={numberSpring}
                className="h-full w-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-500"
              />
            </div>
          </div>

          {/* Radix Switch Primitives from @animate-ui/react/primitives/radix-ui/switch */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-2xl border border-stone-200/80 bg-stone-50/60 p-3.5 dark:border-stone-800 dark:bg-stone-950/60">
              <div>
                <p className="text-xs font-bold text-stone-800 dark:text-stone-200">
                  Âm thanh chuông & Mooo
                </p>
                <p className="text-[11px] text-stone-500">
                  Phát tiếng kêu khi thả tim
                </p>
              </div>
              <SwitchPrimitive.Root
                checked={autoMooSound}
                onCheckedChange={setAutoMooSound}
                aria-label="Âm thanh chuông và Mooo"
                className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-stone-300 transition-colors data-[state=checked]:bg-amber-500 dark:bg-stone-700"
              >
                <SwitchPrimitive.Thumb className="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-sm" />
              </SwitchPrimitive.Root>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-stone-200/80 bg-stone-50/60 p-3.5 dark:border-stone-800 dark:bg-stone-950/60">
              <div>
                <p className="text-xs font-bold text-stone-800 dark:text-stone-200">
                  Chỉ hiện bò có Sổ Phả Hệ
                </p>
                <p className="text-[11px] text-stone-500">
                  Đã kiểm định thú y & gen
                </p>
              </div>
              <SwitchPrimitive.Root
                checked={verifiedOnly}
                onCheckedChange={setVerifiedOnly}
                aria-label="Chỉ hiện bò có Sổ Phả Hệ"
                className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-stone-300 transition-colors data-[state=checked]:bg-emerald-600 dark:bg-stone-700"
              >
                <SwitchPrimitive.Thumb className="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-sm" />
              </SwitchPrimitive.Root>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-end">
            <StatusButton status={saveStatus} onClick={runSave} />
          </div>
        </div>
      </section>

      {/* Right Column: Animate UI Motion Studio & Token Inspector */}
      <aside className="flex flex-col gap-5 lg:col-span-5">
        <div className="rounded-3xl border border-amber-200/80 bg-white/95 p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900/95">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              <Gauge className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-extrabold text-stone-900 dark:text-white">
                Animate UI Motion Studio
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Điều chỉnh trực tiếp <code className="font-mono">AnimateUIProvider</code> cho toàn ứng dụng
              </p>
            </div>
          </div>

          {/* Tempo Picker */}
          <div className="mt-5">
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
              Nhịp độ chuyển động toàn cục (<code className="font-mono">tempo={tempo}</code>)
            </label>
            <p className="mt-0.5 text-[11px] text-stone-500">
              Mọi spring (stiffness/tempo², damping/tempo) và tween đều tự động co giãn theo Tempo.
            </p>

            <Highlight
              controlledItems
              mode="parent"
              value={String(tempo)}
              onValueChange={(val) => {
                const parsed = Number(val);
                if (val && Number.isFinite(parsed) && parsed > 0) {
                  onTempoChange(parsed);
                }
              }}
              click
              hover={false}
              transition={selectionSpring}
              containerClassName="mt-3 grid grid-cols-2 gap-1.5 rounded-2xl bg-stone-100 p-1.5 sm:grid-cols-3 dark:bg-stone-950"
              className="rounded-xl bg-amber-500 shadow-xs"
            >
              {TEMPO_OPTIONS.map((opt) => {
                const active = tempo === opt.value;
                return (
                  <HighlightItem
                    key={opt.value}
                    value={String(opt.value)}
                    asChild
                  >
                    <button
                      type="button"
                      onClick={() => onTempoChange(opt.value)}
                      className={cn(
                        'relative z-10 flex flex-col items-start rounded-xl px-3 py-2 text-left transition-colors',
                        active
                          ? 'text-white'
                          : 'text-stone-700 hover:text-stone-900 dark:text-stone-300',
                      )}
                    >
                      <span className="text-xs font-extrabold tabular-nums">
                        {opt.label}
                      </span>
                      <span
                        className={cn(
                          'text-[10px]',
                          active ? 'text-amber-100' : 'text-stone-400',
                        )}
                      >
                        {opt.desc}
                      </span>
                    </button>
                  </HighlightItem>
                );
              })}
            </Highlight>
          </div>

          {/* Check Animation Mode Picker */}
          <div className="mt-5 border-t border-stone-100 pt-4 dark:border-stone-800">
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
              Kiểu hiệu ứng đánh dấu (<code className="font-mono">checkAnimation="{checkAnimation}"</code>)
            </label>
            <div className="mt-2 flex gap-2">
              {(['draw', 'pop'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onCheckAnimationChange(mode)}
                  className={cn(
                    'flex-1 rounded-xl border px-3 py-2 text-xs font-bold transition-colors',
                    checkAnimation === mode
                      ? 'border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200'
                      : 'border-stone-200 bg-white text-stone-600 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400',
                  )}
                >
                  {mode === 'draw'
                    ? 'Draw (Vẽ nét ease.draw)'
                    : 'Pop (Nảy spring.checkPop)'}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Animated Icons Showcase */}
          <div className="mt-5 border-t border-stone-100 pt-4 dark:border-stone-800">
            <p className="text-xs font-bold text-stone-700 dark:text-stone-300">
              Bộ Icon SVG Động (<code className="font-mono">@animate-ui/react/icons</code>)
            </p>
            <p className="mt-0.5 text-[11px] text-stone-500">
              Rê chuột hoặc chạm vào từng nút để thử các biến thể chuyển động:
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <AnimateIcon animateOnHover asChild>
                <button
                  type="button"
                  onClick={() => playMooSound(140, true)}
                  className="flex items-center gap-2.5 rounded-2xl border border-stone-200/80 bg-stone-50 p-3 text-left text-xs font-bold text-stone-800 transition-colors hover:border-amber-400 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-200"
                >
                  <CowBellIcon size={22} className="text-amber-500" />
                  <span>CowBell Swing</span>
                </button>
              </AnimateIcon>

              <AnimateIcon animateOnHover asChild>
                <button
                  type="button"
                  className="flex items-center gap-2.5 rounded-2xl border border-stone-200/80 bg-stone-50 p-3 text-left text-xs font-bold text-stone-800 transition-colors hover:border-rose-400 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-200"
                >
                  <HeartSparkIcon size={22} className="text-rose-500" />
                  <span>Squash & Pop</span>
                </button>
              </AnimateIcon>

              <AnimateIcon animateOnHover asChild>
                <button
                  type="button"
                  className="flex items-center gap-2.5 rounded-2xl border border-stone-200/80 bg-stone-50 p-3 text-left text-xs font-bold text-stone-800 transition-colors hover:border-amber-400 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-200"
                >
                  <SuperStarIcon size={22} className="text-amber-500" />
                  <span>Super Star Spin</span>
                </button>
              </AnimateIcon>

              <AnimateIcon animateOnHover asChild>
                <button
                  type="button"
                  className="flex items-center gap-2.5 rounded-2xl border border-stone-200/80 bg-stone-50 p-3 text-left text-xs font-bold text-stone-800 transition-colors hover:border-orange-400 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-200"
                >
                  <FlameHerdIcon size={22} className="text-orange-500" />
                  <span>Base Sway Flame</span>
                </button>
              </AnimateIcon>
            </div>
          </div>

          {/* Live Motion Tokens Table */}
          <div className="mt-5 rounded-2xl border border-stone-200/80 bg-stone-50/90 p-3.5 text-xs dark:border-stone-800 dark:bg-stone-950">
            <div className="flex items-center justify-between font-bold text-stone-800 dark:text-stone-200">
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                Thông số Token thực tế (Tempo {tokens.tempo}x)
              </span>
              <Award className="h-4 w-4 text-amber-500" />
            </div>
            <dl className="mt-2.5 grid grid-cols-2 gap-2 font-mono text-[11px] text-stone-600 dark:text-stone-400">
              <div className="rounded-lg bg-white p-2 dark:bg-stone-900">
                <dt className="font-bold text-amber-600 dark:text-amber-400">
                  spring.press
                </dt>
                <dd className="mt-0.5">
                  S:{Math.round(tokens.spring.press.stiffness)} / D:
                  {Math.round(tokens.spring.press.damping)}
                </dd>
              </div>
              <div className="rounded-lg bg-white p-2 dark:bg-stone-900">
                <dt className="font-bold text-amber-600 dark:text-amber-400">
                  spring.dialog
                </dt>
                <dd className="mt-0.5">
                  S:{Math.round(tokens.spring.dialog.stiffness)} / D:
                  {Math.round(tokens.spring.dialog.damping)}
                </dd>
              </div>
              <div className="rounded-lg bg-white p-2 dark:bg-stone-900">
                <dt className="font-bold text-amber-600 dark:text-amber-400">
                  spring.reflow
                </dt>
                <dd className="mt-0.5">
                  S:{Math.round(tokens.spring.reflow.stiffness)} / D:
                  {Math.round(tokens.spring.reflow.damping)}
                </dd>
              </div>
              <div className="rounded-lg bg-white p-2 dark:bg-stone-900">
                <dt className="font-bold text-amber-600 dark:text-amber-400">
                  transition.swap
                </dt>
                <dd className="mt-0.5">
                  {Math.round(tokens.transition.swap.duration * 1000)}ms
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </aside>
    </div>
  );
}
