# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please **do not** open a public issue. Instead, email the maintainers directly or use GitHub's private vulnerability reporting feature.

We will acknowledge receipt within 48 hours and aim to release a fix within 7 days.

## Scope

- The Next.js application and its API routes
- The Google Apps Script integration code provided in `GOOGLE_SHEETS_SETUP.md`

## Known Limitations

- The `/api/submit` endpoint performs basic validation but does **not** include rate limiting or CAPTCHA by default. Deployers are responsible for adding edge-level rate limiting (e.g., Vercel WAF, Cloudflare) for production use.
- The Google Apps Script endpoint is public. Use the optional `WRITE_KEY` mechanism documented in `GOOGLE_SHEETS_SETUP.md` to restrict writes.
