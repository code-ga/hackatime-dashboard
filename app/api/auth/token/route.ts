import {
	HACKATIME_CLIENT_ID,
	HACKATIME_REDIRECT_URL,
} from "../../../constants";

export async function POST(req: Request) {
	const body = await req.json();

	const { code, code_verifier } = body;

	const params = new URLSearchParams({
		client_id: HACKATIME_CLIENT_ID,
		grant_type: "authorization_code",
		code,
		redirect_uri: HACKATIME_REDIRECT_URL,
		code_verifier,
	});

	const res = await fetch("https://hackatime.hackclub.com/oauth/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: params,
	});

	const data = await res.json();

	return Response.json(data);
}
