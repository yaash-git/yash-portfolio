# Portfolio API

This folder contains the small Node.js and Express backend for the portfolio.

## Start the development server

From this folder, run:

```sh
npm install
npm run dev
```

The server reads its settings from `.env`. Add a real MongoDB connection string, Resend key, and verified sender before starting the server. The example file contains placeholders only.

Required backend environment variables are `PORT`, `MONGODB_URI`, `CLIENT_URL`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `CONTACT_EMAIL`. `ADMIN_MESSAGES_TOKEN` is optional for starting the contact API, but it must be configured with at least 32 random bytes to enable the private owner-message endpoint.

## How it fits together

- **Node.js** runs JavaScript outside the browser, so the portfolio can have a server.
- **Express** handles incoming HTTP requests and sends responses.
- An **API endpoint** is a URL on the server that performs a small task and returns data.
- `GET /api/health` is a simple check that confirms the API is running.
- `.env` stores local settings such as the server port. Keep it out of source control; `.env.example` shows the expected setting without private values.
- **CORS** lets the Vite page at `http://localhost:5173` make requests to the API on port 5000. Browsers restrict cross-origin requests unless the server allows the frontend origin.

## MongoDB and contact messages

- **MongoDB** stores submitted contact messages.
- **Mongoose** connects the Node server to MongoDB and provides a JavaScript interface for describing data.
- A **schema** describes the fields and basic rules for one kind of document. `ContactMessage` has a name, email, message, and creation date.
- The `ContactMessage` model validates and stores each accepted submission.
- `MONGODB_URI` tells Mongoose where to connect. It stays in the ignored `.env` file so the connection string is not placed in JavaScript or returned by an API.
- `GET /api/db-status` reads Mongoose's connection state and reports whether the database is connected. It does not create test data.

The server connects to MongoDB before it starts listening for requests. If the URI is missing or the connection fails, startup stops with a clear message. The `routes/` and `controllers/` folders keep URL definitions and response logic separate.

## Contact endpoint

`POST /api/contact` accepts a JSON body with `name`, `email`, and `message`. The server trims the text, validates the fields and their maximum lengths, then stores valid messages with the `ContactMessage` model.

- **201** — the message was saved and a simple confirmation is returned.
- **400** — one or more fields are missing or invalid.
- **500** — the message could not be saved; database details are not sent to the caller.

The frontend sends to `VITE_API_URL` (defaulting to `http://localhost:5000`). The backend's allowed browser origin comes from `CLIENT_URL`.

## Email notifications

After a contact message is saved, the backend uses Resend to send a notification to `CONTACT_EMAIL`. Email sending belongs on the backend so `RESEND_API_KEY` is never included in React code or sent to visitors. Set `RESEND_API_KEY`, `CONTACT_EMAIL`, and `RESEND_FROM_EMAIL` in the ignored `.env` file; `RESEND_FROM_EMAIL` must be an address from a sender/domain verified with Resend.

The email includes a plain-text body and escaped HTML, and sets the visitor's address as `replyTo`. If MongoDB saves the message but email delivery fails, the saved message remains and the API still confirms receipt. The server logs a safe notification status without exposing provider details.

## Security

- **Helmet** adds common HTTP security headers.
- **Rate limiting** allows at most 10 contact submissions per IP and 5 owner-message access attempts per IP every 15 minutes. Health and status checks are not rate limited.
- **CORS** allows only the origin configured in `CLIENT_URL`; use your deployed frontend URL there after deployment.
- JSON request bodies are limited to 10 KB, and oversized or malformed JSON gets a small JSON error response.
- `config/env.js` checks required settings at startup and reports missing variable names without printing values.
- Unexpected production errors return a generic message. Database and email failures are logged without message content, connection strings, or provider details.
- Keep MongoDB, Resend, and `ADMIN_MESSAGES_TOKEN` values in the backend `.env`. Frontend variables prefixed with `VITE_` are bundled for browsers, so secrets must never use that prefix.

## Owner-only message viewing

`GET /api/admin/messages` returns up to the 100 most recent messages. It requires an `Authorization: Bearer <token>` header. There is no public endpoint that returns messages, and the visitor-facing React app never receives or stores the token.

Configure `ADMIN_MESSAGES_TOKEN` only in the backend `.env` or backend hosting environment. Generate at least 32 random bytes (for example, with Node.js `crypto.randomBytes(32).toString('hex')`; the example uses 64 hexadecimal characters). The endpoint returns `503` when the token is missing or too short and `401` when the supplied token is invalid. Token comparisons use a constant-time hash comparison, responses disable caching, and requests are rate-limited to 5 attempts per IP every 15 minutes.

To access messages, use a private API client such as Postman and send a GET request to `<API_BASE_URL>/api/admin/messages` with the bearer token set in the Authorization header. Use HTTPS in production. Never put the token in frontend code, a URL, a query string, a checked-in file, or a shared screenshot. Rotate it by replacing the backend environment value if it is exposed.

## Deployment preparation

- **Frontend:** deploy the Vite project root to Vercel with `npm run build` and `dist` as the output directory. Set `VITE_API_URL` to the actual deployed backend URL after the backend is online.
- **Backend:** deploy this `backend/` folder to Render or Railway and use `npm start`. Configure `PORT`, `MONGODB_URI`, `CLIENT_URL`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `CONTACT_EMAIL` in the provider's environment settings. Configure a strong `ADMIN_MESSAGES_TOKEN` to enable private message viewing.
- **Database:** create a MongoDB Atlas cluster and a dedicated application database user, then add its real connection string to the backend provider as `MONGODB_URI`. Restrict Atlas network access to the provider's required egress addresses where possible.
- **Email:** configure Resend with a verified sender and keep its API key in the backend provider environment only.

Deployment is not complete until the actual frontend and backend URLs are configured and the health, database, CORS, and contact flows have been tested against those services.
