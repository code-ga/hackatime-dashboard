"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GetAuthenticatedLatestHeartbeatResponse } from "@/types/hackatime";

interface OSChartProps {
	heartbeat: GetAuthenticatedLatestHeartbeatResponse | null;
}

const OS_LABELS: Record<string, string> = {
	Linux: "Linux",
	darwin: "macOS",
	Windows: "Windows",
	FreeBSD: "FreeBSD",
	Android: "Android",
	iOS: "iOS",
};

const OS_COLORS: Record<string, string> = {
	Linux: "#22c55e",
	darwin: "#a855f7",
	Windows: "#3b82f6",
	FreeBSD: "#f97316",
	Android: "#14b8a6",
	iOS: "#ec4899",
};

function formatOSName(os: string): string {
	return OS_LABELS[os] || os;
}

export function OSChart({ heartbeat }: OSChartProps) {
	const os = heartbeat?.operating_system || "";
	const formattedOS = formatOSName(os);
	const color = OS_COLORS[os] || "#6b7280";

	if (!os) {
		return (
			<Card className="rounded-xl border border-magenta/20 bg-card/50">
				<CardHeader>
					<CardTitle className="text-sm font-mono uppercase tracking-wider text-magenta glow-magenta">
						Operating System
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-center text-muted-foreground font-mono text-sm">
						No OS data available
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="rounded-xl border border-magenta/20 bg-card/50">
			<CardHeader>
				<CardTitle className="text-sm font-mono uppercase tracking-wider text-magenta glow-magenta">
					Operating System
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex items-center gap-4">
					<svg
						width={80}
						height={80}
						viewBox="0 0 100 100"
						className="shrink-0"
					>
						<circle
							cx={50}
							cy={50}
							r={40}
							fill="none"
							stroke={color}
							strokeWidth="12"
							strokeDasharray="251.2"
							strokeDashoffset="0"
							transform="rotate(-90 50 50)"
						/>
						<circle cx={50} cy={50} r={25} fill={color} opacity={0.2} />
						<text
							x={50}
							y={55}
							textAnchor="middle"
							className="fill-foreground text-[12px] font-mono font-bold"
						>
							{formattedOS.split(" ")[0]}
						</text>
					</svg>

					<div className="flex-1 space-y-2">
						<div className="flex items-center gap-2">
							<div
								className="w-3 h-3 rounded-sm"
								style={{ backgroundColor: color }}
							/>
							<span className="text-sm font-mono">{formattedOS}</span>
						</div>
						<p className="text-xs text-muted-foreground font-mono">
							Current system from latest heartbeat
						</p>
						{heartbeat?.machine && (
							<p className="text-xs text-muted-foreground font-mono truncate">
								Machine: {heartbeat.machine}
							</p>
						)}
					</div>
				</div>

				<div className="mt-4 pt-3 border-t border-border">
					<p className="text-xs text-muted-foreground font-mono">
						Note: Historical OS data is not available in the API. Showing
						current OS from latest heartbeat.
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
