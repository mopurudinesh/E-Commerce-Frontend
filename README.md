# E-Commerce authentication frontend

React 19, Vite 8 and React Router frontend for the E-Commerce authentication API. The interface is light mode only. Shopping features are outside this authentication milestone.

## Local setup (Windows)

Install Node.js 24+ and npm. From PowerShell:

```powershell
Set-Location C:\E-Commerce\E-Commerce-Frontend
npm ci
$env:VITE_API_BASE_URL = 'http://localhost:8080/api'
npm run dev
```

Open `http://localhost:5173`. The backend must be running at the configured API base URL, with CORS allowing that exact origin and credentials. Do not place secrets in `VITE_*` values; Vite exposes them to the browser.

## Routes

| Route | Access | Purpose |
|---|---|---|
| `/register` | Public | Account creation with international phone input |
| `/login` | Public | Email or phone login |
| `/home` | Protected | Authenticated welcome page |
| `/forgot-password` | Public | Start email or phone recovery |
| `/verify-otp` | Public | Verify the recovery code |
| `/reset-password` | Recovery flow | Set a new password |
| `/change-password` | Protected | Change password from an authenticated session |

The browser authenticates with the backend HttpOnly cookie. Axios includes credentials and fetches `/csrf` before state-changing requests, then sends `X-XSRF-TOKEN`. The phone input uses `react-phone-number-input`; valid phone values are submitted in E.164 format.

In local development, the backend's `local` profile prints recovery OTPs to its console. The frontend intentionally does not display the OTP; production delivery requires an email/SMS provider.

## Checks

```powershell
npm test
npm run build
npm run lint
```

Verified on 2026-10-20: 11 tests passed in 2 files; production build succeeded with a chunk-size warning; lint exited 0 with one Fast Refresh warning in `src/context/AuthContext.jsx:97`.

See the workspace `C:\E-Commerce\PROJECT_CONTEXT.md` and backend `README.md` for verified integration status, API collection and handover documents.
