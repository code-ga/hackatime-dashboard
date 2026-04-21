"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { HACKATIME_CLIENT_ID, HACKATIME_REDIRECT_URL } from "../../constants";

export default function CallbackPage() {
	const router = useRouter();

	useEffect(() => {
		const run = async () => {
			const params = new URLSearchParams(window.location.search);
			const code = params.get("code");

			const verifier = localStorage.getItem("pkce_verifier");

			if (!code || !verifier) {
				console.error("Missing code or verifier");
				return;
			}

			const res = await fetch("/api/auth/token", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					code,
					code_verifier: verifier,
				}),
			});

			const data = await res.json();

			// store token
			localStorage.setItem("access_token", data.access_token);
      console.log("Access token:", data.access_token);

			// redirect to dashboard
			router.push("/dashboard");
		};

		run();
	}, []);

	return <div>Logging you in...</div>;
}
