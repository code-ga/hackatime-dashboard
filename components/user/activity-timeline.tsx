"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GetAnyUserHeartbeatsSpansResponse } from "@/types/hackatime";

interface ActivityTimelineProps {
	heartbeats: GetAnyUserHeartbeatsSpansResponse | null;
}

function formatDuration(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	if (hours > 0) {
		return `${hours}h ${minutes}m`;
	}
	return `${minutes}m`;
}

function getIntensityColor(duration: number): string {
	if (duration >= 3600) return "bg-green h-6";
	if (duration >= 1800) return "bg-cyan h-5";
	if (duration >= 900) return "bg-magenta h-4";
	return "bg-muted-foreground h-3";
}

function getActivityHeatmap(
	spans: GetAnyUserHeartbeatsSpansResponse["spans"],
): Map<string, number> {
	const heatmap = new Map<string, number>();

	spans.forEach((span) => {
		const start = new Date(span.start_time);
		const dateKey = start.toISOString().split("T")[0];
		const current = heatmap.get(dateKey) || 0;
		heatmap.set(dateKey, current + span.duration);
	});

	return heatmap;
}

export function ActivityTimeline({ heartbeats }: ActivityTimelineProps) {
	if (!heartbeats || heartbeats.spans.length === 0) {
		return (
			<Card className="border-muted bg-card/50">
				<CardContent className="p-6">
					<p className="text-center text-muted-foreground font-mono">
						No activity data
					</p>
				</CardContent>
			</Card>
		);
	}

	const heatmap = getActivityHeatmap(heartbeats.spans);
	const sortedDates = Array.from(heatmap.keys()).sort().slice(-30);
	const maxDuration = Math.max(...heatmap.values());

	const totalCodingTime = Array.from(heatmap.values()).reduce(
		(sum, dur) => sum + dur,
		0,
	);
	const avgPerDay = totalCodingTime / sortedDates.length;

	console.log(
		"Heatmap data:",
		heatmap,
		"Sorted dates:",
		sortedDates,
		"Max duration:",
		maxDuration,
		"Total coding time:",
		totalCodingTime,
		"Avg per day:",
		avgPerDay,
		"Heartbeats spans:",
		heartbeats.spans,
	);
	return (
		<div className="space-y-4">
			<Card className="border-muted bg-card/50">
				<CardHeader className="pb-2">
					<CardTitle className="font-mono text-sm">Activity Heatmap</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						<div className="flex flex-wrap gap-1">
							{sortedDates.map((date) => {
								const duration = heatmap.get(date) || 0;
								const intensity = duration / maxDuration;

								return (
									<div
										key={date}
										className={`w-3 h-3 rounded-sm ${getIntensityColor(duration)}`}
										style={{ opacity: 0.3 + intensity * 0.7 }}
										title={`${date}: ${formatDuration(duration)}`}
									/>
								);
							})}
						</div>

						<div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
							<span>Less</span>
							<div className="flex gap-1">
								<div className="w-3 h-3 rounded-sm bg-muted-foreground opacity-40" />
								<div className="w-3 h-3 rounded-sm bg-magenta opacity-70" />
								<div className="w-3 h-3 rounded-sm bg-cyan opacity-80" />
								<div className="w-3 h-3 rounded-sm bg-green" />
							</div>
							<span>More</span>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card className="border-cyan/20 bg-card/50">
				<CardHeader className="pb-2">
					<CardTitle className="font-mono text-sm">Recent Sessions</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-2 max-h-64 overflow-y-auto">
						{heartbeats.spans
							.slice(0, 20)
							.sort(
								(a, b) =>
									new Date(b.start_time).getTime() -
									new Date(a.start_time).getTime(),
							)
							.map((span, index) => {
								const start = new Date(span.start_time);
								const hour = start.getHours();
								const isActive = hour >= 9 && hour <= 22;

								return (
									<div
										key={index}
										className="flex items-center gap-3 p-2 rounded bg-card/50 animate-slide-in-from-right"
										style={{ animationDelay: `${index * 50}ms` }}
									>
										<div
											className={`w-2 h-2 rounded-full ${isActive ? "bg-green" : "bg-muted"}`}
										/>
										<div className="flex-1 text-xs font-mono">
											{start.toLocaleDateString("en-US", {
												weekday: "short",
												month: "short",
												day: "numeric",
											})}
										</div>
										<div className="text-xs font-mono text-cyan">
											{start.toLocaleTimeString("en-US", {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</div>
										<div className="text-xs font-mono text-muted-foreground">
											{formatDuration(span.duration)}
										</div>
									</div>
								);
							})}
					</div>
				</CardContent>
			</Card>

			<div className="grid grid-cols-2 gap-4">
				<Card className="border-magenta/20 bg-card/50">
					<CardContent className="p-4 text-center">
						<p className="text-xs text-muted-foreground font-mono uppercase">
							Total Sessions
						</p>
						<p className="text-2xl font-bold font-mono text-magenta">
							{heartbeats.spans.length}
						</p>
					</CardContent>
				</Card>
				<Card className="border-green/20 bg-card/50">
					<CardContent className="p-4 text-center">
						<p className="text-xs text-muted-foreground font-mono uppercase">
							Avg/Day
						</p>
						<p className="text-2xl font-bold font-mono text-green">
							{formatDuration(avgPerDay)}
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
