"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { GetAnyUserStatsResponse } from "@/types/hackatime";

interface UserProfileCardProps {
	username: string;
	stats: GetAnyUserStatsResponse;
}

function formatTime(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	if (hours > 0) {
		return `${hours}h ${minutes}m`;
	}
	return `${minutes}m`;
}

function getTrustColor(level: string): string {
	switch (level.toLowerCase()) {
		case "high":
			return "bg-green text-green-foreground";
		case "medium":
			return "bg-cyan text-cyan-foreground";
		case "low":
			return "bg-magenta text-magenta-foreground";
		default:
			return "bg-muted text-muted-foreground";
	}
}

export function UserProfileCard({ username, stats }: UserProfileCardProps) {
	const { trust_factor, data } = stats;
	const trustPercentage = trust_factor
		? (trust_factor.trust_value / 100) * 100
		: 0;

	return (
		<Card className="border-cyan/20 bg-card/50 backdrop-blur-sm animate-fade-in animate-delay-100 overflow-hidden relative">
			<div className="absolute inset-0 bg-gradient-to-br from-cyan/5 via-transparent to-magenta/5 pointer-events-none" />

			<CardContent className="relative p-6">
				<div className="flex flex-col md:flex-row gap-6">
					<div className="flex-shrink-0">
						<div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan to-magenta flex items-center justify-center glow-cyan">
							<span className="text-4xl font-bold text-background">
								{username.charAt(0).toUpperCase()}
							</span>
						</div>
					</div>

					<div className="flex-1 space-y-4">
						<div className="flex flex-wrap items-center gap-3">
							<h1 className="text-2xl font-bold font-mono text-cyan glow-cyan">
								@{username}
							</h1>
							<Badge
								className={`font-mono ${trust_factor ? getTrustColor(trust_factor.trust_level) : "bg-muted text-muted-foreground"}`}
							>
								{trust_factor ? trust_factor.trust_level : "Unknown"} trust
							</Badge>
						</div>

						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<div className="space-y-1">
								<p className="text-xs text-muted-foreground font-mono uppercase">
									Total Time
								</p>
								<p className="text-lg font-bold font-mono text-green glow-green">
									{formatTime(data.total_seconds)}
								</p>
							</div>
							<div className="space-y-1">
								<p className="text-xs text-muted-foreground font-mono uppercase">
									Daily Avg
								</p>
								<p className="text-lg font-bold font-mono text-foreground">
									{formatTime(data.daily_average)}
								</p>
							</div>
							<div className="space-y-1">
								<p className="text-xs text-muted-foreground font-mono uppercase">
									Languages
								</p>
								<p className="text-lg font-bold font-mono text-foreground">
									{data.languages.length}
								</p>
							</div>
							<div className="space-y-1">
								<p className="text-xs text-muted-foreground font-mono uppercase">
									Streak
								</p>
								<p className="text-lg font-bold font-mono text-magenta glow-magenta">
									{data.streak} days
								</p>
							</div>
						</div>

						<div className="space-y-2">
							<div className="flex justify-between text-xs font-mono">
								<span className="text-muted-foreground">Trust Factor</span>
								<span className="text-cyan">
									{trust_factor ? `${trust_factor.trust_value}%` : "N/A"}
								</span>
							</div>
							<Progress
								value={trustPercentage}
								className="h-2 [&>[data-state]]:bg-gradient-to-r [&>[data-state]]:from-cyan [&>[data-state]]:to-green"
							/>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
