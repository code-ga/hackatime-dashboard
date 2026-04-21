# Hackatime API
what api i need to considering :?

## Stats
GET/api/v1/stats Get total coding time (Admin Only)



GET /api/v1/users/{username}/stats Get user stats


## Users


GET /api/v1/users/{username}/heartbeats/spans Get heartbeat spans



GET /api/v1/users/{username}/trust_factor Get trust factor



GET /api/v1/users/{username}/projects Get user projects



GET /api/v1/users/{username}/project/{project_name} Get specific project stats



GET /api/v1/users/{username}/projects/details Get detailed project stats



GET /api/v1/users/lookup_email/{email} Lookup user by email



GET /api/v1/users/lookup_slack_uid/{slack_uid} Lookup user by Slack UID

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


GET /api/v1/authenticated/me Get current user info



GET /api/v1/authenticated/hours Get hours



GET /api/v1/authenticated/streak Get streak



GET /api/v1/authenticated/projects Get projects



GET /api/v1/authenticated/api_keys Get API keys



GET /api/v1/authenticated/heartbeats/latest Get latest heartbeat


# Automatic Devlog Generated

- ai will depend on last project devlog time
- get commits from github at the time from the devlog to that time
- draft the devlog 
- generate and what image that we need