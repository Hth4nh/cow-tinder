# CowTinder Frontend Specification (Animate UI Edition)

## 1. Overview & Goals
**CowTinder** is an interactive, pasture-themed matchmaking and breeding discovery web application for prize cattle and herd companions. Built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Animate UI (`@animate-ui/react` + `motion`)**, the frontend showcases spring-driven physicality, zero-re-render gesture physics, shared-element layout transitions, and full reduced-motion and keyboard accessibility.

## 2. Technical Stack & Animate UI Architecture
- **Framework**: React 19 + TypeScript + Vite 7
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`) with pasture-inspired warm amber/terracotta/emerald palette and dark mode support.
- **Motion Engine**: `@animate-ui/react` (`^2.0.0`) and `motion` (`motion/react`).
- **Global Pace & Check Provider**: Wrapped in `<AnimateUIProvider tempo={tempo} checkAnimation={checkAnimation}>` allowing real-time adjustment of app-wide animation pace (`0.7` to `1.3`) and checkbox/selection check styles (`draw` vs `pop`).
- **Accessibility & Quality Rules**:
  - Every motion boundary is wrapped in `<ReducedMotionConfig>` and neutralizes transform strings via `useShouldReduceMotion()` (Rule A1).
  - Keyboard shortcuts (`ArrowLeft`, `ArrowRight`, `ArrowUp`, `Backspace`, `Enter`, `Escape`) trigger the exact same animations as pointer gestures (Rule A2).
  - Hover interactions are gated to fine pointers (`(hover: hover) and (pointer: fine)`) (Rule A3).
  - Drag/swipe coordinates and card tilt use `useMotionValue` and `useTransform` so pointer tracking causes zero React state re-renders (Rule A10).
  - Never uses `transition-all`; explicitly lists transitioned properties (Rule A11).

## 3. Core Feature Modules & Animate UI Token Mapping

| Module | Component File | Animate UI Primitives & Recipes Used | Motion Tokens |
| :--- | :--- | :--- | :--- |
| **Header & Navigation** | `src/components/Navbar.tsx` | `@animate-ui/react/primitives/tabs` or `Highlight` indicator (`recipes/indicator.md`), `CountBadge` (`SlidingNumber` + `spring.bounce`), `ThemeToggler` (`@animate-ui/react/primitives/effects/theme-toggler`), `RotatingText` tagline (`recipes/swap.md`) | `spring.selection`, `spring.bounce`, `spring.press`, `scale.press` |
| **Pasture Swipe Deck** | `src/components/SwipeDeck.tsx` | 3D/2D drag card stack (`useMotionValue`, `useTransform`), `Particles` burst on Super Moo (`@animate-ui/react/primitives/effects/particles`), `Tooltip` (`@animate-ui/react/primitives/radix-ui`), Animated SVG icons (`@animate-ui/react/icons`) | `spring.press`, `spring.slide`, `transition.dismiss`, `scale.press`, `blur.icon` |
| **Match Celebration Modal** | `src/components/MatchModal.tsx` | `@animate-ui/react/primitives/radix-ui` Dialog (`recipes/modal.md`), `Particles`, icebreaker quick actions | `spring.dialog`, `transition.dialogFade`, `transition.overlay`, `transition.dismiss`, `blur.surface` |
| **Pasture Explorer Grid** | `src/components/ExplorerGrid.tsx` | Filtered & sorted grid (`interactions/filter-grid.md`) + Expanding Card detail view (`interactions/expanding-card.md`) + `CountingNumber` stats | `spring.reflow`, `spring.dialog`, `transition.fade`, `transition.reveal`, `transition.swap`, `scale.choice` |
| **Herd Matches & Chat** | `src/components/MatchesChat.tsx` | Animated list (`interactions/list.md`), Swipe-to-remove row (`interactions/swipe-row.md`), live chat bubbles, icebreaker chips | `spring.reflow`, `spring.slide`, `transition.fade`, `transition.dismiss` |
| **My Cow Profile & Tempo Lab** | `src/components/ProfileSettings.tsx` | `StatusButton` (`interactions/status-button.md`), Copy Tag swap (`recipes/swap.md`), `CountingNumber`, `AnimateUIProvider` live `tempo` & `checkAnimation` controls, Radix Switch/Checkbox (`@animate-ui/react/primitives/radix-ui`) | `spring.press`, `spring.reflow`, `transition.swap`, `spring.number`, `blur.icon` |
| **Toast Notifications** | `src/components/ToastStack.tsx` | Edge toast stack (`recipes/toast.md`) | `spring.toast`, `transition.dismiss`, `scale.toast`, `blur.surface` |
| **Animated Custom Icons** | `src/components/animate-ui/icons/*` | Custom SVG icons built on `@animate-ui/react/icons` (`IconWrapper`, `getVariants`, `useAnimateIconContext`) | Authored damped swings & pops scaled by `tempo` & `speed` |
