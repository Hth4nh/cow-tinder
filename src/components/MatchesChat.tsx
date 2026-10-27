'use client';

import * as React from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  type PanInfo,
} from 'motion/react';
import {
  ReducedMotionConfig,
  scale,
  spring,
  transition as motionTransition,
  useShouldReduceMotion,
  useTempoTransition,
} from '@animate-ui/react/utils/motion';
import { AnimateIcon } from '@animate-ui/react/icons';
import {
  Send,
  Trash2,
  Sparkles,
  Volume2,
  Wheat,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
import { CowBellIcon } from '@/components/animate-ui/icons/cow-bell';
import { SuperStarIcon } from '@/components/animate-ui/icons/super-star';
import { CountBadge } from '@/components/CountBadge';
import {
  ICEBREAKER_SUGGESTIONS,
  type CowProfile,
  type MatchConversation,
} from '@/data/cows';
import { playMooSound } from '@/lib/moo-sound';
import { cn } from '@/lib/utils';

export function MatchesChat({
  cows,
  conversations,
  selectedCowId,
  onSelectCow,
  onSendMessage,
  onRemoveMatch,
}: {
  cows: CowProfile[];
  conversations: MatchConversation[];
  selectedCowId: string | null;
  onSelectCow: (cowId: string) => void;
  onSendMessage: (cowId: string, text: string, giftTag?: string) => void;
  onRemoveMatch: (cowId: string) => void;
}) {
  return (
    <ReducedMotionConfig>
      <MatchesChatInner
        cows={cows}
        conversations={conversations}
        selectedCowId={selectedCowId}
        onSelectCow={onSelectCow}
        onSendMessage={onSendMessage}
        onRemoveMatch={onRemoveMatch}
      />
    </ReducedMotionConfig>
  );
}

function MatchesChatInner({
  cows,
  conversations,
  selectedCowId,
  onSelectCow,
  onSendMessage,
  onRemoveMatch,
}: {
  cows: CowProfile[];
  conversations: MatchConversation[];
  selectedCowId: string | null;
  onSelectCow: (cowId: string) => void;
  onSendMessage: (cowId: string, text: string, giftTag?: string) => void;
  onRemoveMatch: (cowId: string) => void;
}) {
  const reduce = useShouldReduceMotion();
  const move = useTempoTransition(spring.reflow);
  const away = useTempoTransition(motionTransition.dismiss);
  const fade = useTempoTransition(motionTransition.fade);
  const pressSpring = useTempoTransition(spring.press);

  const [draft, setDraft] = React.useState('');
  const listHeadingRef = React.useRef<HTMLHeadingElement | null>(null);
  const chatEndRef = React.useRef<HTMLDivElement | null>(null);

  const cowMap = React.useMemo(() => {
    const map = new Map<string, CowProfile>();
    for (const c of cows) map.set(c.id, c);
    return map;
  }, [cows]);

  const activeConversation =
    conversations.find((c) => c.cowId === selectedCowId) ??
    conversations[0] ??
    null;
  const activeCow = activeConversation
    ? cowMap.get(activeConversation.cowId) ?? null
    : null;

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }, [activeConversation?.messages.length, reduce]);

  // Rule A17 focus handoff on row removal (interactions/list.md)
  const handleLeaveAndRemove = (cowId: string, liElement: HTMLElement | null) => {
    if (liElement) {
      const next = (liElement.nextElementSibling ??
        liElement.previousElementSibling) as HTMLElement | null;
      if (liElement.contains(document.activeElement)) {
        (
          next?.querySelector<HTMLElement>('button, a, input') ??
          listHeadingRef.current
        )?.focus();
      }
      liElement.inert = true;
    }
    onRemoveMatch(cowId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCow || !draft.trim()) return;
    onSendMessage(activeCow.id, draft.trim());
    setDraft('');
  };

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-12 sm:px-6">
      {/* Left Sidebar: Swipe-to-Remove Match List (interactions/swipe-row.md + list.md) */}
      <aside className="flex flex-col rounded-3xl border border-amber-200/80 bg-white/95 p-5 shadow-sm lg:col-span-4 dark:border-stone-800 dark:bg-stone-900/95">
        <div className="flex items-center justify-between">
          <h2
            ref={listHeadingRef}
            tabIndex={-1}
            className="font-display text-lg font-extrabold text-stone-900 focus:outline-none dark:text-white"
          >
            Danh Sách Tương Hợp ({conversations.length})
          </h2>
          <span className="text-[11px] font-semibold text-stone-400">
            Vuốt trái để hủy ghép
          </span>
        </div>

        {conversations.length === 0 ? (
          <div className="my-12 flex flex-col items-center justify-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <CowBellIcon size={28} />
            </div>
            <p className="mt-3 text-sm font-bold text-stone-800 dark:text-stone-200">
              Chưa có cuộc trò chuyện nào
            </p>
            <p className="mt-1 text-xs text-stone-500">
              Hãy quay lại tab Quẹt Đồng Cỏ để thả tim cho các ứng viên bò VIP nhé!
            </p>
          </div>
        ) : (
          <ul className="mt-4 flex flex-col gap-2.5">
            <AnimatePresence mode="popLayout" initial={false}>
              {conversations.map((conv) => {
                const cow = cowMap.get(conv.cowId);
                if (!cow) return null;
                const isSelected = activeConversation?.cowId === conv.cowId;

                return (
                  <motion.li
                    key={conv.cowId}
                    layout="position"
                    transition={move}
                    exit="gone"
                    variants={{ gone: { opacity: 0, transition: away } }}
                    className="relative overflow-hidden rounded-2xl"
                  >
                    <SwipeMatchRow
                      cow={cow}
                      conversation={conv}
                      isSelected={isSelected}
                      onSelect={() => onSelectCow(conv.cowId)}
                      onDelete={(li) => handleLeaveAndRemove(conv.cowId, li)}
                    />
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </aside>

      {/* Right Column: Interactive Chat Window */}
      <section
        aria-label="Cửa sổ trò chuyện đồng cỏ"
        className="flex h-[640px] flex-col overflow-hidden rounded-3xl border border-stone-200/90 bg-white shadow-sm lg:col-span-8 dark:border-stone-800 dark:bg-stone-900"
      >
        {activeCow && activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 bg-stone-50/70 px-5 py-3.5 dark:border-stone-800 dark:bg-stone-950/60">
              <div className="flex items-center gap-3">
                <img
                  src={activeCow.images[0]}
                  alt={activeCow.name}
                  className="h-12 w-12 rounded-2xl border-2 border-amber-400 object-cover"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display text-base font-extrabold text-stone-900 dark:text-white">
                      {activeCow.name}
                    </h3>
                    {activeCow.verified && (
                      <ShieldCheck className="h-4 w-4 fill-sky-400 text-white dark:text-stone-900" />
                    )}
                    {activeConversation.isSuperMoo && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        <SuperStarIcon size={11} /> Siêu Bò
                      </span>
                    )}
                  </div>
                  <p className="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400">
                    <MapPin className="h-3 w-3 text-amber-500" />
                    {activeCow.breed} • {activeCow.region}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  type="button"
                  onClick={() => playMooSound(activeCow.stats.mooPitchHz, true)}
                  initial={{ transform: 'scale(1)' }}
                  whileTap={{
                    transform: reduce ? 'scale(1)' : `scale(${scale.press})`,
                  }}
                  transition={pressSpring}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 transition-colors hover:bg-amber-100 dark:border-amber-900/50 dark:bg-amber-950/50 dark:text-amber-300"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>Gọi Mooo ({activeCow.stats.mooPitchHz}Hz)</span>
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() =>
                    onSendMessage(
                      activeCow.id,
                      `Gửi tặng ${activeCow.name} 1 bó ${activeCow.favoriteGrass} tươi rói! 🌾🐄`,
                      'Quà Đồng Cỏ 🍀',
                    )
                  }
                  initial={{ transform: 'scale(1)' }}
                  whileTap={{
                    transform: reduce ? 'scale(1)' : `scale(${scale.press})`,
                  }}
                  transition={pressSpring}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-emerald-500"
                >
                  <Wheat className="h-3.5 w-3.5" />
                  <span>Tặng Cỏ Non</span>
                </motion.button>
              </div>
            </div>

            {/* Messages Stream (interactions/list.md) */}
            <div className="flex-1 overflow-y-auto p-5">
              <ul className="flex flex-col gap-3">
                <AnimatePresence mode="popLayout" initial={false}>
                  {activeConversation.messages.map((msg) => {
                    const isMe = msg.sender === 'me';
                    return (
                      <motion.li
                        key={msg.id}
                        layout="position"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: { ...move, opacity: fade },
                        }}
                        exit={{ opacity: 0, scale: 0.96, transition: fade }}
                        transition={move}
                        className={cn(
                          'flex flex-col',
                          isMe ? 'items-end' : 'items-start',
                        )}
                      >
                        {msg.giftTag && (
                          <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            <Sparkles className="h-3 w-3" /> {msg.giftTag}
                          </span>
                        )}
                        <div
                          className={cn(
                            'max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-2xs',
                            isMe
                              ? 'rounded-br-xs bg-gradient-to-r from-amber-500 to-orange-500 font-medium text-white'
                              : 'rounded-bl-xs border border-stone-200/80 bg-stone-100/90 text-stone-800 dark:border-stone-800 dark:bg-stone-800 dark:text-stone-100',
                          )}
                        >
                          {msg.text}
                        </div>
                        <span className="mt-1 px-1 text-[10px] text-stone-400">
                          {msg.timestamp}
                        </span>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
              <div ref={chatEndRef} />
            </div>

            {/* Quick Icebreaker Bar */}
            <div className="flex gap-2 overflow-x-auto border-t border-stone-100 bg-stone-50/50 px-4 py-2 dark:border-stone-800/70 dark:bg-stone-950/40">
              {ICEBREAKER_SUGGESTIONS.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => onSendMessage(activeCow.id, suggestion)}
                  className="shrink-0 rounded-full border border-amber-200/80 bg-white px-3 py-1 text-[11px] font-semibold text-stone-700 transition-colors hover:border-amber-400 hover:bg-amber-50 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-amber-700"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Message Input Form */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2.5 border-t border-stone-200/80 p-3.5 dark:border-stone-800"
            >
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={`Nhắn gì đó thật ngọt ngào cho ${activeCow.name}...`}
                className="h-11 flex-1 rounded-2xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100"
              />
              <AnimateIcon animateOnHover asChild>
                <motion.button
                  type="submit"
                  disabled={!draft.trim()}
                  initial={{ transform: 'scale(1)' }}
                  whileTap={{
                    transform: reduce ? 'scale(1)' : `scale(${scale.press})`,
                  }}
                  transition={pressSpring}
                  className="inline-flex h-11 items-center gap-2 rounded-2xl bg-amber-500 px-5 text-xs font-extrabold text-white shadow-sm transition-colors hover:bg-amber-600 disabled:opacity-45"
                >
                  <Send className="h-4 w-4" />
                  <span>Gửi Mooo</span>
                </motion.button>
              </AnimateIcon>
            </form>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <CowBellIcon size={40} className="text-amber-500" />
            <p className="mt-3 text-base font-bold text-stone-700 dark:text-stone-300">
              Chọn một ứng viên bò bên trái để bắt đầu trò chuyện
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

/**
 * Swipe-to-delete row following `references/interactions/swipe-row.md`
 */
function SwipeMatchRow({
  cow,
  conversation,
  isSelected,
  onSelect,
  onDelete,
}: {
  cow: CowProfile;
  conversation: MatchConversation;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (li: HTMLElement | null) => void;
}) {
  const back = useTempoTransition(spring.slide);
  const away = useTempoTransition(motionTransition.dismiss);
  const x = useMotionValue(0);

  const lastMessage =
    conversation.messages[conversation.messages.length - 1]?.text ??
    'Vừa ghép đôi thành công!';

  const onDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -110 || info.velocity.x < -480) {
      x.stop();
      const target = event.target as HTMLElement | null;
      onDelete(target?.closest('li') ?? null);
    }
  };

  return (
    <>
      <div className="absolute inset-0 flex items-center justify-end bg-rose-500 pr-4 text-xs font-bold text-white">
        Hủy ghép đôi
      </div>
      <motion.div
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0.6, right: 0 }}
        dragTransition={{
          bounceStiffness: back.stiffness as number,
          bounceDamping: back.damping as number,
        }}
        onDragEnd={onDragEnd}
        style={{ x }}
        variants={{ gone: { x: '-100%', transition: away } }}
        className={cn(
          'relative flex items-center justify-between gap-2.5 rounded-2xl border p-3 transition-colors',
          isSelected
            ? 'border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-stone-800'
            : 'border-stone-200/80 bg-white hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900 dark:hover:bg-stone-800',
        )}
      >
        <button
          type="button"
          onClick={onSelect}
          className="flex min-w-0 flex-1 items-center gap-3 text-left focus:outline-none"
        >
          <img
            src={cow.images[0]}
            alt={cow.name}
            className="h-12 w-12 shrink-0 rounded-xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-extrabold text-stone-900 dark:text-white">
                {cow.name}
              </span>
              {conversation.unreadCount > 0 && (
                <CountBadge count={conversation.unreadCount} label="tin chưa đọc" />
              )}
            </div>
            <p className="mt-0.5 truncate text-xs text-stone-500 dark:text-stone-400">
              {lastMessage}
            </p>
          </div>
        </button>

        {/* Visible Delete / Unmatch button as required by swipe-row.md ("Swiping is never the only way") */}
        <button
          type="button"
          aria-label={`Hủy tương hợp với ${cow.name}`}
          onClick={(e) => onDelete(e.currentTarget.closest('li'))}
          className="rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50 dark:hover:text-rose-400"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </motion.div>
    </>
  );
}
