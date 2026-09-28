# Bolt's Journal - Critical Learnings

## 2026-09-28 - HubWork Context Value and Callback Memoization
**Learning:** Central React Context providers (`HubWorkProvider`) that pass large unmemoized objects and inline callbacks cause all subscribed components (`Header`, `Navbar`, `HomeView`, `TasksView`, etc.) to re-render on every state change regardless of whether the consumed properties changed.
**Action:** Always memoize context provider value objects with `useMemo` and state updater callbacks with `useCallback` using functional state updaters (`setState(prev => ...)`).
