# Bolt's Journal - Critical Learnings

## 2026-09-28 - HubWork Context Value and Callback Memoization
**Learning:** Central React Context providers (`HubWorkProvider`) that pass large unmemoized objects and inline callbacks cause all subscribed components (`Header`, `Navbar`, `HomeView`, `TasksView`, etc.) to re-render on every state change regardless of whether the consumed properties changed.
**Action:** Always memoize context provider value objects with `useMemo` and state updater callbacks with `useCallback` using functional state updaters (`setState(prev => ...)`).

## 2026-10-01 - Subtask Form State Localization in TasksView
**Learning:** Storing list item form input state (like subtask input text maps `{ [taskId]: string }`) at the parent view level causes the entire view component and all rendered list cards to re-render on every keystroke.
**Action:** Extract list item form inputs into dedicated, memoized sub-components (`React.memo`) to isolate input keystroke state local to the form.
