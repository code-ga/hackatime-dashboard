# Hackatime Dashboard

> **Cyberpunk-styled dashboard for Hackatime user statistics and coding activity visualization**

A modern, cyberpunk-themed dashboard application that displays Hackatime user statistics, coding activity, project breakdowns, and live session data. Built with Next.js 16, Tailwind CSS v4, and shadcn/ui components.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [API Integration](#api-integration)
- [Cyberpunk Theme](#cyberpunk-theme)
- [Special Features](#special-features)
- [Contributing](#contributing)
- [Learn More](#learn-more)

## Features

### 👤 Public User Profiles (`/user/[username]`)

View any Hackatime user's public profile by navigating to `/user/{username}`:

- **User Profile Card**: Avatar, username, trust factor badge, and quick stats
- **Project List**: Projects with languages, coding time, and heartbeat counts
- **Activity Timeline**: 
  - Full-year heatmap (365 days) with animated snake traversal
  - Heartbeat session list with duration details
  - Replay animation functionality

### 🔐 Authenticated Dashboard (`/dashboard`)

Personal dashboard requiring OAuth authentication:

1. **Hero Section** - Animated avatar with trust-level glow, username with neon effect, quick stats (total time, streak, user ID), and trust factor badge
2. **Hours Card** - Large neon green display showing today's coding hours with visual progress bar
3. **Streak Card** - Animated fire/flame effect for active streaks with pulsing day indicators
4. **Live Activity Card** - Real-time heartbeat data showing OS, machine, editor, language, and category
5. **Projects Grid** - 2-column card layout displaying top 6 projects with progress bars and language badges
6. **Filter System** - Date range picker, project dropdown, category filter for analytics
7. **Analytics Charts** - Donut charts for languages, editors, and OS distribution

### 🎮 Virtual Pet Picture-in-Picture

An interactive game feature:

- Opens a borderless PiP window (300×200) with the pet animation
- Pet stays at a fixed screen position; PiP window acts as a scanner
- **Gameplay**: Align the PiP window so the pet appears inside the centered red target reticle
- Scoring system: +1 point each time pet enters both the PiP view AND target zone simultaneously
- After scoring: pet teleports with burst effect, target remains centered, 1-second delay before next round
- Score persists across sessions; reset manually
- Uses Canvas 2D API with particle effects, scanlines, and teleport animations

### 🎨 Cyberpunk Visual Design

- Dark terminal-style background with glowing neon accents (cyan, magenta, green)
- Monospace fonts (JetBrains Mono)
- Circuit/grid decorative patterns
- Smooth animations using `tw-animate-css`
- Glowing borders and text effects
- Staggered fade-in animations for list items

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.2.4 | React framework with App Router |
| **React** | 19.2.4 | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | v4 | Utility-first styling |
| **shadcn/ui** | latest | Accessible component primitives (Radix UI) |
| **Phosphor Icons** | 2.1.10 | Icon set |
| **tw-animate-css** | 1.4.0 | Animation utilities |
| **Biome** | 2.4.12 | Linting & formatting |
| **Bun** | ^1.0.0 | Package manager & runtime |

## Project Structure

```
hackatime-dashboard/
├── app/
│   ├── dashboard/page.tsx           # Authenticated dashboard (cyberpunk UI)
│   ├── user/[username]/page.tsx     # Public user profile page
│   ├── globals.css                  # Tailwind theme + cyberpunk animations
│   └── layout.tsx                   # Root layout
├── components/
│   ├── PetPiP.tsx                   # Picture-in-Picture pet game
│   ├── PetSvg.tsx                   # SVG pet graphic (legacy/alternative)
│   ├── PetCanvas.tsx                # Canvas rendering component
│   ├── dashboard/                   # Dashboard components
│   │   ├── filter-bar.tsx           # Date/project/category filters
│   │   ├── language-chart.tsx       # Language distribution donut chart
│   │   ├── editor-chart.tsx         # Editor distribution donut chart
│   │   └── os-chart.tsx             # OS display from latest heartbeat
│   ├── user/                        # User profile components
│   │   ├── user-profile-card.tsx    # Avatar, trust badge, quick stats
│   │   ├── project-list.tsx         # Project list with languages & time
│   │   ├── activity-timeline.tsx    # Heatmap + snake animation
│   │   └── user-search.tsx          # User search form
│   └── ui/                          # shadcn/ui components
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── input.tsx
│       ├── progress.tsx
│       ├── skeleton.tsx
│       └── tabs.tsx
├── lib/
│   ├── hackatime.ts                 # API wrapper for Hackatime endpoints
│   ├── pet-world.ts                 # Shared state for pet position & scoring
│   └── pet-animation.ts             # Pet animation loop & teleport logic
├── types/
│   └── hackatime.ts                 # TypeScript interfaces for API responses
├── .env.local                       # Environment variables (create from .env.example)
├── .env.example                     # Example environment file
├── package.json                     # Dependencies & scripts
├── tailwind.config.ts               # Tailwind configuration
├── tsconfig.json                    # TypeScript configuration
└── PROJECT_DESCRIPTION.md           # Detailed project documentation
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js ≥18
- Hackatime OAuth credentials (for authenticated features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/hackatime-dashboard.git
   cd hackatime-dashboard
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or: npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your Hackatime API credentials:
   ```
   HACKATIME_CLIENT_ID=your_client_id
   HACKATIME_CLIENT_SECRET=your_client_secret
   HACKATIME_REDIRECT_URI=http://localhost:3000/api/auth/callback
   ```

4. **Run the development server**
   ```bash
   bun dev
   # or: npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server at http://localhost:3000 |
| `bun build` | Build the production bundle |
| `bun start` | Start the production server |
| `bun lint` | Run ESLint for code quality |
| `bun lint:fix` | Auto-fix linting issues |

## API Integration

The project wraps the [Hackatime API](https://hackatime.com/api) in `lib/hackatime.ts`. Key endpoints:

### Public Endpoints (no auth)

- `getAnyUserStats(username)` → User stats (total time, languages, streak, trust factor)
- `getAnyUserProjectsDetails(username)` → Project details with languages & heartbeat counts
- `getAnyUserHeartbeatsSpans(username)` → Activity timeline spans for heatmap

### Authenticated Endpoints (requires OAuth)

- `getMe()` → Current user profile
- `getHours(start_date, end_date)` → Coding hours breakdown
- `getStreak()` → Streak data
- `getProjects()` → User's projects with metadata
- `getLatestHeartbeat()` → Current session data (all 10 fields)
- `getStats(filters)` → Filterable stats for charts (languages, editors, projects)

All API types are defined in `types/hackatime.ts`.

## Cyberpunk Theme

The cyberpunk aesthetic is implemented through:

### Color Palette

Neon colors defined as CSS custom properties in `app/globals.css` (`.dark` class):
- `--cyan`: `#00ffff` → Neon cyan glow
- `--magenta`: `#ff00ff` → Neon magenta glow
- `--green`: `#00ff00` → Neon green glow

### Utility Classes

- `.neon-cyan`, `.neon-magenta`, `.neon-green` → Box shadow glow effects
- `.glow-cyan`, `.glow-magenta`, `.glow-green` → Text shadow glow effects
- `.cyberpunk-grid` → Circuit-like grid background pattern

### Animations

Custom keyframes in `app/globals.css`:
- `neon-pulse` → Loading skeleton pulse
- `fire-flicker` → Streak fire animation
- `glitch` → Error state effect
- `scanline` → CRT scanline overlay
- `snake-head` → Heatmap snake traversal
- `cell-eaten` → Glowing cell effect
- `cell-pulse` → Pulse animation

## Special Features

### 🐍 Snake Animation (Activity Timeline)

The heatmap displays a full year (365 days) with an animated snake that "eats" cells representing active coding days:
- Auto-starts 500ms after component mount
- Uses staggered delays (`calc(var(--cell-index) * 100ms)`) for smooth traversal
- Replay button to restart animation
- Glowing "eaten" cells with box-shadow effects

### 📊 Filter System & Analytics

Filter bar on dashboard allows:
- **Date range selection**: Start and end date pickers
- **Project filter**: Dropdown populated from user's projects
- **Category filter**: AI+Coding, Coding, Writing+Docs, Writing+Tests
- **Reset**: Clear all filters instantly

Charts visualize:
- Top 8 programming languages (donut chart)
- Top 6 editors (donut chart)
- Current OS from latest heartbeat

### 🎯 Pet Game Mechanics

**Objective**: Score points by aligning the PiP scanner over the hidden pet.

**How it works**:
1. Click "Open Pet" to launch the PiP window
2. The pet is fixed at a screen coordinate (adjustable via controls)
3. A red target reticle is centered in the PiP window
4. Move the PiP window so the pet appears inside the red circle
5. When visible AND inside target → +1 point! (pet teleports after 1s)
6. Target stays centered; pet appears at a new random location
7. Continue until you close the PiP

**State Sharing**: The main document and PiP window share a singleton `PetWorldState` object via `lib/pet-world.ts` (no BroadcastChannel needed due to same-origin policy).

## Contributing

We welcome contributions! Please follow these guidelines:

### Code Style

- **Formatter**: Biome (run `bun lint:fix` to auto-format)
- **TypeScript**: Strict mode enabled; avoid `any` types
- **Imports**: Group order: external → internal → relative; alphabetize within groups
- **Components**: Use PascalCase for filenames and component names
- **Hooks**: Use `use` prefix (e.g., `usePetAnimation`)
- **Styling**: Use Tailwind utility classes; prefer CSS custom properties for theme colors

### Git Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make changes following code conventions
4. Test locally: `bun dev` and verify functionality
5. Commit with clear messages: `git commit -m "feat: add language chart"`
6. Push and open a Pull Request

### Adding New Components

1. Place components in appropriate directory (`components/dashboard/`, `components/user/`, or `components/ui/`)
2. Define props interface with TypeScript
3. Use shadcn/ui primitives when possible (Button, Card, Badge, etc.)
4. Add animation classes from `tw-animate-css` if needed
5. Update this README if feature is user-facing

### API Changes

1. Update types in `types/hackatime.ts`
2. Add wrapper methods in `lib/hackatime.ts`
3. Document new endpoints in `PROJECT_DESCRIPTION.md`

## Learn More

- [Next.js 16 Documentation](https://nextjs.org/docs) — App Router, Server Components, React 19 features
- [Tailwind CSS v4](https://tailwindcss.com/docs) — Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com) — Accessible component library built on Radix UI
- [Hackatime API Docs](https://hackatime.com/api) — Public API documentation
- [tw-animate-css](https://github.com/your-repo/tw-animate-css) — Tailwind animation plugin

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com/new)
3. Configure environment variables
4. Deploy

### Other Platforms

```bash
bun build
bun start
```

The app runs on `http://localhost:3000` by default.

## License

MIT License — see LICENSE file for details.

---

**Built with 💜 using Bun, Next.js, and lots of neon glow effects.**
