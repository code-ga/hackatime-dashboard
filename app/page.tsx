"use client";

import { HACKATIME_CLIENT_ID, HACKATIME_REDIRECT_URL } from "./constants";
import { generateCodeVerifier, generateCodeChallenge } from "./libs/pkce";



export default function Home() {
  const handleLogin = async () => {
    const verifier = generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);

    // store verifier for later
    localStorage.setItem("pkce_verifier", verifier);

    const params = new URLSearchParams({
      client_id: HACKATIME_CLIENT_ID,
      redirect_uri: HACKATIME_REDIRECT_URL,
      response_type: "code",
      scope: "profile read",
      code_challenge: challenge,
      code_challenge_method: "S256",
    });

    window.location.href = `https://hackatime.hackclub.com/oauth/authorize?${params}`;
  };

  return (
    <main className="flex h-screen items-center justify-center">
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl"
      >
        Login with Hackatime
      </button>
    </main>
  );
}