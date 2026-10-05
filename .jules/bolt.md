# Bolt's Journal - Critical Learnings

## 2026-09-28 - HubWork Context Value and Callback Memoization
**Learning:** Central React Context providers (`HubWorkProvider`) that pass large unmemoized objects and inline callbacks cause all subscribed components (`Header`, `Navbar`, `HomeView`, `TasksView`, etc.) to re-render on every state change regardless of whether the consumed properties changed.
**Action:** Always memoize context provider value objects with `useMemo` and state updater callbacks with `useCallback` using functional state updaters (`setState(prev => ...)`).

## 2026-10-01 - Subtask Form State Localization in TasksView
**Learning:** Storing list item form input state (like subtask input text maps `{ [taskId]: string }`) at the parent view level causes the entire view component and all rendered list cards to re-render on every keystroke.
**Action:** Extract list item form inputs into dedicated, memoized sub-components (`React.memo`) to isolate input keystroke state local to the form.

## 2026-10-03 - Short-Circuit Empty Queries and Memoize Global Search Filters
**Learning:** Modal search components that calculate filtered arrays across multiple domain entities (`tasks`, `events`, `transactions`, `meals`) without short-circuiting empty search queries execute array iterations and lowercasing string allocations on every render even when no search query is present.
**Action:** Normalize search queries once and short-circuit empty queries (`if (!q) return ...`) inside `useMemo` to return empty result sets instantly without iterating collections.

## 2026-10-04 - Gratitude Form State Localization in HealthView
**Learning:** Storing journaling input field state at the top-level module view component (`HealthView`) triggers a complete re-render of the entire view tree—including workout set trackers and daily macro progress bars—on every single keystroke.
**Action:** Extract journaling and text entry forms into memoized sub-components (`React.memo`) to isolate keystroke input state locally and prevent unnecessary view-level re-renders.

## 2026-10-05 - Deposit Modal Form State Localization in FinanceView
**Learning:** Storing modal deposit input field states (`depositAmount`, `depositAccountId`) at the top-level `FinanceView` causes every keystroke and dropdown selection to re-render the entire view tree (including accounts list, upcoming bills, and 90-day forecast cards).
**Action:** Extract modal forms with local state into dedicated sub-components wrapped in `React.memo` (`SavingsDepositModal`) to isolate keystroke state locally and prevent parent view re-renders.
