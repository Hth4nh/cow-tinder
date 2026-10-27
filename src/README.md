# `src/` — CowTinder Application Source

## Interface
- [`main.tsx`](file:///d:/Projects/PetProjects/cow-tinder/src/main.tsx): Mounts React 19 `<App />` into `#root`.
- [`App.tsx`](file:///d:/Projects/PetProjects/cow-tinder/src/App.tsx): Provides `<AnimateUIProvider tempo={tempo} checkAnimation={checkAnimation}>`, `<ReducedMotionConfig>`, and coordinates the 4 core views (`swipe`, `explore`, `matches`, `profile`), match celebration modal, and edge toast stack.
- [`data/cows.ts`](file:///d:/Projects/PetProjects/cow-tinder/src/data/cows.ts): Typed dataset (`CowProfile`, `MatchConversation`, `ChatMessage`) and bespoke multi-scene SVG pasture portrait generator.
- [`lib/moo-sound.ts`](file:///d:/Projects/PetProjects/cow-tinder/src/lib/moo-sound.ts): Web Audio API formant synthesis for cow vocalizations (`playMooSound`) and metallic pasture cowbell harmonics.

## Invariants
- Global `tempo` (`0.7`–`1.3`) and `checkAnimation` (`draw` | `pop`) flow through `AnimateUIProvider` to all `@animate-ui/react` primitives and custom `useTempoTransition` hooks.
- Every view transition respects `useShouldReduceMotion()` and neutralizes spatial shifts when reduced motion is enabled.

## Side Effects
- Toggles `.dark` on `document.documentElement` when theme changes.
- Synthesizes audio via `window.AudioContext` on explicit user gesture.
