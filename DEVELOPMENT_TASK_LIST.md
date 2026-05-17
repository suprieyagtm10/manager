# Developer Task List — Responsive Roster Platform

## Completed responsive engineering tasks
- Mobile, tablet, laptop and desktop dashboard shell support.
- Collapsible hamburger sidebar for mobile and fixed highlighted sidebar for desktop.
- Touch-friendly buttons, menus, profile actions, forms and navigation items.
- Responsive dashboard content spacing with no intentional horizontal page overflow.
- Mobile-safe staff profile cards with edit/deactivate actions.
- Mobile-safe availability cards with view/delete actions.
- Horizontally scrollable leave, reports, roster and working-hours data sections where dense data must remain tabular.
- Mobile-friendly dialogs with constrained viewport height and internal scrolling.
- Mobile-friendly form grids and full-width controls.
- Healthcare-friendly spacing, readable typography, clearer contrast and stronger active/hover/tap feedback.
- Supabase auth/database logic preserved.

## Required responsive test matrix
Test at:
- 360px mobile
- 390px iPhone
- 768px tablet
- 1024px laptop
- 1440px desktop

## Required checks before deployment
- No horizontal overflow on the app shell.
- Mobile sidebar opens, closes and navigation links are usable.
- Desktop sidebar remains fixed and highlights the active route.
- Roster table/calendar is readable and usable.
- Staff profiles can be created, edited and activated/deactivated.
- Kitchen/FSA/Chef, Nurse/RN/EN and PCA workflows are easy to access from staff views.
- Working hours can be recorded and deleted.
- Leave requests can be approved, rejected, edited and deleted.
- Availability submissions can be viewed and deleted.
- Settings and reports are usable on small screens.
- Login, logout and session refresh still work.
- Supabase data loads correctly and errors show clear feedback.
- Loading, empty and error states remain visible and understandable.
- Production build succeeds on Vercel.
