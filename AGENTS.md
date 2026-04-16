# AGENTS

## Stack and entrypoints
- Single-package Vite app, not a monorepo. Stack: React 18 + TypeScript + Tailwind + shadcn/Radix.
- App bootstraps in `src/main.tsx`. The real route table is hardcoded in `src/App.tsx` with `BrowserRouter`; edit that file when adding or removing screens.
- `src/pages/Index.tsx` exists but is currently unused.
- The UI is mobile-first: `AppLayout` constrains most screens to `max-w-lg` and adds the fixed bottom nav unless `showNav={false}`.

## Source of truth for app behavior
- There is no real backend or env-driven API layer in the current app. Transaction, account, recipient, bank, and FX data all come from `src/data/mock.ts`.
- Auth state lives only in `src/store/auth.ts` via Zustand and is in-memory only. Login is mocked: PIN `123456` succeeds, biometric verification is simulated, and lockout logic is local state.
- Payment flows are not centralized. Each `src/pages/Pay*.tsx` screen owns its own `step` state (`form -> summary -> biometric/processing -> receipt`) and reuses `PaymentSummary`, `BiometricVerify`, and `ReceiptScreen` from `src/components/fintech`.

## Directory conventions
- `src/components/ui` contains shadcn-style primitives configured by `components.json`.
- `src/components/fintech` contains product-specific widgets.
- `src/components/layout` contains the shared app shell pieces like `AppLayout`, `BottomNav`, and `PageHeader`.
- Use the `@` alias for `src` imports.

## Commands
- Default to `npm` here. Both `package-lock.json` and `bun.lock` exist, but the verified commands below were run with `npm`.
- Dev server: `npm run dev` (Vite serves on port `8080` and host `::`).
- Production build: `npm run build`
- Lint: `npm run lint`
- Full tests: `npm run test`
- Single test file: `npm test -- src/test/example.test.ts`
- Typecheck: there is no script; use `npx tsc -p tsconfig.app.json --noEmit`

## Verification gotchas
- Vitest runs in `jsdom` and loads `src/test/setup.ts`, which stubs `window.matchMedia`. Keep that setup in mind for component tests.
- `npm run lint` is currently not clean before any new changes. Verified existing errors:
  - `src/components/ui/command.tsx`
  - `src/components/ui/textarea.tsx`
  - `tailwind.config.ts`
- `npm run lint` also reports several existing `react-refresh/only-export-components` warnings in `src/components/ui/*`.
- `npm run build` currently succeeds, but Vite warns that the Google Fonts `@import` in `src/index.css` comes after Tailwind directives.

## Styling notes
- Theme tokens live in `src/index.css` and `tailwind.config.ts`.
- Reuse the existing utility classes `fintech-gradient`, `fintech-gradient-light`, `fintech-shadow`, `fintech-shadow-lg`, `safe-top`, and `safe-bottom` instead of re-declaring similar styles.
