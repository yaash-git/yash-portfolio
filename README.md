# Yash Meena — Portfolio

A React and Vite portfolio with a small Express API for contact messages. The portfolio and API deploy separately.

## Run locally

Frontend, from this folder:

```sh
npm install
npm run dev
```

Backend, from `backend/`:

```sh
npm install
npm run dev
```

Copy `.env.example` to `.env` for the frontend and `backend/.env.example` to `backend/.env` for the API. Replace placeholders only in ignored `.env` files. Never commit them. The root `.env.example` points at the local API; production must set `VITE_API_URL` to the deployed API origin.

## Deployment checklist

Deploy only after creating the external accounts and configuring their environment settings. No service is deployed by this repository. This checkout currently has no Git metadata, so initialize or connect the portfolio to a Git repository before importing it into Vercel.

### 1. MongoDB Atlas

- Create a cluster and a dedicated database user with access only to the portfolio database.
- Set the cluster network access list to the backend host's outbound IPs where supported. Avoid broad public access when possible.
- Copy the Atlas connection string into the backend host's `MONGODB_URI`, replacing its database/user placeholders there. Keep it out of source control and frontend settings.

### 2. Resend

- Verify a sender/domain in Resend.
- Set the API key as backend `RESEND_API_KEY`, the verified sender as `RESEND_FROM_EMAIL`, and the message recipient as `CONTACT_EMAIL`.
- These are backend-only values. A contact submission is stored in MongoDB before the API confirms receipt; a Resend delivery problem is logged without exposing provider details and does not discard the saved message.

### 3. Backend — Render or Railway

- Deploy the `backend/` directory as a Node service. Start command: `npm start` (`node server.js`). Install command: `npm install`.
- Set these service environment variables:
  - `PORT` — the port supplied by the host (the app validates it and listens on it).
  - `MONGODB_URI` — Atlas connection string.
  - `CLIENT_URL` — exact deployed frontend origin, including `https://`, with no path.
  - `RESEND_API_KEY` — Resend secret key.
  - `RESEND_FROM_EMAIL` — verified Resend sender.
  - `CONTACT_EMAIL` — inbox receiving contact notifications.
  - `ADMIN_MESSAGES_TOKEN` — at least 32 random bytes; use a securely generated value and store it only in this backend service's environment settings.
- Keep the host's generated HTTPS API origin for the next step. Check `/api/health` and `/api/db-status` after startup. The latter should report connected.

### 4. Frontend — Vercel

- Import the repository and set the project root to the portfolio root (the folder containing this README and `package.json`). Build command: `npm run build`; output directory: `dist`.
- Set `VITE_API_URL` to the deployed backend origin (for example, `https://your-api-host.example`, with no `/api` suffix). Vite embeds this public URL into the frontend at build time; it must never contain credentials or tokens.
- Redeploy after setting or changing `VITE_API_URL`.
- `vercel.json` rewrites requests to the client-side app entry so a direct visit or refresh at `/photo-particles` works.

## Private owner messages

`GET https://<backend-origin>/api/admin/messages` returns at most the 100 newest messages. Send `Authorization: Bearer <ADMIN_MESSAGES_TOKEN>` over HTTPS from a private API client. The token is not used by the browser app, must not be put in a URL or frontend variable, and should not be saved in a shared collection. The endpoint returns no messages without valid authentication; access attempts are limited to 5 per IP per 15 minutes. Rotate the token in the backend environment if it is exposed.

## Checks and operational notes

- `npm run build` creates the frontend production bundle; `npm run lint` runs Oxlint.
- Backend startup requires the listed environment variables and a successful MongoDB connection. The API uses Helmet, exact-origin CORS, JSON bodies limited to 10 KB, contact rate limiting (10 per IP per 15 minutes), and generic error responses.
- Test contact submission end to end only after Atlas, Resend, and both deployed origins are configured. Check CORS from the deployed frontend and verify the saved message via the protected endpoint.
- The portfolio has no server-side React router; the Vercel rewrite handles its one pathname-based experiment view. Static assets remain served from `public/`.

