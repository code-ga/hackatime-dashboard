# Hackatime API
what api i need to considering :?

## Stats
GET/api/v1/stats Get total coding time (Admin Only) (skip)



GET /api/v1/users/{username}/stats Get user stats (implmented)


## Users


GET /api/v1/users/{username}/heartbeats/spans Get heartbeat spans (implemented)



GET /api/v1/users/{username}/trust_factor Get trust factor (skip)



GET /api/v1/users/{username}/projects Get user projects (implementd)



GET /api/v1/users/{username}/project/{project_name} Get specific project stats (implementd)



GET /api/v1/users/{username}/projects/details Get detailed project stats (implementd)



GET /api/v1/users/lookup_email/{email} Lookup user by email (skip)



GET /api/v1/users/lookup_slack_uid/{slack_uid} Lookup user by Slack UID (skip)

## My Projects


GET /my/projects List Project Repo Mappings



PATCH /my/project_repo_mappings/{project_name} Update Project Repo Mapping



PATCH /my/project_repo_mappings/{project_name}/archive Archive Project Mapping



PATCH /my/project_repo_mappings/{project_name}/unarchive Unarchive Project Mapping

## Leaderboard


GET /api/v1/leaderboard Get daily leaderboard (Alias)



GET /api/v1/leaderboard/daily Get daily leaderboard



GET /api/v1/leaderboard/weekly Get weekly leaderboard


## My Data


GET /api/v1/my/heartbeats/most_recent Get most recent heartbeat



GET /api/v1/my/heartbeats Get heartbeats



POST /my/heartbeats/export Export Heartbeats



POST /my/heartbeat_imports Create Heartbeat Import



GET /my/heartbeat_imports/{id} Get Heartbeat Import Status

## Authenticated

All authenticated endpoints are now implemented via the `authenticated` namespace in `lib/hackatime.ts`.

**Usage (Client Components only):**

```typescript
import { hackatimeApi } from "@/lib/hackatime";

// Get current user info
const user = await hackatimeApi.authenticated.getMe();

// Get hours stats
const hours = await hackatimeApi.authenticated.getHours();

// Get streak info
const streak = await hackatimeApi.authenticated.getStreak();

// Get user's projects
const projects = await hackatimeApi.authenticated.getProjects();

// Get API keys
const apiKeys = await hackatimeApi.authenticated.getApiKeys();

// Get latest heartbeat
const latestHeartbeat = await hackatimeApi.authenticated.getLatestHeartbeat();
```

**Important:** These methods use `authFetcher` which reads `access_token` from `localStorage`. They only work in client-side code (within `useEffect` or client components). Calling them server-side will throw an error.

---

GET /api/v1/authenticated/me Get current user info (implemented)

GET /api/v1/authenticated/hours Get hours (implemented)

GET /api/v1/authenticated/streak Get streak (implemented)

GET /api/v1/authenticated/projects Get projects (implemented)

GET /api/v1/authenticated/api_keys Get API keys (implemented)

GET /api/v1/authenticated/heartbeats/latest Get latest heartbeat (implemented)


# Automatic Devlog Generated

- ai will depend on last project devlog time
- get commits from github at the time from the devlog to that time
- draft the devlog 
- generate and what image that we need

# The animation that snake eating the heatmap

# live active popup pet for user can play together

# the timeline of file that user edit