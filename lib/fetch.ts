export function fetcher<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
	return fetch(input, init).then((res) => {
		if (!res.ok) {
			throw new Error(`HTTP error! status: ${res.status}`);
		}
		return res.json() as Promise<T>;
	});
}

// Fetcher for authenticated endpoints - reads token from localStorage automatically
// Note: Only works in client-side code (localStorage is not available server-side)
export async function authFetcher<T>(
	input: RequestInfo,
	init?: RequestInit,
): Promise<T> {
	const token =
		typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

	if (!token) {
		throw new Error("No access token found. User must be authenticated.");
	}

	return fetch(input, {
		...init,
		headers: {
			...init?.headers,
			Authorization: `Bearer ${token}`,
		},
	}).then((res) => {
		if (!res.ok) {
			throw new Error(`HTTP error! status: ${res.status}`);
		}
		return res.json() as Promise<T>;
	});
}
