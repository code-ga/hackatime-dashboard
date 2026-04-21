# Hackatime Dashboard

## Project Overview

A dashboard application for displaying Hackatime user statistics and activity data with a cyberpunk/terminal visual style.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4 with CSS variables, tw-animate-css for animations
- **Components**: shadcn/ui (Radix UI based) with Phosphor Icons
- **Package Manager**: bun.js

## Features

### User Profile Page (`/user/[username]`)

Access any Hackatime user's public profile by visiting `/user/{username}`.

#### Components
- `app/user/[username]/page.tsx` - Main dynamic route page that fetches user data and displays the profile
- `components/user/user-profile-card.tsx` - Displays avatar, username, trust factor badge, and quick stats
- `components/user/project-list.tsx` - Lists user's projects with languages, coding time, and heartbeat counts
- `components/user/activity-timeline.tsx` - Visualizes heartbeat spans as a heatmap and session list
- `components/user/user-search.tsx` - Search form for finding users

#### API Functions Used
- `hackatimeApi.stats.getAnyUserStats()` - Get user stats (total time, languages, streak, trust factor)
- `hackatimeApi.users.getAnyUserProjectsDetails()` - Get detailed project information
- `hackatimeApi.users.getAnyUserHeartbeatsSpans()` - Get activity timeline data

#### Design Style
- Cyberpunk/Terminal theme with dark background
- Neon accent colors (cyan #00ffff, magenta #ff00ff, green #00ff00)
- Glowing effects on cards and text
- Monospace fonts (JetBrains Mono)
- Grid/circuit-like decorative background pattern

#### Animations
- Uses tw-animate-css classes (`animate-fade-in`, `animate-slide-in-from-bottom`, etc.)
- Staggered animations with delays for list items
- Smooth transitions between states

## File Structure

```
app/
├── user/[username]/page.tsx     # User profile page
└── globals.css                  # Tailwind theme with cyberpunk colors

components/
├── user/                        # User profile components
│   ├── user-profile-card.tsx
│   ├── project-list.tsx
│   ├── activity-timeline.tsx
│   └── user-search.tsx
└── ui/                          # shadcn components
    ├── input.tsx
    ├── skeleton.tsx
    ├── badge.tsx
    ├── progress.tsx
    ├── tabs.tsx
    └── avatar.tsx

lib/
└── hackatime.ts                 # API wrapper for Hackatime API

types/
└── hackatime.ts                 # TypeScript interfaces for API responses
```

## Cyberpunk Theme Colors

Added in `app/globals.css` under the `.dark` class:
- `--cyan`: Neon cyan (#00ffff equivalent in oklch)
- `--magenta`: Neon magenta (#ff00ff equivalent in oklch)
- `--green`: Neon green (#00ff00 equivalent in oklch)

## Utility Classes

Added in `app/globals.css`:
- `.neon-cyan`, `.neon-magenta`, `.neon-green` - Box shadow glow effects
- `.glow-cyan`, `.glow-magenta`, `.glow-green` - Text shadow glow effects
- `.cyberpunk-grid` - Grid pattern background

## Notes

- API endpoints use `{username}` path parameter (not "me") for viewing public profiles
- Loading states show skeleton animations while fetching data
- Error states display friendly error messages
- Type definition for `GetAnyUserHeartbeatsSpansResponse.spans` was updated from tuple to array type

## Activity Timeline Snake Animation

### Changes Made to `activity-timeline.tsx`

1. **Expanded Heatmap to Full Year**: Changed from showing last 30 days to full 365 days by generating all dates in the past year and filling missing dates with 0 duration.

2. **Added Snake Animation**:
   - CSS keyframes (`snake-head`, `cell-eaten`, `cell-pulse`) added in `globals.css`
   - Animation uses staggered delays with `calc(var(--cell-index) * 100ms)` per cell
   - Auto-starts on component mount after 500ms delay
   - Play/Replay button added to restart animation

3. **Implementation Details**:
   - Uses `useState` for `isAnimating` and `animationProgress`
   - Uses `useEffect` with `requestAnimationFrame` for smooth animation
   - Uses `useMemo` for computed values (heatmap, yearDates, maxDuration, etc.)
   - Each cell has `--cell-index` CSS custom property for staggered animation delay
   - Cells glow with box-shadow when the snake passes ("eaten" effect)
   - Current snake head cell gets `snake-head` class with scale animation

4. **Performance Considerations**:
   - 365 cells × 100ms = ~36.5 seconds total animation duration
   - Uses `will-change` via CSS animations
   - Uses `requestAnimationFrame` for smooth 60fps updates