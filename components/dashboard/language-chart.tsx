"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GetAnyUserStatsResponse } from "@/types/hackatime";

interface LanguageChartProps {
	stats: GetAnyUserStatsResponse | null;
}

const CHART_COLORS = [
	"#22c55e",
	"#3b82f6",
	"#a855f7",
	"#f97316",
	"#06b6d4",
	"#ec4899",
	"#eab308",
	"#14b8a6",
	"#8b5cf6",
	"#ef4444",
];

function formatTime(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	if (hours > 0) {
		return `${hours}h ${minutes}m`;
	}
	return `${minutes}m`;
}

export function LanguageChart({ stats }: LanguageChartProps) {
	const languages = stats?.data?.languages?.slice(0, 8) || [];
	const totalSeconds = languages.reduce((sum, l) => sum + l.total_seconds, 0);

	if (languages.length === 0) {
		return (
			<Card className="rounded-xl border border-green/20 bg-card/50">
				<CardHeader>
					<CardTitle className="text-sm font-mono uppercase tracking-wider text-green glow-green">
						Languages
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-center text-muted-foreground font-mono text-sm">
						No language data
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="rounded-xl border border-green/20 bg-card/50">
			<CardHeader>
				<CardTitle className="text-sm font-mono uppercase tracking-wider text-green glow-green">
					Languages
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex gap-4">
					<svg
						width={120}
						height={120}
						viewBox="0 0 120 120"
						className="shrink-0"
					>
						{languages.map((lang, index) => {
							const circumference = 2 * Math.PI * 40;
							const segmentLength = (lang.percent / 100) * circumference;
							const offset = languages
								.slice(0, index)
								.reduce((sum, l) => sum + (l.percent / 100) * circumference, 0);
							const color = CHART_COLORS[index % CHART_COLORS.length];

							return (
								<circle
									key={lang.name}
									cx={60}
									cy={60}
									r={40}
									fill="none"
									stroke={color}
									strokeWidth="16"
									strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
									strokeDashoffset={`${-offset}`}
									transform="rotate(-90 60 60)"
									className="transition-all duration-300 hover:stroke-width-[20]"
								/>
							);
						})}
						<text
							x={60}
							y={58}
							textAnchor="middle"
							className="fill-foreground text-[10px] font-mono font-bold"
						>
							{formatTime(totalSeconds)}
						</text>
					</svg>

					<div className="flex-1 space-y-1.5 overflow-y-auto max-h-28">
						{languages.map((lang, index) => (
							<div
								key={lang.name}
								className="flex items-center gap-2 text-xs font-mono"
							>
								<div
									className="w-2 h-2 shrink-0"
									style={{
										backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
									}}
								/>
								<span className="truncate flex-1 min-w-0">{lang.name}</span>
								<span className="text-muted-foreground shrink-0">
									{lang.percent}%
								</span>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
