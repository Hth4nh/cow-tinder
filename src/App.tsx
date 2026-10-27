'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AnimateUIProvider,
  type CheckAnimation,
} from '@animate-ui/react/provider';
import {
  blur,
  ReducedMotionConfig,
  shift,
  transition as motionTransition,
  useShouldReduceMotion,
  useTempoTransition,
} from '@animate-ui/react/utils/motion';
import {
  COW_AUTO_REPLIES,
  INITIAL_CONVERSATIONS,
  INITIAL_COWS,
  type CowProfile,
  type MatchConversation,
} from '@/data/cows';
import { Navbar, type ActiveTab } from '@/components/Navbar';
import { SwipeDeck, type SwipeDirection } from '@/components/SwipeDeck';
import { ExplorerGrid } from '@/components/ExplorerGrid';
import { MatchesChat } from '@/components/MatchesChat';
import { ProfileSettings } from '@/components/ProfileSettings';
import { MatchModal } from '@/components/MatchModal';
import { ToastStack, type ToastItem } from '@/components/ToastStack';

const TAB_ORDER: ActiveTab[] = ['swipe', 'explore', 'matches', 'profile'];
const TEMPO_CYCLE = [1, 0.85, 0.7, 1.15, 1.3];

export function App() {
  const [tempo, setTempo] = React.useState<number>(1);
  const [checkAnimation, setCheckAnimation] =
    React.useState<CheckAnimation>('draw');
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleQuickTempoCycle = () => {
    setTempo((current) => {
      const idx = TEMPO_CYCLE.indexOf(current);
      return TEMPO_CYCLE[(idx + 1) % TEMPO_CYCLE.length];
    });
  };

  return (
    <AnimateUIProvider tempo={tempo} checkAnimation={checkAnimation}>
      <ReducedMotionConfig>
        <CowTinderMain
          tempo={tempo}
          onTempoChange={setTempo}
          onQuickTempoCycle={handleQuickTempoCycle}
          checkAnimation={checkAnimation}
          onCheckAnimationChange={setCheckAnimation}
          theme={theme}
          onThemeChange={setTheme}
        />
      </ReducedMotionConfig>
    </AnimateUIProvider>
  );
}

function CowTinderMain({
  tempo,
  onTempoChange,
  onQuickTempoCycle,
  checkAnimation,
  onCheckAnimationChange,
  theme,
  onThemeChange,
}: {
  tempo: number;
  onTempoChange: (t: number) => void;
  onQuickTempoCycle: () => void;
  checkAnimation: CheckAnimation;
  onCheckAnimationChange: (c: CheckAnimation) => void;
  theme: 'light' | 'dark';
  onThemeChange: (next: 'light' | 'dark') => void;
}) {
  const reduce = useShouldReduceMotion();
  const panelIn = useTempoTransition(motionTransition.panelIn);
  const panelOut = useTempoTransition(motionTransition.panelOut);

  const [activeTab, setActiveTab] = React.useState<ActiveTab>('swipe');
  const [prevTabIndex, setPrevTabIndex] = React.useState<number>(0);

  const [deck, setDeck] = React.useState<CowProfile[]>(INITIAL_COWS);
  const [swipedHistory, setSwipedHistory] = React.useState<
    { cow: CowProfile; direction: SwipeDirection }[]
  >([]);
  const [superMooCount, setSuperMooCount] = React.useState<number>(5);
  const [boostActive, setBoostActive] = React.useState<boolean>(false);

  const [conversations, setConversations] = React.useState<MatchConversation[]>(
    INITIAL_CONVERSATIONS,
  );
  const [selectedChatCowId, setSelectedChatCowId] = React.useState<
    string | null
  >(INITIAL_CONVERSATIONS[0]?.cowId ?? null);

  const [celebratingMatch, setCelebratingMatch] = React.useState<{
    cow: CowProfile;
    isSuperMoo: boolean;
  } | null>(null);

  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const addToast = React.useCallback(
    (
      title: string,
      description?: string,
      variant: ToastItem['variant'] = 'default',
    ) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, title, description, variant }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4200);
    },
    [],
  );

  const dismissToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleTabChange = (nextTab: ActiveTab) => {
    if (!TAB_ORDER.includes(nextTab)) return;
    setPrevTabIndex(TAB_ORDER.indexOf(activeTab));
    setActiveTab(nextTab);
    if (nextTab === 'matches' && selectedChatCowId) {
      // Mark active conversation read
      setConversations((prev) =>
        prev.map((c) =>
          c.cowId === selectedChatCowId ? { ...c, unreadCount: 0 } : c,
        ),
      );
    }
  };

  const ensureConversation = React.useCallback(
    (cow: CowProfile, isSuperMoo: boolean, initialMessage?: string) => {
      setConversations((prev) => {
        const exists = prev.find((c) => c.cowId === cow.id);
        const nowStr = new Date().toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        });

        if (exists) {
          if (!initialMessage) return prev;
          return prev.map((c) =>
            c.cowId === cow.id
              ? {
                  ...c,
                  unreadCount: 0,
                  messages: [
                    ...c.messages,
                    {
                      id: crypto.randomUUID(),
                      sender: 'me',
                      text: initialMessage,
                      timestamp: nowStr,
                    },
                  ],
                }
              : c,
          );
        }

        const newConv: MatchConversation = {
          cowId: cow.id,
          matchedAt: 'Vừa xong',
          isSuperMoo,
          unreadCount: initialMessage ? 0 : 1,
          messages: initialMessage
            ? [
                {
                  id: crypto.randomUUID(),
                  sender: 'me',
                  text: initialMessage,
                  timestamp: nowStr,
                },
              ]
            : [
                {
                  id: crypto.randomUUID(),
                  sender: 'cow',
                  text: `Moooo~ Chào đằng ấy! Mình rất vui khi được ghép đôi trên đồng cỏ ${cow.region}! 🌾🐄`,
                  timestamp: nowStr,
                },
              ],
        };
        return [newConv, ...prev];
      });
    },
    [],
  );

  const handleSwipe = React.useCallback(
    (cow: CowProfile, direction: SwipeDirection) => {
      setDeck((prev) => prev.filter((c) => c.id !== cow.id));
      setSwipedHistory((prev) => [...prev, { cow, direction }]);

      if (direction === 'super') {
        setSuperMooCount((c) => Math.max(0, c - 1));
        ensureConversation(cow, true);
        setCelebratingMatch({ cow, isSuperMoo: true });
        addToast(
          `Siêu Tương Hợp với ${cow.name}!`,
          'Ứng viên bò VIP đã nhận được Ngôi Sao Đồng Cỏ của bạn.',
          'super',
        );
      } else if (direction === 'right') {
        if (cow.likesBack || boostActive) {
          ensureConversation(cow, false);
          setCelebratingMatch({ cow, isSuperMoo: false });
          addToast(
            `Tâm Đầu Ý Hợp với ${cow.name}!`,
            `Cả hai đều mê ${cow.favoriteGrass}.`,
            'match',
          );
        } else {
          addToast(
            `Đã thả tim cho ${cow.name}`,
            'Tiếng Mooo của bạn đã được gửi qua sườn đồi.',
            'info',
          );
        }
      }
    },
    [addToast, boostActive, ensureConversation],
  );

  const handleRewind = React.useCallback(() => {
    setSwipedHistory((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setDeck((currentDeck) => [
        last.cow,
        ...currentDeck.filter((c) => c.id !== last.cow.id),
      ]);
      addToast(
        `Đã gọi ${last.cow.name} quay lại!`,
        'Bạn có thể xem xét lại hồ sơ phả hệ của ứng viên này.',
        'default',
      );
      return prev.slice(0, -1);
    });
  }, [addToast]);

  const handleResetDeck = React.useCallback(() => {
    setDeck(INITIAL_COWS);
    setSwipedHistory([]);
    addToast(
      'Đã làm mới toàn bộ Đồng Cỏ!',
      'Tất cả 8 ứng viên bò VIP đã sẵn sàng.',
      'default',
    );
  }, [addToast]);

  const handleTriggerBoost = React.useCallback(() => {
    setBoostActive((prev) => {
      const next = !prev;
      addToast(
        next ? 'Đã bật Tăng Tốc Đồng Cỏ x2!' : 'Đã tắt Tăng Tốc Đồng Cỏ',
        next
          ? 'Mọi lượt thả tim hiện tại đều chắc chắn ghép đôi thành công 100%!'
          : 'Trở về chế độ ghép đôi tự nhiên.',
        next ? 'super' : 'default',
      );
      return next;
    });
  }, [addToast]);

  const handleSendMessage = React.useCallback(
    (cowId: string, text: string, giftTag?: string) => {
      const nowStr = new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      });

      setConversations((prev) =>
        prev.map((c) =>
          c.cowId === cowId
            ? {
                ...c,
                unreadCount: 0,
                messages: [
                  ...c.messages,
                  {
                    id: crypto.randomUUID(),
                    sender: 'me',
                    text,
                    timestamp: nowStr,
                    giftTag,
                  },
                ],
              }
            : c,
        ),
      );

      // Simulated playful cow reply after 900ms
      setTimeout(() => {
        const replyText =
          COW_AUTO_REPLIES[Math.floor(Math.random() * COW_AUTO_REPLIES.length)];
        const replyTime = new Date().toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        });

        setConversations((prev) =>
          prev.map((c) =>
            c.cowId === cowId
              ? {
                  ...c,
                  messages: [
                    ...c.messages,
                    {
                      id: crypto.randomUUID(),
                      sender: 'cow',
                      text: replyText,
                      timestamp: replyTime,
                    },
                  ],
                }
              : c,
          ),
        );
      }, 900);
    },
    [],
  );

  const handleSendIcebreakerFromModal = React.useCallback(
    (cow: CowProfile, messageText: string) => {
      ensureConversation(cow, celebratingMatch?.isSuperMoo ?? false);
      handleSendMessage(cow.id, messageText);
      setCelebratingMatch(null);
      setSelectedChatCowId(cow.id);
      setActiveTab('matches');
    },
    [celebratingMatch?.isSuperMoo, ensureConversation, handleSendMessage],
  );

  const handleRemoveMatch = React.useCallback(
    (cowId: string) => {
      const removedCow = INITIAL_COWS.find((c) => c.id === cowId);
      setConversations((prev) => {
        const next = prev.filter((c) => c.cowId !== cowId);
        if (selectedChatCowId === cowId) {
          setSelectedChatCowId(next[0]?.cowId ?? null);
        }
        return next;
      });
      if (removedCow) {
        addToast(
          `Đã hủy tương hợp với ${removedCow.name}`,
          'Bạn có thể gặp lại ứng viên này khi làm mới đồng cỏ.',
          'default',
        );
      }
    },
    [addToast, selectedChatCowId],
  );

  const unreadMatchesCount = React.useMemo(
    () => conversations.reduce((sum, c) => sum + c.unreadCount, 0),
    [conversations],
  );

  const matchedCowIds = React.useMemo(
    () => new Set(conversations.map((c) => c.cowId)),
    [conversations],
  );

  const currentTabIndex = TAB_ORDER.indexOf(activeTab);
  const slideOffset =
    reduce || currentTabIndex === prevTabIndex
      ? 0
      : currentTabIndex > prevTabIndex
        ? shift.tabs
        : -shift.tabs;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        unreadMatchesCount={unreadMatchesCount}
        totalMatchesCount={conversations.length}
        theme={theme}
        onThemeChange={onThemeChange}
        tempo={tempo}
        onQuickTempoCycle={onQuickTempoCycle}
      />

      {/* Main Content Area with Tab Panel transitions (blur.panel + shift.tabs) */}
      <main className="flex-1 pb-12">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={{
              opacity: 0,
              x: slideOffset,
              filter: blur.panel,
            }}
            animate={{
              opacity: 1,
              x: 0,
              filter: 'blur(0px)',
              transition: panelIn,
            }}
            exit={{
              opacity: 0,
              x: -slideOffset,
              filter: blur.panel,
              transition: panelOut,
            }}
          >
            {activeTab === 'swipe' && (
              <SwipeDeck
                deck={deck}
                swipedHistory={swipedHistory}
                superMooCount={superMooCount}
                boostActive={boostActive}
                onSwipe={handleSwipe}
                onRewind={handleRewind}
                onResetDeck={handleResetDeck}
                onTriggerBoost={handleTriggerBoost}
              />
            )}

            {activeTab === 'explore' && (
              <ExplorerGrid
                cows={INITIAL_COWS}
                matchedCowIds={matchedCowIds}
                onLikeCow={(cow) => handleSwipe(cow, 'right')}
                onSuperMooCow={(cow) => handleSwipe(cow, 'super')}
              />
            )}

            {activeTab === 'matches' && (
              <MatchesChat
                cows={INITIAL_COWS}
                conversations={conversations}
                selectedCowId={selectedChatCowId}
                onSelectCow={(cowId) => {
                  setSelectedChatCowId(cowId);
                  setConversations((prev) =>
                    prev.map((c) =>
                      c.cowId === cowId ? { ...c, unreadCount: 0 } : c,
                    ),
                  );
                }}
                onSendMessage={handleSendMessage}
                onRemoveMatch={handleRemoveMatch}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileSettings
                tempo={tempo}
                onTempoChange={onTempoChange}
                checkAnimation={checkAnimation}
                onCheckAnimationChange={onCheckAnimationChange}
                totalMatchesCount={conversations.length}
                totalSwipesCount={swipedHistory.length}
                onShowToast={(title, desc) => addToast(title, desc, 'info')}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Instant Match Celebration Modal */}
      <MatchModal
        matchedCow={celebratingMatch?.cow ?? null}
        isSuperMoo={celebratingMatch?.isSuperMoo ?? false}
        onClose={() => setCelebratingMatch(null)}
        onSendIcebreaker={handleSendIcebreakerFromModal}
      />

      {/* Edge Toast Notifications */}
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
