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

## 2026-10-06 - Punctuality Engine Modal Form State Localization in EventsView
**Learning:** Storing travel distance and preparation input states (`distanceKm`, `prepMins`) at the top-level `EventsView` causes every input keystroke to re-render the entire view tree (including headers, calendar sync banners, and all rendered event cards).
**Action:** Extract travel engine route modal forms into dedicated sub-components wrapped in `React.memo` (`MultiModeTravelModal`) to isolate keystroke input state locally and prevent parent view re-renders.

## 2026-10-07 - Quick Action Modal Form State Localization
**Learning:** Storing form input field states across all tabs (`taskTitle`, `eventTitle`, `financeTitle`, `mealTitle`, `workoutTitle`, `journalText`) at the top-level `QuickActionModal` component causes every single keystroke in any form input to re-render the entire modal shell, header, and all action tab selector buttons.
**Action:** Extract tab-specific form inputs into dedicated sub-components wrapped in `React.memo` (`TaskForm`, `EventForm`, `FinanceForm`, `MealForm`, `WorkoutForm`, `JournalForm`) to isolate form input keystroke state locally.

## 2026-10-10 - Notification Menu Popover State Localization in Header
**Learning:** Storing popover open/close toggle state (`showNotificationMenu`) in top-level layout components (`Header`) causes every toggle event to re-render the entire header bar shell (including user avatars, live clock, weather widgets, and search button triggers).
**Action:** Extract popover menus with local open/close state into dedicated sub-components wrapped in `React.memo` (`NotificationsPopover`) to isolate toggle state locally and prevent parent layout re-renders.

## 2026-10-11 - Task-to-Event Schedule Modal Form State Localization in TasksView
**Learning:** Storing modal start time input state (`eventScheduleTime`) in top-level view components (`TasksView`) causes every time picker input change to re-render the entire view tree (including headers, category filters, view mode toggle buttons, and all task cards with subtask checklists).
**Action:** Extract modal scheduling forms into dedicated sub-components wrapped in `React.memo` (`ScheduleTaskModal`) to isolate form input state locally and prevent parent view re-renders.
