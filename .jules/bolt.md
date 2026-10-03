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
