export interface User {
	id: number;
	emails: string[];
	slack_id: string;
	github_username: string;
	trust_factor: {
		trust_level: string;
		trust_value: number;
	};
}
