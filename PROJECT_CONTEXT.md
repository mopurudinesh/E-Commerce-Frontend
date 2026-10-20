# E-Commerce authentication frontend — project handover

Last reviewed: 2026-10-20. This guide describes the current frontend source and integration contract so a new developer or AI agent can continue the project. Verify claims against code before changing anything. The backend companion guide is in the [E-Commerce-Backend repository](https://github.com/mopurudinesh/E-Commerce-Backend/blob/main/PROJECT_CONTEXT.md).

## Purpose and scope

This repository contains the browser application for the E-Commerce authentication milestone: registration, login, protected welcome home, forgot password, OTP verification, reset password, and authenticated change password. Product listings, cart, checkout, payments, and order history are outside this milestone. The design is light mode only; there is no dark-mode toggle.

## Current implementation and verification

- Seven authentication route screens are implemented and use the backend API.
- Registration and phone recovery use `react-phone-number-input` and submit canonical E.164 values.
- Authentication uses backend-managed HttpOnly cookies. The app asks the backend for the current profile on load; a browser-side display cache is not treated as proof of authentication.
- State-changing API requests obtain and send the CSRF token through the shared Axios client.
- Password recovery authorization is passed in React Router navigation state from OTP verification to reset; it is not put in the URL or persistent browser storage.
- Registration, login, recovery, logout, protected routing, and change-password handling are implemented. Green success messages are distinct from red error messages.
- Verified checks on 2026-10-20: `npm test -- --reporter=dot --silent` passed 11 tests in 2 files; `npm run build` succeeded with a warning about a generated bundle larger than 500 kB; `npm run lint` exited 0 with a Fast Refresh warning in `src/context/AuthContext.jsx:97`.
- A browser walkthrough covered international phone registration, duplicate rejection, email and phone login, logout, protected-route redirect, change-password navigation and wrong-current-password rejection, and phone recovery through OTP verification. The browser reset form was not submitted in that walkthrough. Backend integration tests cover successful reset, recovery-token expiry/reuse, and session invalidation.
- Real MySQL persistence, production HTTPS deployment, real email/SMS delivery, and deployment-specific security settings remain unverified. This project is not being declared production-ready.

## Technologies

Versions recorded from the package manifest and lockfile: JavaScript ES modules, React 19.2, Vite 8.3, React Router 7, Axios 1.20, MUI 9.5, `react-phone-number-input` 3.4, `libphonenumber-js` 1.13, Vitest 5, React Testing Library 16, jsdom 30, and Oxlint 1.81. The verification environment used Node 24.15 and npm 11.12. Components use `.jsx`; the project does not use TypeScript or Tailwind.

## Architecture and request flow

```text
Browser entry: src/main.jsx
  └─ App.jsx: BrowserRouter + AuthProvider + route definitions
       ├─ public auth pages
       └─ ProtectedRoute → /home and /change-password
            ↓
       page handlers → src/api/authService.js
            ↓
       src/api/axios.js: credentials + CSRF token handling
            ↓
       Spring API: http://localhost:8080/api
            ↓
       HttpOnly session cookie; backend validates the session on every protected request
```

`AuthContext` hydrates the current user from `GET /api/me`. The backend cookie and server-side session are authoritative. Any `localStorage` user value is display-only and must never be used to authorize access. Axios is configured for credentialed requests and handles CSRF token acquisition/header attachment for mutations.

## Routes and user flows

| Route | Access | Purpose and API |
|---|---|---|
| `/` | Public entry | Redirects into the normal login/home flow. |
| `/register` | Public | Validates form fields and international phone; `POST /api/reg`; success returns to login with confirmation. |
| `/login` | Public | Email or international phone plus password; `POST /api/login`; success opens home or the originally requested protected route. |
| `/home` | Protected | Welcome page, current user display, and logout (`POST /api/logout`). |
| `/forgot-password` | Public | Email or phone recovery request (`POST /api/forgot-password`) with generic response. |
| `/verify-otp` | Recovery flow | OTP verification (`POST /api/verify-otp`); short-lived reset authorization moves in route state. |
| `/reset-password` | Recovery flow | New password and confirmation (`POST /api/reset-password`); success returns to login. |
| `/change-password` | Protected | Current/new/confirmation values (`PUT /api/change-password`); successful change clears local auth state according to backend session policy. |
| `*` | Public fallback | Not-found screen. |

The backend API contract and request DTO shapes are documented in the backend `PROJECT_CONTEXT.md` and OpenAPI UI. Keep frontend service calls aligned with those DTOs and paths.

## Source map

```text
src/
├── main.jsx                         React entry point and global styles
├── App.jsx                          BrowserRouter, AuthProvider, navbar and routes
├── api/
│   ├── axios.js                     API base URL, credentials, CSRF and error handling
│   ├── authService.js               Authentication/recovery endpoint wrappers
│   └── axios.test.js                Axios and CSRF behavior tests
├── context/AuthContext.jsx           Session hydration, login/register/logout and user state
├── components/
│   ├── ProtectedRoute.jsx            Protected page loading and redirect behavior
│   ├── Navbar.jsx                    Site navigation and signed-in actions
│   ├── AuthCard.jsx, FormInput.jsx    Reusable authentication layout and form field
│   ├── PasswordInput.jsx             Password field and visibility control
│   ├── PhoneNumberInput.jsx          International country and phone input
│   ├── PrimaryButton.jsx              Shared form action button
│   └── AlertBanner.jsx                Status, success and error feedback
├── pages/
│   ├── RegisterPage.jsx, LoginPage.jsx, HomePage.jsx
│   ├── ForgotPasswordPage.jsx, VerifyOtpPage.jsx, ResetPasswordPage.jsx
│   ├── ChangePasswordPage.jsx, NotFoundPage.jsx
│   └── authFlows.test.jsx             Page, route and auth-flow tests
├── theme/theme.js                    Shared MUI theme tokens
├── index.css, App.css                Light palette and layout styles
└── test/setup.js                     Vitest and Testing Library setup
vitest.config.js                      jsdom test environment configuration
```

Use `rg --files src` for the current complete file list; this map covers the main responsibilities rather than every individual asset and style.
## API integration notes

- Base URL: `VITE_API_BASE_URL`, conventionally `http://localhost:8080/api`.
- The frontend sends cookies with credentialed Axios calls. Do not add bearer tokens to `localStorage`.
- Backend CSRF endpoint is `GET /api/csrf`. Mutating calls use the token in the `X-XSRF-TOKEN` header.
- Registration phone values are E.164. Login/recovery accept the supported email-or-phone identifier contract; keep country metadata consistent with the phone component and backend libphonenumber normalization.
- Backend local recovery delivery prints the OTP to the backend console when the `local` profile is active. It does not display the OTP in the browser. No real email/SMS provider is configured.
- Error presentation uses backend response messages/field errors where safe. Keep account-existence responses generic on recovery screens.

## Local Windows setup and commands

Prerequisites: Node.js 24 or newer, npm, and the backend running at the configured URL. From PowerShell:

```powershell
Set-Location C:\E-Commerce\E-Commerce-Frontend
npm ci
$env:VITE_API_BASE_URL = 'http://localhost:8080/api'
npm run dev
```

Open `http://localhost:5173`. The backend must permit this exact CORS origin and credentials. `VITE_*` values are included in the browser bundle, so never put secrets in them.

Available project checks:

```powershell
npm test
npm run build
npm run lint
```

These are command examples, not a claim that they were rerun while editing this documentation.

## Configuration

- `VITE_API_BASE_URL`: API origin plus `/api`; defaults to the documented local API URL in the Axios setup.
- Backend-only settings such as MySQL credentials, JWT signing secret, cookie security, and CORS allowlist belong in backend environment configuration. Never duplicate secrets in this frontend repository.
- `.env.example` files are templates only. Do not commit real `.env` files or paste their contents into issue reports.

## Change guidance for future work

1. Read this guide, both repositories' `AGENTS.md` and context docs, and the relevant implementation before editing.
2. Check Git status, branch, and remotes in both repositories. Preserve existing changes.
3. Trace a feature from page → auth service → Axios client → backend controller/service → repository/migration as applicable.
4. Reuse the shared form, status, routing, and phone components. Keep JavaScript/JSX, the current light design, cookie/CSRF behavior, and the fixed API contract unless the user explicitly approves a change.
5. Do not trust frontend state for authorization or persist OTPs/recovery tokens. Keep recovery responses generic.
6. Add or change tests when requested by the current project instructions. The user has explicitly authorized automated tests for the authentication completion work.
7. Update this handover and the relevant README whenever implementation changes; describe verified and unverified behavior separately.
8. Implement only the next requested feature. Do not add shopping functionality unless requested.

## Related handover documents

- Backend implementation, APIs, database, security configuration, and test details: [backend PROJECT_CONTEXT.md](https://github.com/mopurudinesh/E-Commerce-Backend/blob/main/PROJECT_CONTEXT.md).
- Root project summary and cross-repository verification notes: workspace `C:\E-Commerce\PROJECT_CONTEXT.md` (local workspace file, not part of either GitHub repository).
- Frontend-specific setup and quick checks: this repository's `README.md`.
