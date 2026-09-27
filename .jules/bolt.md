## 2026-09-27 - Memoization in React Context Provider
**Learning:** Wrapping context provider action methods in `useCallback` and memoizing the context value with `useMemo` prevents unnecessary re-renders across all child components consuming the context when state updates occur.
**Action:** Always wrap action callbacks in `useCallback` and memoize context provider `value` objects in React context providers.
