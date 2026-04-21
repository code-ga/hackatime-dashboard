"use client";

import { useEffect, useState } from "react";
import { User } from "../types/User";

export default function Dashboard() {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const token = localStorage.getItem("access_token");
		console.log("Token in dashboard:", token);

		fetch("https://hackatime.hackclub.com/api/v1/authenticated/me", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then(setUser);
	}, []);

	if (!user)
		return (
			<div className="p-6">
				<div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 mb-6">
					<div className="px-6 py-4 flex items-center gap-3">
						<div className="w-10 h-10 bg-purple-600/20 rounded-lg animate-pulse" />
						<div className="space-y-1">
							<div className="h-5 w-24 bg-gray-600 rounded animate-pulse" />
							<div className="h-3 w-16 bg-gray-700 rounded animate-pulse" />
						</div>
					</div>
				</div>
				<div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 p-6">
					<div className="h-32 flex items-center justify-center text-gray-500">
						Loading content...
					</div>
				</div>
			</div>
		);

	return (
		<div className="p-6">
			<div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 mb-6">
				<div className="px-6 py-4 flex items-center gap-3">
					<div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
						<span className="text-lg font-bold text-purple-400">
							{user.github_username.charAt(0).toUpperCase()}
						</span>
					</div>
					<div>
						<h1 className="text-lg font-semibold text-gray-100">
							{user.github_username}
						</h1>
						<p className="text-xs text-gray-400">
							{user.emails[0]} · {user.trust_factor.trust_level}
						</p>
					</div>
				</div>
			</div>

			<div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 p-6">
				<div className="h-32 flex items-center justify-center text-gray-500">
					Content coming soon...
				</div>
			</div>
		</div>
	);
}
