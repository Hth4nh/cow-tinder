# `src/components/` — Animate UI Feature Components & Custom Icons

## Interface
- [`Navbar.tsx`](file:///d:/Projects/PetProjects/cow-tinder/src/components/Navbar.tsx): Sticky pasture header with `RotatingText` inline tagline, `Highlight` gliding pill bar, `CountBadge`, and `ThemeToggler` View Transition wipe.
- [`SwipeDeck.tsx`](file:///d:/Projects/PetProjects/cow-tinder/src/components/SwipeDeck.tsx): Gesture-driven card stack (`useMotionValue`, `useTransform`), keyboard controls, `Particles` bursts, Radix `Tooltip` dock, and Radix `Dialog` pedigree modal.
- [`MatchModal.tsx`](file:///d:/Projects/PetProjects/cow-tinder/src/components/MatchModal.tsx): Celebratory match dialog (`DialogPrimitive.Content from="top"`) with `Particles` and instant icebreaker triggers.
- [`ExplorerGrid.tsx`](file:///d:/Projects/PetProjects/cow-tinder/src/components/ExplorerGrid.tsx): Filterable pedigree grid (`spring.reflow` + `AnimatePresence mode="popLayout"`) and shared-`layoutId` Expanding Card view (`spring.dialog`).
- [`MatchesChat.tsx`](file:///d:/Projects/PetProjects/cow-tinder/src/components/MatchesChat.tsx): Swipe-to-unmatch conversation list (`drag="x"`, `dragDirectionLock`, `Rule A17` focus handoff) and interactive chat stream.
- [`ProfileSettings.tsx`](file:///d:/Projects/PetProjects/cow-tinder/src/components/ProfileSettings.tsx): Prize cow profile editor (`StatusButton`, `CopyEarTagButton`, Radix `Switch`) and live Animate UI Motion Studio.
- [`CountBadge.tsx`](file:///d:/Projects/PetProjects/cow-tinder/src/components/CountBadge.tsx): Rolling digit badge (`SlidingNumber` + `spring.bounce`).
- [`StatusButton.tsx`](file:///d:/Projects/PetProjects/cow-tinder/src/components/StatusButton.tsx): Multi-state action button (`idle` | `loading` | `success` | `error`) and fixed-width grid label swap (`CopyEarTagButton`).
- [`ToastStack.tsx`](file:///d:/Projects/PetProjects/cow-tinder/src/components/ToastStack.tsx): Bottom-right notification stack (`spring.toast`, `transition.dismiss`).
- `animate-ui/icons/*`: Custom SVG icons (`CowBellIcon`, `HeartSparkIcon`, `SuperStarIcon`, `FlameHerdIcon`) built on `@animate-ui/react/icons`.

## Invariants
- All 10 motion-enabled component files wrap their trees in `ReducedMotionConfig` and pass `@animate-ui/cli audit` with 0 pattern violations.
- Pointer/drag coordinates are bound to MotionValues and never trigger React state re-renders during drag gestures.

## Side Effects
- `CopyEarTagButton` writes the cow's ear tag string to `navigator.clipboard`.
- `MatchesChat` sets `li.inert = true` and transfers DOM focus to the adjacent item or heading before unmounting a removed match row.
