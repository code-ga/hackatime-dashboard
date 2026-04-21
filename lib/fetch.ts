export function fetcher<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
	return fetch(input, init).then((res) => {
		if (!res.ok) {
			throw new Error(`HTTP error! status: ${res.status}`);
		}
		return res.json() as Promise<T>;
	});
}
