"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { GetAnyUserProjectsDetailsResponse } from "@/types/hackatime";
import type { GetAnyUserStatsResponse } from "@/types/hackatime";

interface ProjectListProps {
	projects: GetAnyUserProjectsDetailsResponse | null;
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

function formatDate(dateStr: string): string {
	try {
		const date = new Date(dateStr);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	} catch {
		return dateStr;
	}
}

export function ProjectList({ projects, stats }: ProjectListProps) {
	const projectStats = stats.data.projects;
	console.log("Project stats:", stats, "Projects details:", projects);
	const maxSeconds = Math.max(
		...(projectStats?.map((p) => p.total_seconds) || [0]),
	);

	if (!projects || projects.projects.length === 0) {
		return (
			<Card className="border-muted bg-card/50">
				<CardContent className="p-6">
					<p className="text-center text-muted-foreground font-mono">
						No projects found
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-4">
			<div className="grid gap-4">
				{projects.projects.slice(0, 10).map((project, index) => {
					const matchingStat = projectStats?.find(
						(p) => p.name === project.name,
					);
					const percentage = matchingStat
						? Math.round((matchingStat.total_seconds / maxSeconds) * 100)
						: 0;

					return (
						<Card
							key={project.name}
							className="border-cyan/10 bg-card/30 backdrop-blur-sm animate-slide-in-from-bottom overflow-hidden relative"
							style={{ animationDelay: `${index * 100}ms` }}
						>
							<div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan to-magenta" />

							<CardHeader className="pb-2">
								<div className="flex items-start justify-between gap-2">
									<CardTitle className="font-mono text-sm truncate">
										{project.name}
									</CardTitle>
									<Badge
										variant="outline"
										className="font-mono text-xs border-cyan/30 text-cyan"
									>
										{formatTime(project.total_seconds)}
									</Badge>
								</div>
							</CardHeader>

							<CardContent className="space-y-3">
								<Progress value={percentage} className="h-1" />

								<div className="flex flex-wrap gap-2">
									{project.languages.slice(0, 4).map((lang) => (
										<Badge
											key={lang}
											variant="secondary"
											className="font-mono text-xs"
										>
											{lang}
										</Badge>
									))}
									{project.languages.length > 4 && (
										<Badge variant="secondary" className="font-mono text-xs">
											+{project.languages.length - 4}
										</Badge>
									)}
								</div>

								<div className="flex flex-wrap gap-x-4 text-xs text-muted-foreground font-mono">
									<span>
										{project.total_heartbeats.toLocaleString()} heartbeats
									</span>
									<span>First: {formatDate(project.first_heartbeat)}</span>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
