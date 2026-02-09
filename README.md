# Kendro - Voting Center Volunteer Registration

A modern, responsive web application for registering volunteers to protect voting centers during elections in Bangladesh. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## Features

- **Real-time Volunteer Counter** — Displays live count of registered volunteers
- **Bengali Language Interface** — Fully localized in Bengali (বাংলা)
- **Searchable Voting Centers** — 200+ voting centers with instant search
- **Time Slot Selection** — Volunteers can specify their availability windows
- **Google Sheets Integration** — Automatic data syncing to Google Sheets
- **Mobile-First Design** — Fully responsive with touch-optimized UI
- **Modern UI** — Clean, professional design with smooth animations

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (or npm)
- A Google account (for Google Sheets integration — optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/saeflobor/kendro-public.git
   cd kendro-public
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Copy the example file and fill in your values:
   ```bash
   cp .env.example .env.local
   ```

   See [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md) for how to obtain the Google Sheets URL.

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
kendro/
├── app/
│   ├── api/
│   │   ├── count/
│   │   │   └── route.ts        # Volunteer count API
│   │   └── submit/
│   │       └── route.ts        # Form submission API
│   ├── fonts/                   # Custom Bengali font
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                 # Main page
├── components/
│   └── ui/                      # Reusable UI components (shadcn/ui)
│       ├── button.tsx
│       ├── input.tsx
│       ├── select.tsx
│       ├── toast.tsx
│       └── toaster.tsx
├── hooks/
│   └── use-toast.ts
├── lib/
│   ├── centers.ts               # Voting center data
│   └── utils.ts
├── public/                      # Favicons & static assets
├── .env.example                 # Environment variable template
├── GOOGLE_SHEETS_SETUP.md
├── SECURITY.md
├── LICENSE                      # MIT
└── README.md
```

## Configuration

### Environment Variables

| Variable | Description | Required |
|---|---|---|
| `GOOGLE_SHEETS_URL` | Google Apps Script Web App URL | No (falls back to local file in dev) |
| `GOOGLE_SHEETS_WRITE_KEY` | Shared secret for write protection (must match Apps Script) | No |
| `NEXT_PUBLIC_VOTING_CENTER_URL` | External link for the "find your voting center" button | No |

### Customization

**Updating Voting Centers**

Edit `lib/centers.ts` to add or modify voting centers:

```typescript
export const VOTING_CENTERS = [
  "Center Name 1",
  "Center Name 2",
  // ...
];
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import at [vercel.com](https://vercel.com)
3. Add environment variables in the Vercel dashboard
4. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/saeflobor/kendro-public)

### Other Platforms

Standard Next.js — works on Netlify, AWS Amplify, Cloudflare Pages, Railway, or any Node.js host.

## Data & Privacy

- Form data (name, area, time slot) is sent to Google Sheets when configured.
- In development mode, submissions are also saved to a local `data/submissions.txt` file (git-ignored).
- **No analytics cookies are set.** Vercel Analytics (if enabled) uses privacy-friendly, cookieless tracking.
- Deployers are responsible for complying with local privacy laws and clearly informing users about data collection.

## Security

See [SECURITY.md](SECURITY.md). Key points:

- The submit endpoint validates input length and required fields on the server.
- An optional shared write key can restrict Google Sheets writes — see [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md).
- For production, add edge-level rate limiting (Vercel WAF, Cloudflare, etc.) and consider CAPTCHA.

## Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## Contributing

Contributions are welcome! For major changes, open an issue first to discuss.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes
4. Push and open a Pull Request

## License

[MIT](LICENSE)

## Important Notes

- This application is designed for civic engagement and voting center protection.
- Ensure compliance with local election laws and regulations.
- The Google Sheets endpoint is public by default — add write-key protection for production.

---

**Made with ❤️ for a better democracy**
