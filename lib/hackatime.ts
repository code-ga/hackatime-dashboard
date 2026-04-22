import type {
	GetAnyUserHeartbeatsSpansInput,
	GetAnyUserHeartbeatsSpansResponse,
	GetAnyUserProjectsDetailsInput,
	GetAnyUserProjectsDetailsResponse,
	GetAnyUserStatsInput,
	GetAnyUserStatsResponse,
	GetAuthenticatedApiKeysResponse,
	GetAuthenticatedHoursInput,
	GetAuthenticatedHoursResponse,
	GetAuthenticatedLatestHeartbeatResponse,
	GetAuthenticatedMeResponse,
	GetAuthenticatedProjectsInput,
	GetAuthenticatedProjectsResponse,
	GetAuthenticatedStreakResponse,
} from "../types/hackatime";
import { authFetcher, fetcher } from "./fetch";

const API_BASE_URL = "https://hackatime.hackclub.com/api/v1";

export const hackatimeApi = {
	stats: {
		// GET /api/v1/users/{username}/stats Get user stats
		getAnyUserStats: (input: GetAnyUserStatsInput) => {
			const { parameters, query } = input;
			const queryString = new URLSearchParams(
				query as Record<string, string>,
			).toString();
			return fetcher<GetAnyUserStatsResponse>(
				`${API_BASE_URL}/users/${parameters.username}/stats?${queryString}`,
			);
		},
	},
	users: {
		//GET /api/v1/users/{username}/heartbeats/spans Get heartbeat spans
		getAnyUserHeartbeatsSpans: async (
			input: GetAnyUserHeartbeatsSpansInput,
		) => {
			const { parameters, query } = input;
			const queryString = new URLSearchParams(
				query as Record<string, string>,
			).toString();
			const data = await fetcher<GetAnyUserHeartbeatsSpansResponse>(
				`${API_BASE_URL}/users/${parameters.username}/heartbeats/spans?${queryString}`,
			);
			data.spans = data.spans.map((span) => ({
				...span,
				start_time: span.start_time * 1000, // Convert to milliseconds
				end_time: span.end_time * 1000, // Convert to milliseconds
			}));
			return data;
		},

		// GET /api/v1/users/{username}/projects Get user projects recently worked on (last 30 days)
		getAnyUserProjects: (input: { parameters: { username: string } }) => {
			const { parameters } = input;
			return fetcher<{
				data: {
					projects: string[];
				};
			}>(`${API_BASE_URL}/users/${parameters.username}/projects`);
		},

		// GET /api/v1/users/{username}/project/{project_name} Get specific project stats
		getAnyUserProjectStats: (input: GetAnyUserStatsInput) => {
			const { parameters, query } = input;
			const queryString = new URLSearchParams(
				query as Record<string, string>,
			).toString();
			return fetcher<GetAnyUserStatsResponse>(
				`${API_BASE_URL}/users/${parameters.username}/project/${query.filter_by_project}?${queryString}`,
			);
		},

		// GET /api/v1/users/{username}/projects/details Get detailed project stats
		getAnyUserProjectsDetails: (input: GetAnyUserProjectsDetailsInput) => {
			const { parameters, query } = input;
			const queryString = new URLSearchParams(
				query as Record<string, string>,
			).toString();
			return fetcher<GetAnyUserProjectsDetailsResponse>(
				`${API_BASE_URL}/users/${parameters.username}/projects/details?${queryString}`,
			);
		},
	},

	// Authenticated endpoints - require access_token in localStorage
	// Only call these from client components or within useEffect
	authenticated: {
		// GET /api/v1/authenticated/me Get current user info
		getMe: () =>
			authFetcher<GetAuthenticatedMeResponse>(
				`${API_BASE_URL}/authenticated/me`,
			),

		// GET /api/v1/authenticated/hours Get hours
		getHours: (input: GetAuthenticatedHoursInput) => {
			const { query } = input;
			const queryString = new URLSearchParams(
				query as Record<string, string>,
			).toString();
			return authFetcher<GetAuthenticatedHoursResponse>(
				`${API_BASE_URL}/authenticated/hours?${queryString}`,
			);
		},

		// GET /api/v1/authenticated/streak Get streak
		getStreak: () =>
			authFetcher<GetAuthenticatedStreakResponse>(
				`${API_BASE_URL}/authenticated/streak`,
			),

		// GET /api/v1/authenticated/projects Get projects
		getProjects: (input: GetAuthenticatedProjectsInput) => {
			const { query } = input;
			const queryString = new URLSearchParams(
				query as Record<string, string>,
			).toString();
			return authFetcher<GetAuthenticatedProjectsResponse>(
				`${API_BASE_URL}/authenticated/projects?${queryString}`,
			);
		},

		// GET /api/v1/authenticated/api_keys Get API keys
		getApiKeys: () =>
			authFetcher<GetAuthenticatedApiKeysResponse>(
				`${API_BASE_URL}/authenticated/api_keys`,
			),

		// GET /api/v1/authenticated/heartbeats/latest Get latest heartbeat
		getLatestHeartbeat: () =>
			authFetcher<GetAuthenticatedLatestHeartbeatResponse>(
				`${API_BASE_URL}/authenticated/heartbeats/latest`,
			),
	},
};
