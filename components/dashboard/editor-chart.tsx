"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GetAnyUserStatsResponse } from "@/types/hackatime";

interface EditorChartProps {
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
];

function formatTime(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	if (hours > 0) {
		return `${hours}h ${minutes}m`;
	}
	return `${minutes}m`;
}

export function EditorChart({ stats }: EditorChartProps) {
	const editors = stats?.data?.editors?.slice(0, 6) || [];
	const totalSeconds = editors.reduce((sum, e) => sum + e.total_seconds, 0);

	if (editors.length === 0) {
		return (
			<Card className="rounded-xl border border-cyan/20 bg-card/50">
				<CardHeader>
					<CardTitle className="text-sm font-mono uppercase tracking-wider text-cyan glow-cyan">
						Editors
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-center text-muted-foreground font-mono text-sm">
						No editor data available. Use features=editors in API query.
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="rounded-xl border border-cyan/20 bg-card/50">
			<CardHeader>
				<CardTitle className="text-sm font-mono uppercase tracking-wider text-cyan glow-cyan">
					Editors
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
						{editors.map((editor, index) => {
							const circumference = 2 * Math.PI * 40;
							const segmentLength = (editor.percent / 100) * circumference;
							const offset = editors
								.slice(0, index)
								.reduce((sum, e) => sum + (e.percent / 100) * circumference, 0);
							const color = CHART_COLORS[index % CHART_COLORS.length];

							return (
								<circle
									key={editor.name}
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
						{editors.map((editor, index) => (
							<div
								key={editor.name}
								className="flex items-center gap-2 text-xs font-mono"
							>
								<div
									className="w-2 h-2 shrink-0"
									style={{
										backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
									}}
								/>
								<span className="truncate flex-1 min-w-0">{editor.name}</span>
								<span className="text-muted-foreground shrink-0">
									{editor.percent}%
								</span>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
