# Copilot Instructions

## Commands

- `npm run dev` - start the Vite dev server.
- `npm run build` - run TypeScript project build (`tsc -b`) and then the Vite production build.
- `npm run lint` - run ESLint across the repository.
- `npm run start` - serve the built app with Caddy using `Caddyfile`.

## Testing

- There is currently **no `test` script** in `package.json`.
- `src/features/auth/services/authService/authService.spec.ts` is a commented scaffold and notes that Vitest is not installed, so there is no supported single-test command yet.

## High-level architecture

- This is a React 19 + TypeScript + Vite ERP frontend. `src/App.tsx` is the app shell: it restores auth state on startup, applies the shared MUI theme, mounts `CssBaseline`, wraps the app in `NotificationProvider`, and renders the router.
- Routing is centralized in `src/config/router/index.tsx` with route constants in `src/config/router/routes.ts`. `/` is the public landing page, `/portal` is the login entry, and business pages are protected by `ProtectedRoute` and wrapped in `MainLayout`.
- `MainLayout` provides the fixed app bar + sidebar shell for authenticated pages. Navigation is hard-coded in `src/features/shared/components/MainLayout/Sidebar.tsx`, so adding a new protected page usually means updating both the router and the sidebar menu.
- The codebase is organized by business feature under `src/features/` (`auth`, `billing`, `landing`, `roles`, `shared`, `users`, `work`). Within a feature, the recurring flow is:
  - page/view component for orchestration,
  - custom hook(s) for state and derived data,
  - service class/functions for backend calls,
  - interfaces/models for the domain types.
- `WeeklySchedulePage` is the clearest example of the intended shape: the page coordinates multiple hooks and dialogs, while `useWeeklySchedule` handles date/range logic and `WorkService` handles API access and response normalization.
- HTTP is centralized in `src/config/services/api.ts` and `src/config/services/apiService.ts`. Services should go through `apiService`, not raw `axios`, so they inherit shared headers, auth injection, and 401 handling.

## Key conventions

- Use the `@/` alias for cross-feature imports; it is wired in both `vite.config.ts` and `tsconfig.app.json`.
- Keep feature-local code inside its feature folder. Shared UI or cross-cutting utilities belong under `src/features/shared`.
- Follow the repo’s barrel-export pattern. Most directories expose public entry points through `index.ts` or `index.tsx`, and higher-level code imports from those barrels rather than deep relative paths.
- Backend-facing types often use **PascalCase field names** (`UserId`, `FirstName`, `RoleId`, `IsAdmin`, etc.). Do not “fix” these to camelCase unless a service is explicitly mapping backend data to a frontend shape.
- Services commonly normalize inconsistent backend payloads before returning data. Preserve that pattern when adding endpoints: accept that responses may arrive as a direct array/object or inside `data`, `users`, `roles`, `Tasks`, or similar wrapper properties.
- Service methods validate inputs, log context, and throw descriptive errors; hooks catch those errors and manage UI state. Keep that separation instead of putting fetch logic directly in page components.
- Auth state is split between local storage and Zustand:
  - token key: `x-token`
  - stored user/auth payload key: `log-user`
  - the request interceptor sends both `x-token` and `Authorization: Bearer ...`
  - the response interceptor handles `401` globally by clearing auth state, showing a global notification, storing `redirectAfterLogin`, and redirecting to `/portal`
- For notifications outside React components, use the exported helpers from `src/features/shared/contexts/NotificationContext.tsx` (`showGlobalSuccess`, `showGlobalError`, etc.) instead of building ad hoc snackbar logic.
- Be careful with work-scheduling dates. `useWeeklySchedule` intentionally strips ISO timestamps down to `YYYY-MM-DD` before parsing so backend UTC dates do not shift across time zones in the weekly calendar.
