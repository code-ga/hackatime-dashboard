// GET /api/v1/users/{username}/stats Get user stats
export type GetAnyUserStatsResponse = {
	data: {
		total_seconds: number;
		daily_average: number;
		languages: {
			name: string;
			total_seconds: number;
			percent: number;
		}[];
		projects: {
			name: string;
			total_seconds: number;
			percent: number;
		}[];
		editors: {
			name: string;
			total_seconds: number;
			percent: number;
		}[];
		streak: number;
	};
	trust_factor: {
		trust_level: string;
		trust_value: number;
	};
};
export type GetAnyUserStatsInput = {
	parameters: {
		username: string;
	};
	query: {
		start_date?: `${number}-${number}-${number}`; // YYYY-MM-DD
		end_date?: `${number}-${number}-${number}`; // YYYY-MM-DD
		limit?: number;
		features?: string; // comma-separated list of features to include in the response (e.g., "languages,projects,editors")
		filter_by_project?: string; // filter the stats by a specific project name
		filter_by_category?: string; // filter the stats by a specific category (e.g., "ai+coding","coding","writing+docs","writing+tests")
		boundary_aware?: boolean; // if true, the API will consider the boundaries of coding sessions when calculating stats (default: false)
		total_seconds?: boolean; // if true, the API will only return the total_seconds field in the response (default: false)
	};
};

// GET /api/v1/users/{username}/heartbeats/spans Get heartbeat spans
export type GetAnyUserHeartbeatsSpansResponse = {
	spans: [
		{
			duration: number;
			start_time: number; // ISO 8601 format
			end_time: number; // ISO 8601 format
		},
	];
};

export type GetAnyUserHeartbeatsSpansInput = {
	parameters: {
		username: string;
	};
	query: {
		start_date?: `${number}-${number}-${number}`; // YYYY-MM-DD
		end_date?: `${number}-${number}-${number}`; // YYYY-MM-DD
		project?: string; // filter the heartbeats by a specific project name
		filter_by_project?: string; // Filter by multiple projects (comma-separated)
	};
};

// GET /api/v1/users/{username}/project/{project_name} Get specific project stats
export type GetAnyUserProjectStatsResponse = {
	name: string;
	total_seconds: number;
	languages: string[];
	repo_url?: string;
	total_heartbeats: number;
	first_heartbeat: string; // ISO 8601 format
	last_heartbeat: string; // ISO 8601 format
	most_recent_heartbeat: string; // ISO 8601 format
	archived: boolean;
};

export type GetAnyUserProjectStatsInput = {
	parameters: {
		username: string;
		project_name: string;
	};
	query: {
		start?: string; // Stats start time, ISO 8601 format (YYYY-MM-DD)
		end?: string; // Stats end time, ISO 8601 format (YYYY-MM-DD)
		start_date?: `${number}-${number}-${number}`; // Start date (ISO 8601) for stats calculation
		end_date?: `${number}-${number}-${number}`; // End date (ISO 8601) for stats calculation
	};
};

// GET /api/v1/users/{username}/projects/details Get detailed project stats
export type GetAnyUserProjectsDetailsResponse = {
	projects: {
		name: string;
		total_seconds: number;
		languages: string[];
		repo_url?: string;
		total_heartbeats: number;
		first_heartbeat: string;
		last_heartbeat: string;
	}[];
};

export type GetAnyUserProjectsDetailsInput = {
	parameters: {
		username: string;
	};
	query: {
		projects?: string; // comma-separated list of projects to filter
		since?: string; // Start time (ISO 8601) for project discovery
		until?: string; // End time (ISO 8601) for project discovery
		until_date?: string; // Alias for until
		start?: string; // Stats start time (ISO 8601)
		end?: string; // Stats end time (ISO 8601)
		start_date?: `${number}-${number}-${number}`; // Start date (ISO 8601) for stats calculation
		end_date?: `${number}-${number}-${number}`; // End date (ISO 8601) for stats calculation
	};
};
