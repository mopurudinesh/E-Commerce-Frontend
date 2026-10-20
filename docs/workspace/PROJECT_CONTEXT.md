# Frontend workspace context

Last reviewed: 2026-10-20. The shared project status and verification record is at `C:\E-Commerce\PROJECT_CONTEXT.md`.

## Frontend implementation

React 19, Vite 8, React Router 7 and Axios. Routes cover registration, login, protected home, forgot password, OTP verification, reset password, and protected `/change-password`. `AuthContext` hydrates identity from the backend session; localStorage identity is display-only. Axios sends credentials and fetches a CSRF token before each state-changing request. Registration and phone recovery use the maintained `react-phone-number-input` component and E.164 values.

The Change Password page validates the current password, new password policy and confirmation; success clears frontend auth state because the backend revokes all sessions. Styling remains light-only. No shopping features were added.

Login shows registration/reset/change confirmation messages as green success alerts, while login and form failures use red error alerts.

## Verified frontend checks

`npm test -- --reporter=dot --silent`: 11 passed in 2 files, including green registration-success and red authentication-error alert styling. `npm run build`: succeeded with a generated-chunk-size warning. `npm run lint`: exit 0 with one Fast Refresh warning in `src/context/AuthContext.jsx:97`. Browser checks covered international phone registration, duplicate rejection, email and phone login, logout, protected home redirect, Change Password route and wrong-current-password rejection, plus phone OTP recovery to the reset screen. The browser reset submission awaits user handoff. See the root context for backend and safety limitations.
