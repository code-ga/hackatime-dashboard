"use client";

import { useEffect, useState, use } from "react";
import { UserProfileCard } from "@/components/user/user-profile-card";
import { ProjectList } from "@/components/user/project-list";
import { ActivityTimeline } from "@/components/user/activity-timeline";
import { UserSearch } from "@/components/user/user-search";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { GetAnyUserStatsResponse } from "@/types/hackatime";
import type { GetAnyUserProjectsDetailsResponse } from "@/types/hackatime";
import type { GetAnyUserHeartbeatsSpansResponse } from "@/types/hackatime";
import { hackatimeApi } from "@/lib/hackatime";

interface UserPageProps {
	params: Promise<{ username: string }>;
}

export default function UserPage({ params }: UserPageProps) {
	const { username } = use(params);
	const [stats, setStats] = useState<GetAnyUserStatsResponse | null>(null);
	const [projects, setProjects] =
		useState<GetAnyUserProjectsDetailsResponse | null>(null);
	const [heartbeats, setHeartbeats] =
		useState<GetAnyUserHeartbeatsSpansResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchData() {
			setLoading(true);
			setError(null);
			try {
				const [statsData, projectsData, heartbeatsData] = await Promise.all([
					hackatimeApi.stats.getAnyUserStats({
						parameters: { username },
						query: {},
					}),
					hackatimeApi.users.getAnyUserProjectsDetails({
						parameters: { username },
						query: {},
					}),
					hackatimeApi.users.getAnyUserHeartbeatsSpans({
						parameters: { username },
						query: {},
					}),
				]);
				setStats(statsData);
				setProjects(projectsData);
				setHeartbeats(heartbeatsData);
			} catch {
				setError(
					"Failed to load user profile. Please check the username and try again.",
				);
			} finally {
				setLoading(false);
			}
		}

		if (username) {
			fetchData();
		}
	}, [username]);

	if (loading) {
		return (
			<div className="min-h-screen bg-background cyberpunk-grid p-6">
				<div className="max-w-6xl mx-auto space-y-6">
					<div className="flex items-center gap-4">
						<Skeleton className="w-24 h-24 rounded-full animate-pulse" />
						<div className="space-y-2">
							<Skeleton className="h-8 w-48 animate-pulse" />
							<Skeleton className="h-4 w-32 animate-pulse" />
						</div>
					</div>
					<Skeleton className="h-64 animate-pulse" />
					<Skeleton className="h-48 animate-pulse" />
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-background cyberpunk-grid p-6">
				<div className="max-w-6xl mx-auto">
					<UserSearch />
					<div className="mt-6 p-6 rounded-lg border border-destructive/50 bg-destructive/10">
						<p className="text-destructive text-center font-mono">{error}</p>
					</div>
				</div>
			</div>
		);
	}

	if (!stats) {
		return (
			<div className="min-h-screen bg-background cyberpunk-grid p-6">
				<div className="max-w-6xl mx-auto">
					<UserSearch />
					<div className="mt-6 p-6 rounded-lg border border-muted bg-muted/10">
						<p className="text-muted-foreground text-center font-mono">
							User not found
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background cyberpunk-grid p-6">
			<div className="max-w-6xl mx-auto space-y-6">
				<UserSearch />

				<UserProfileCard username={username} stats={stats} />

				<Tabs
					defaultValue="projects"
					className="animate-fade-in animate-delay-200"
				>
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger
							value="projects"
							className="font-mono data-[state=active]:data-[state=active]/trigger:text-cyan"
						>
							Projects
						</TabsTrigger>
						<TabsTrigger
							value="activity"
							className="font-mono data-[state=active]:data-[state=active]/trigger:text-cyan"
						>
							Activity
						</TabsTrigger>
					</TabsList>
					<TabsContent
						value="projects"
						className="mt-4 animate-slide-in-from-bottom animate-duration-300"
					>
						<ProjectList projects={projects} stats={stats} />
					</TabsContent>
					<TabsContent
						value="activity"
						className="mt-4 animate-slide-in-from-bottom animate-duration-300"
					>
						<ActivityTimeline heartbeats={heartbeats} />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
