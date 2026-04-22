"use client";

import { useState, useEffect, useMemo } from "react";
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

function generateYearDates(
	heatmap: Map<string, number>,
): { date: string; duration: number; index: number }[] {
	const today = new Date();
	const oneYearAgo = new Date(today);
	oneYearAgo.setFullYear(today.getFullYear() - 1);

	const dates: { date: string; duration: number; index: number }[] = [];
	let index = 0;

	const current = new Date(oneYearAgo);
	while (current <= today) {
		const dateKey = current.toISOString().split("T")[0];
		const duration = heatmap.get(dateKey) || 0;
		dates.push({ date: dateKey, duration, index });
		current.setDate(current.getDate() + 1);
		index++;
	}

	return dates;
}

function SnakeSVG() {
	return (
		<svg width={300} height={100} viewBox="0 0 300 100">
			<path
				d="M20 50 L280 50"
				fill="none"
				stroke="#22c55e"
				strokeWidth={12}
				strokeLinecap="round"
			/>

			<circle cx={280} cy={50} r={8} fill="#16a34a" />
		</svg>
	);
}

export function ActivityTimeline({ heartbeats }: ActivityTimelineProps) {
	const [isAnimating, setIsAnimating] = useState(false);
	const [animationProgress, setAnimationProgress] = useState(0);

	const heatmap = useMemo(() => {
		if (!heartbeats || heartbeats.spans.length === 0) return null;
		return getActivityHeatmap(heartbeats.spans);
	}, [heartbeats]);

	const yearDates = useMemo(() => {
		if (!heatmap) return [];
		return generateYearDates(heatmap);
	}, [heatmap]);

	const maxDuration = useMemo(() => {
		if (!heatmap) return 0;
		return Math.max(...heatmap.values());
	}, [heatmap]);

	const totalCells = yearDates.length;
	const totalCodingTime = useMemo(() => {
		if (!heatmap) return 0;
		return Array.from(heatmap.values()).reduce((sum, dur) => sum + dur, 0);
	}, [heatmap]);

	const daysWithActivity = useMemo(() => {
		if (!heatmap) return 0;
		return Array.from(heatmap.values()).filter((d) => d > 0).length;
	}, [heatmap]);

	const avgPerDay =
		daysWithActivity > 0 ? totalCodingTime / daysWithActivity : 0;

	useEffect(() => {
		if (!isAnimating) return;

		const duration = totalCells * 100;
		const startTime = Date.now();

		const animate = () => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);
			setAnimationProgress(progress);

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				setIsAnimating(false);
			}
		};

		requestAnimationFrame(animate);
	}, [isAnimating, totalCells]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsAnimating(true);
		}, 500);
		return () => clearTimeout(timer);
	}, []);

	const handlePlay = () => {
		setAnimationProgress(0);
		setIsAnimating(true);
	};

	const currentSnakeIndex = Math.floor(animationProgress * totalCells);

	console.log("Heatmap:", heatmap);
	console.log("Year dates:", yearDates);
	console.log("Max duration:", maxDuration);
	console.log("Total coding time:", totalCodingTime);
	console.log("Days with activity:", daysWithActivity);
	console.log("Avg per day:", avgPerDay);

	if (!heatmap) {
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

	return (
		<div className="space-y-4">
			<Card className="border-muted bg-card/50">
				<CardHeader className="pb-2 flex flex-row items-center justify-between">
					<CardTitle className="font-mono text-sm">Activity Heatmap</CardTitle>
					<button
						onClick={handlePlay}
						className="text-xs font-mono text-cyan hover:text-cyan/80 transition-colors"
					>
						{isAnimating ? "🐍 Playing..." : "🐍 Replay"}
					</button>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						<div className="flex flex-wrap gap-1 relative">
							{yearDates.map((item) => {
								const { date, duration, index } = item;
								const intensity = duration / (maxDuration || 1);
								const isSnakeHead = index === currentSnakeIndex && isAnimating;
								const isEaten = index <= currentSnakeIndex && isAnimating;

								return (
									<div
										key={date}
										className={`w-3 h-3 rounded-sm ${getIntensityColor(duration)} ${isSnakeHead ? "snake-head" : ""} ${isEaten ? "snake-cell" : ""}`}
										style={
											{
												opacity: 0.3 + intensity * 0.7,
												"--cell-index": index,
												"--cell-color":
													duration >= 3600
														? "oklch(0.758 0.252 145.85)"
														: duration >= 1800
															? "oklch(0.858 0.202 200.5)"
															: duration >= 900
																? "oklch(0.658 0.252 320.36)"
																: "oklch(0.556 0 0)",
											} as React.CSSProperties
										}
										title={`${date}: ${formatDuration(duration)}`}
									/>
								);
							})}
							{isAnimating && (
								<div
									className="absolute text-lg leading-none transition-all duration-100"
									style={{
										left: `${(currentSnakeIndex % 52) * 14}px`,
										top: `${Math.floor(currentSnakeIndex / 52) * 14}px`,
									}}
								>
									<SnakeSVG></SnakeSVG>
								</div>
							)}
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
						{heartbeats?.spans
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
							{heartbeats?.spans.length ?? 0}
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
