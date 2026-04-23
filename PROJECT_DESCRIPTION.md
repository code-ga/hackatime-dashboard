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

## Authenticated Dashboard (`/dashboard`)

Access your personal Hackatime data by visiting `/dashboard` (requires authentication via OAuth).

### Components
- `app/dashboard/page.tsx` - Main dashboard page with full cyberpunk redesign
- Uses `hackatimeApi.authenticated.*` methods from `lib/hackatime.ts`

### API Functions Used
- `hackatimeApi.authenticated.getMe()` - Get current user profile (username, email, trust level/value, id)
- `hackatimeApi.authenticated.getHours()` - Get coding hours (total_seconds, start_date, end_date)
- `hackatimeApi.authenticated.getStreak()` - Get streak data (streak_days)
- `hackatimeApi.authenticated.getProjects()` - Get user's projects (name, total_seconds, percent, languages, archived, most_recent_heartbeat)
- `hackatimeApi.authenticated.getLatestHeartbeat()` - Get current activity (ALL fields: id, created_at, time, category, project, language, editor, operating_system, machine, entity)

### UI Sections (Cyberpunk Redesign)

1. **Hero Section** (`HeroSection`)
   - Animated avatar with trust-level glow effect (green/cyan/magenta based on trust level)
   - Username with neon text effect
   - Quick stats: total time, streak days, user ID
   - Trust factor badge

2. **Hours Card** (`HoursCard`)
   - Large neon green display showing hours and minutes
   - Visual progress bar showing daily progress
   - Date range display

3. **Streak Card** (`StreakCard`)
   - Fire/flame animation for active streaks (SVG with `animate-fire-flicker`)
   - Pulsing dot indicators for streak days
   - Animated glow effect

4. **Live Activity Card** (`LiveActivityCard`)
   - Full heartbeat data display (OS, machine, entity, category)
   - All 10 fields from API now displayed
   - Language badges with color coding

5. **Projects Grid** (`ProjectsGrid`)
   - 2-column card layout showing top 6 projects
   - Progress bars for each project
   - Language badges from the `languages` array field
   - Archived indicator

6. **System Info Panel** - Integrated into Live Activity Card

### Cyberpunk Loading State (`LoadingState`)
- Uses `cyberpunk-skeleton` class with neon pulse animation
- Grid background pattern
- Staggered skeleton loaders for different sections

### Cyberpunk Error State (`ErrorState`)
- Red border card with glitch animation effect
- Terminal-style error message

### Animations Added (`globals.css`)
- `neon-pulse` - Loading skeleton pulse
- `fire-flicker` - Streak fire animation
- `glitch` - Error state glitch effect
- `scanline` - Scanline overlay effect
- `cyberpunk-skeleton` - Loading skeleton utility
- `scanline-overlay` - Scanline overlay utility

## File Structure

```
app/
├── dashboard/page.tsx           # Authenticated user dashboard
├── user/[username]/page.tsx   # Public user profile page
└── globals.css                # Tailwind theme with cyberpunk colors

components/
├── PetPiP.tsx                 # Pet picture-in-picture window component
├── PetSvg.tsx                 # Animated pet SVG graphic
├── dashboard/                  # Dashboard components (new)
│   ├── filter-bar.tsx
│   ├── language-chart.tsx
│   ├── editor-chart.tsx
│   └── os-chart.tsx
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

## Filter System & Analytics Charts

### Components Added

1. **Filter Bar** (`components/dashboard/filter-bar.tsx`)
   - Date range picker (start_date, end_date)
   - Project dropdown (dynamic from user's projects)
   - Category dropdown (ai+coding, coding, writing+docs, writing+tests)
   - Reset button to clear all filters
   - Filter state managed in parent page and passed to API calls

2. **Language Chart** (`components/dashboard/language-chart.tsx`)
   - Donut/pie chart showing top 8 languages
   - SVG-based rendering with color coding
   - Displays percentage and language name
   - Uses `stats.data.languages[]` from API

3. **Editor Chart** (`components/dashboard/editor-chart.tsx`)
   - Donut/pie chart showing top 6 editors
   - Uses `features=editors` query param in API
   - Displays percentage and editor name

4. **OS Chart** (`components/dashboard/os-chart.tsx`)
   - Shows current OS from latest heartbeat
   - Note: Historical OS data not available in API
   - Limited functionality per API constraints

### API Updates

Added to `lib/hackatime.ts`:
- `hackatimeApi.authenticated.getStats()` - New endpoint with filter support
- `features` query param for languages, editors, projects data

Added to `types/hackatime.ts`:
- `GetAuthenticatedStatsInput` - Filter query parameters
- `GetAuthenticatedStatsResponse` - Stats response type

## Pet Picture-in-Picture Feature

### Component: `components/PetPiP.tsx`

Renders an animated pet in a Picture-in-Picture window using direct Canvas 2D drawing.

#### How It Works

1. **Opening PiP**: Clicking "Open Pet" calls `handleOpenPet`, using `documentPictureInPicture.requestWindow()` to create a 300x200 borderless window.
2. **Style Isolation**: Copies all CSS stylesheets from the main document into the PiP window to preserve Tailwind classes.
3. **Canvas Rendering**: Creates a `<canvas>` element and uses `renderCanvas()` to draw the pet frame-by-frame with the Canvas 2D API.
4. **Movement Tracking**: `trackMovement` runs every animation frame, reading the PiP window's `screenX/Y` and updating `petWorldState.pipWindow` via `updatePipPosition`.
5. **Fixed Pet Position**: Pet's screen coordinates are stored in `petWorldState.fixedPositionOnScreen` and remain constant; moving PiP window reveals different parts of the pet.
6. **Scoring**: The render loop detects when the pet transitions from outside to inside the canvas and calls `incrementScore(1)`.
7. **Cleanup**: The `pagehide` event cancels the animation frame and closes the PiP.

#### Stale Closure Fix (Render Hell Resolution)

**Problem**: The original `trackMovement` captured stale state causing infinite re-renders. See earlier section for details.

#### API Used

- `window.documentPictureInPicture.requestWindow(options)`
- PiP Window: `screenX`, `screenY`, `closed`, `document`, `addEventListener`

### Pet Visual Design & Effects

The pet is drawn directly on a 2D canvas using Canvas API with multiple layers:

**Body**
- Radial gradient (pale pink `#FFDDFF` → hot pink `#FF69B4`)
- Breathing animation: subtle 3% scale pulsing via sine wave
- Outer glow aura with pulsing shadow blur

**Facial Features**
- Eyes: white ellipses with glow, dark pupils, and sparkling reflections
- Nose: dark pink ellipse
- Mouth: curved quadratic stroke
- Blush: semi-transparent pink (70% opacity) on cheeks

**Accessories**
- Ears: triangular with linear gradient, inner ear details
- Tail: curved quadratic stroke with wave animation
- Paws: small ellipses at bottom

**Particle Effects**
- Sparkles: 4 rotating star particles with cross pattern (every 15 frames)
- Hearts: 3 floating hearts drifting upward (every 30 frames)
- Background: moving scanline, 20px cyan grid, floating particles
- Teleport Burst: expanding pink concentric rings + radial sparkles when pet teleports (15 frames)

**Direction Indicator**
- Cyan arrow with glow that points to pet when off-screen
- Orbiting ring around arrow base

## Screen Portal Effect (Virtual Pet)

### Architecture: SharedState Pattern

The virtual pet exists in global screen coordinates and is visible through a Picture-in-Picture window acting as a viewing portal. Since the PiP window is same-origin with the opener, JavaScript objects can be shared directly (no SharedWorker/BroadcastChannel needed). The main document's animation loop drives all state; the PiP window's canvas simply reads from shared state and renders.

### Components

1. **`lib/pet-world.ts`** - Shared state singleton
   - `PetWorldState` interface containing:
     - `pet`: position (x,y) and velocity
     - `pipWindow`: position and size
     - `pipVelocity`: window movement velocity
     - `screen`: screen dimensions
     - `fixedPositionOnScreen`: where the pet stays fixed on screen
     - `score`: current gameplay score
     - `lastPetVisible`: visibility state for scoring
    - Exports for reading/updating state including `incrementScore`, `resetScore`, `setLastPetVisible`, `teleportPet`
    - Singleton `petWorldState` object shared between main document and PiP window

2. **`lib/pet-animation.ts`** - Animation loop module
   - **Pet Position**: Maintains pet at `fixedPositionOnScreen` (no wandering)
   - **PiP Tracking**: Updates `petWorldState.pipWindow` as the window moves via `updatePipPosition`
   - **Scoring Integration**: Visibility detection and score increment handled in `renderCanvas`
   - **Teleport**: When scored, `teleportPet()` is called to move pet to random location
   - **Startup**: `startAnimation()` accepts optional custom fixed X/Y coordinates

3. **`components/PetCanvas.tsx`** - Canvas rendering component (for React integration)
   - Renders pet SVG at calculated local position
   - Draws direction arrow when pet is outside
   - Reads from shared `petWorldState`

4. **`components/PetPiP.tsx`** - Updated to use Canvas rendering with gameplay
   - Creates PiP window and starts animation loop
   - Renders canvas directly in PiP window with full visual effects
   - Scoring detection when pet enters view
   - Teleportation triggers: pet moves to random location + burst effect
   - UI controls for position, score reset, and Hackatime hours display

### Pet Behavior

The pet remains at a **fixed screen position** (default: screen center). The position is configurable via the X/Y controls in the PetPiP UI. The pet does not move on its own — it's completely stationary, creating an X-ray scanner effect where the PiP window moves over the pet.

#### Teleportation

When the pet is **caught** (enters the PiP view), it **teleports instantly** to a random location on screen. This adds challenge: you must quickly move the PiP window to the new location to catch it again. A visual **teleport burst effect** (expanding pink rings and sparkles) appears at the teleport destination.

#### Scoring

The PiP window acts as a scanner. You earn **+1 point** each time the pet **enters** the PiP view after being outside. The score is tracked globally and displayed in the control panel. A "+1!" popup provides visual feedback. Use the "Reset Score" button to zero the counter.

### Gameplay: Pet Scanner Score Challenge

The PiP window acts as a scanner. You earn points each time the pet **enters** the PiP window's view. The goal is to move the PiP window to catch the pet.

#### Scoring Mechanics

- **+1 point** each time the pet becomes visible inside the PiP canvas after being outside
- Score is tracked in global state (`petWorldState.score`)
- Visual feedback: "+1!" popup appears when scoring
- Score persists across PiP sessions (until manually reset)

#### Teleportation Mechanic

- When caught, the pet **waits 1 second** then **teleports** to a random location
- **Teleport burst effect**: expanding pink concentric rings + radial sparkles at destination
- The delay gives you a moment to celebrate your catch before the pet escapes
- Increases challenge — you must quickly chase the pet to its new location
- Pet cannot teleport while off-screen; scoring only triggers on catch

#### Gameplay UI

The PetPiP control panel displays:
- **Current Score** - large neon cyan display
- **Hackatime Hours** - shows your total coding time as motivation
- **Position Controls** - X/Y inputs to set the pet's fixed screen location
- **Pin Current** - button to pin pet at its current screen position
- **Reset Score** - button to zero the score counter

#### How to Play

1. Click "Open Pet" to launch the PiP window
2. The pet appears at a fixed location on your screen
3. Drag the PiP window around to "scan" the pet
4. When the pet enters view, you earn a point and it **waits 1 second** before teleporting to a new location
5. Chase the pet to accumulate as many points as possible!

### Files Created/Modified

| File | Action | Purpose |
|------|--------|---------|
| `lib/pet-world.ts` | CREATE | Shared state singleton, score tracking, teleport |
| `lib/pet-animation.ts` | CREATE | Animation loop, fixed position |
| `components/PetPiP.tsx` | MODIFY | Canvas rendering, scoring UI, teleport effect, gameplay |
| `app/dashboard/page.tsx` | MODIFY | Pass totalHours prop to PetPiP |
| `PROJECT_DESCRIPTION.md` | UPDATE | Document the feature |

