"use client";

import { useEffect, useState, useCallback } from "react";
import { hackatimeApi } from "@/lib/hackatime";
import type {
	GetAuthenticatedMeResponse,
	GetAuthenticatedHoursResponse,
	GetAuthenticatedStreakResponse,
	GetAuthenticatedProjectsResponse,
	GetAuthenticatedLatestHeartbeatResponse,
	GetAnyUserStatsResponse,
} from "@/types/hackatime";
import { ThemeToggle } from "@/components/theme-toggle";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../../components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FilterBar, type FilterState } from "@/components/dashboard/filter-bar";
import { LanguageChart } from "@/components/dashboard/language-chart";
import { EditorChart } from "@/components/dashboard/editor-chart";
import { OSChart } from "@/components/dashboard/os-chart";
import { PetPiP } from "../../components/PetPiP";

function formatTime(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	if (hours > 0) {
		return `${hours}h ${minutes}m`;
	}
	return `${minutes}m`;
}

function formatTimeDetailed(seconds: number): {
	hours: number;
	minutes: number;
} {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	return { hours, minutes };
}

function getTrustColor(level: string): {
	bg: string;
	glow: string;
	text: string;
} {
	switch (level.toLowerCase()) {
		case "high":
			return { bg: "bg-green/20", glow: "glow-green", text: "text-green" };
		case "medium":
			return { bg: "bg-cyan/20", glow: "glow-cyan", text: "text-cyan" };
		case "low":
			return {
				bg: "bg-magenta/20",
				glow: "glow-magenta",
				text: "text-magenta",
			};
		default:
			return { bg: "bg-muted", glow: "", text: "text-muted-foreground" };
	}
}

function getLanguageColor(language: string): string {
	const colors: Record<string, string> = {
		typescript: "bg-blue-500",
		javascript: "bg-yellow-500",
		python: "bg-green-500",
		java: "bg-red-500",
		go: "bg-cyan-500",
		rust: "bg-orange-500",
		cpp: "bg-purple-500",
		csharp: "bg-violet-500",
		ruby: "bg-red-400",
		php: "bg-indigo-500",
		swift: "bg-orange-400",
		kotlin: "bg-purple-400",
		html: "bg-orange-500",
		css: "bg-blue-400",
		scss: "bg-pink-400",
		sql: "bg-emerald-500",
		shell: "bg-green-600",
		bash: "bg-green-600",
		yaml: "bg-pink-500",
		json: "bg-yellow-600",
		markdown: "bg-gray-500",
	};
	const lang = language.toLowerCase();
	return colors[lang] || "bg-gray-500";
}

interface LoadingStateProps {
	isLoading: boolean;
}

function LoadingState({ isLoading }: LoadingStateProps) {
	if (!isLoading) return null;

	return (
		<div className="p-6 space-y-6 min-h-screen cyberpunk-grid">
			<div className="flex justify-end mb-4">
				<ThemeToggle />
			</div>

			<div className="grid gap-6">
				<Card className="rounded-xl border border-cyan/20 bg-card/30 backdrop-blur-sm">
					<CardContent className="py-6">
						<div className="flex items-center gap-4">
							<div className="w-20 h-20 rounded-full cyberpunk-skeleton" />
							<div className="space-y-3 flex-1">
								<div className="h-8 w-48 cyberpunk-skeleton rounded" />
								<div className="h-4 w-32 cyberpunk-skeleton rounded" />
							</div>
						</div>
					</CardContent>
				</Card>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{[1, 2, 3].map((i) => (
						<Card
							key={i}
							className="rounded-xl border border-cyan/20 bg-card/30 backdrop-blur-sm"
						>
							<CardHeader>
								<div className="h-4 w-24 cyberpunk-skeleton rounded" />
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="h-16 w-full cyberpunk-skeleton rounded" />
								<div className="h-4 w-3/4 cyberpunk-skeleton rounded" />
							</CardContent>
						</Card>
					))}
				</div>

				<Card className="rounded-xl border border-cyan/20 bg-card/30 backdrop-blur-sm">
					<CardHeader>
						<div className="h-6 w-32 cyberpunk-skeleton rounded" />
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{[1, 2, 3, 4].map((i) => (
								<div key={i} className="h-24 cyberpunk-skeleton rounded" />
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

function ErrorState({ error }: { error: string }) {
	return (
		<div className="p-6 space-y-6 min-h-screen cyberpunk-grid">
			<div className="flex justify-end mb-4">
				<ThemeToggle />
			</div>

			<Card className="rounded-xl border-2 border-destructive bg-destructive/10 backdrop-blur-sm animate-pulse">
				<CardContent className="py-12 text-center">
					<div className="text-destructive font-mono text-lg glitch">
						ERROR: {error}
					</div>
					<p className="text-muted-foreground mt-4 font-mono text-sm">
						System failure detected. Reboot required.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}

interface HeroSectionProps {
	user: GetAuthenticatedMeResponse;
	hours: GetAuthenticatedHoursResponse;
	streak: GetAuthenticatedStreakResponse;
}

function HeroSection({ user, hours, streak }: HeroSectionProps) {
	const trust = getTrustColor(user.trust_factor?.trust_level || "unknown");
	const timeFormatted = formatTimeDetailed(hours.total_seconds);

	return (
		<Card className="rounded-xl border border-cyan/20 bg-card/50 backdrop-blur-sm animate-fade-in overflow-hidden relative">
			<div className="absolute inset-0 bg-gradient-to-br from-cyan/5 via-transparent to-magenta/5 pointer-events-none" />
			<div className="scanline-overlay absolute inset-0" />

			<CardContent className="relative p-6">
				<div className="flex flex-col md:flex-row gap-6 items-center">
					<div className="relative">
						<div
							className={`w-24 h-24 rounded-full ${trust.bg} flex items-center justify-center ${trust.glow} transition-all duration-500`}
						>
							<span className="text-4xl font-bold text-foreground">
								{user.github_username?.charAt(0).toUpperCase() || "U"}
							</span>
						</div>
						<div
							className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full ${trust.bg} border-2 border-card flex items-center justify-center`}
						>
							<span className="text-xs">
								{user.trust_factor?.trust_value || 0}%
							</span>
						</div>
					</div>

					<div className="flex-1 space-y-4 w-full">
						<div className="flex flex-wrap items-center gap-3">
							<h1
								className={`text-3xl font-bold font-mono ${trust.text} ${trust.glow}`}
							>
								@{user.github_username || "User"}
							</h1>
							<Badge
								className={`font-mono ${trust.bg} ${trust.text} border-none`}
							>
								{user.trust_factor?.trust_level || "Unknown"} trust
							</Badge>
						</div>

						<p className="text-sm text-muted-foreground font-mono">
							{user.emails?.[0] || "No email connected"}
						</p>

						<div className="grid grid-cols-3 gap-4">
							<div className="space-y-1">
								<p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
									Total Time
								</p>
								<p className="text-2xl font-bold font-mono text-green glow-green animate-pulse">
									{timeFormatted.hours}
									<span className="text-sm text-muted-foreground">h</span>{" "}
									{timeFormatted.minutes}
									<span className="text-sm text-muted-foreground">m</span>
								</p>
							</div>
							<PetPiP totalHours={hours.total_seconds}></PetPiP>
							<div className="space-y-1">
								<p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
									Streak
								</p>
								<p className="text-2xl font-bold font-mono text-magenta glow-magenta">
									{streak.streak_days}
									<span className="text-sm text-muted-foreground">days</span>
								</p>
							</div>
							<div className="space-y-1">
								<p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
									ID
								</p>
								<p className="text-lg font-bold font-mono text-cyan">
									#{user.id}
								</p>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

interface HoursCardProps {
	hours: GetAuthenticatedHoursResponse;
}

function HoursCard({ hours }: HoursCardProps) {
	const timeFormatted = formatTimeDetailed(hours.total_seconds);
	const maxHours = 24 * 3600;
	const percentage = Math.min((hours.total_seconds / maxHours) * 100, 100);

	return (
		<Card className="rounded-xl border border-green/20 bg-card/50 backdrop-blur-sm animate-fade-in animate-delay-100">
			<CardHeader>
				<CardTitle className="text-sm font-mono uppercase tracking-wider text-green glow-green">
					Coding Time
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="text-center">
					<div className="text-5xl font-bold font-mono text-green glow-green">
						{timeFormatted.hours}
						<span className="text-2xl text-muted-foreground">h</span>
					</div>
					<div className="text-3xl font-bold font-mono text-foreground">
						{timeFormatted.minutes}
						<span className="text-lg text-muted-foreground">m</span>
					</div>
				</div>

				<div className="space-y-2">
					<div className="flex justify-between text-xs font-mono">
						<span className="text-muted-foreground">Daily Progress</span>
						<span className="text-green">{percentage.toFixed(1)}%</span>
					</div>
					<Progress
						value={percentage}
						className="h-3 bg-muted [&>[data-state]]:bg-gradient-to-r [&>[data-state]]:from-green [&>[data-state]]:to-cyan"
					/>
				</div>

				<div className="flex justify-between text-xs font-mono text-muted-foreground pt-2 border-t border-border">
					<span>{hours.start_date?.split("T")[0]}</span>
					<span>{hours.end_date?.split("T")[0]}</span>
				</div>
			</CardContent>
		</Card>
	);
}

interface StreakCardProps {
	streak: GetAuthenticatedStreakResponse;
}

function StreakCard({ streak }: StreakCardProps) {
	const hasStreak = streak.streak_days > 0;

	return (
		<Card className="rounded-xl border border-magenta/20 bg-card/50 backdrop-blur-sm animate-fade-in animate-delay-200">
			<CardHeader>
				<CardTitle className="text-sm font-mono uppercase tracking-wider text-magenta glow-magenta">
					Streak
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex justify-center">
					<div className="relative">
						{hasStreak && (
							<div
								className="absolute inset-0 blur-xl animate-fire-flicker"
								style={{ transformOrigin: "bottom center" }}
							>
								<svg className="w-24 h-24" viewBox="0 0 100 100" fill="none">
									<path
										d="M50 100 C30 70 20 50 25 35 C30 20 45 10 50 5 C55 10 70 20 75 35 C80 50 70 70 50 100Z"
										fill="url(#fireGradient)"
										opacity="0.6"
									/>
									<defs>
										<linearGradient
											id="fireGradient"
											x1="50%"
											y1="0%"
											x2="50%"
											y2="100%"
										>
											<stop offset="0%" stopColor="#magenta" />
											<stop offset="100%" stopColor="#orange" />
										</linearGradient>
									</defs>
								</svg>
							</div>
						)}
						<div
							className={`w-24 h-24 rounded-full flex items-center justify-center ${
								hasStreak ? "bg-magenta/20 neon-magenta" : "bg-muted"
							}`}
						>
							<span
								className={`text-4xl font-bold font-mono ${
									hasStreak
										? "text-magenta glow-magenta"
										: "text-muted-foreground"
								}`}
							>
								{streak.streak_days}
							</span>
						</div>
					</div>
				</div>

				<div className="text-center">
					<p className="text-sm font-mono text-muted-foreground">
						{hasStreak
							? `${streak.streak_days} day${streak.streak_days !== 1 ? "s" : ""} of consistent coding`
							: "Start coding to build your streak!"}
					</p>
				</div>

				{hasStreak && (
					<div className="flex justify-center gap-1">
						{Array.from({ length: Math.min(streak.streak_days, 7) }).map(
							(_, i) => (
								<div
									key={i}
									className="w-3 h-3 rounded-sm bg-magenta animate-pulse"
									style={{ animationDelay: `${i * 100}ms` }}
								/>
							),
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}

interface LiveActivityCardProps {
	heartbeat: GetAuthenticatedLatestHeartbeatResponse;
}

function LiveActivityCard({ heartbeat }: LiveActivityCardProps) {
	return (
		<Card className="rounded-xl border border-cyan/20 bg-card/50 backdrop-blur-sm animate-fade-in animate-delay-300">
			<CardHeader>
				<CardTitle className="text-sm font-mono uppercase tracking-wider text-cyan glow-cyan">
					Live Activity
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="grid grid-cols-2 gap-3">
					<div className="space-y-1">
						<p className="text-xs text-muted-foreground font-mono uppercase">
							Project
						</p>
						<p className="text-sm font-mono text-foreground truncate">
							{heartbeat.project}
						</p>
					</div>
					<div className="space-y-1">
						<p className="text-xs text-muted-foreground font-mono uppercase">
							Language
						</p>
						<Badge
							className={`font-mono ${getLanguageColor(heartbeat.language)} text-white`}
						>
							{heartbeat.language}
						</Badge>
					</div>
					<div className="space-y-1">
						<p className="text-xs text-muted-foreground font-mono uppercase">
							Editor
						</p>
						<p className="text-sm font-mono text-foreground truncate">
							{heartbeat.editor}
						</p>
					</div>
					<div className="space-y-1">
						<p className="text-xs text-muted-foreground font-mono uppercase">
							OS
						</p>
						<p className="text-sm font-mono text-foreground truncate">
							{heartbeat.operating_system}
						</p>
					</div>
					<div className="space-y-1">
						<p className="text-xs text-muted-foreground font-mono uppercase">
							Machine
						</p>
						<p className="text-sm font-mono text-foreground truncate">
							{heartbeat.machine}
						</p>
					</div>
					<div className="space-y-1">
						<p className="text-xs text-muted-foreground font-mono uppercase">
							Category
						</p>
						<Badge variant="outline" className="font-mono">
							{heartbeat.category}
						</Badge>
					</div>
				</div>

				<div className="pt-3 border-t border-border">
					<div className="flex justify-between text-xs font-mono">
						<span className="text-muted-foreground">Entity</span>
						<span className="text-cyan truncate max-w-[150px]">
							{heartbeat.entity}
						</span>
					</div>
					<div className="flex justify-between text-xs font-mono mt-1">
						<span className="text-muted-foreground">Time</span>
						<span className="text-green">
							{new Date(heartbeat.time * 1000).toLocaleTimeString()}
						</span>
					</div>
					<div className="flex justify-between text-xs font-mono mt-1">
						<span className="text-muted-foreground">ID</span>
						<span className="text-muted-foreground">#{heartbeat.id}</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

interface ProjectsGridProps {
	projects: GetAuthenticatedProjectsResponse;
}

function ProjectsGrid({ projects }: ProjectsGridProps) {
	const topProjects = projects.projects.slice(0, 6);
	const maxSeconds = Math.max(...topProjects.map((p) => p.total_seconds), 1);

	return (
		<Card className="rounded-xl border border-cyan/20 bg-card/50 backdrop-blur-sm animate-fade-in animate-delay-400">
			<CardHeader>
				<CardTitle className="text-sm font-mono uppercase tracking-wider text-cyan glow-cyan">
					Top Projects
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{topProjects.map((project, index) => (
						<div
							key={project.name}
							className="p-4 rounded-lg border border-border bg-card/30 hover:bg-card/50 transition-colors"
							style={{ animationDelay: `${index * 50}ms` }}
						>
							<div className="flex justify-between items-start gap-2 mb-2">
								<div className="flex-1 min-w-0">
									<p className="text-sm font-mono text-foreground truncate">
										{project.name}
									</p>
									<p className="text-xs text-muted-foreground">
										{formatTime(project.total_seconds)}
									</p>
								</div>
								<Badge
									variant="outline"
									className="font-mono text-green shrink-0"
								>
									{project.percent}%
								</Badge>
							</div>

							<Progress
								value={(project.total_seconds / maxSeconds) * 100}
								className="h-1.5 bg-muted [&>[data-state]]:bg-gradient-to-r [&>[data-state]]:from-cyan [&>[data-state]]:to-green"
							/>

							<div className="flex flex-wrap gap-1 mt-2">
								{project.languages.slice(0, 3).map((lang) => (
									<Badge
										key={lang}
										className={`text-[10px] px-1.5 py-0 font-mono ${getLanguageColor(lang)} text-white`}
									>
										{lang}
									</Badge>
								))}
								{project.languages.length > 3 && (
									<Badge
										variant="outline"
										className="text-[10px] px-1.5 py-0 font-mono"
									>
										+{project.languages.length - 3}
									</Badge>
								)}
							</div>

							{project.archived && (
								<Badge
									variant="destructive"
									className="mt-2 text-[10px] px-1.5 py-0 font-mono"
								>
									ARCHIVED
								</Badge>
							)}
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

export default function Dashboard() {
	const [user, setUser] = useState<GetAuthenticatedMeResponse | null>(null);
	const [hours, setHours] = useState<GetAuthenticatedHoursResponse | null>(
		null,
	);
	const [streak, setStreak] = useState<GetAuthenticatedStreakResponse | null>(
		null,
	);
	const [projects, setProjects] =
		useState<GetAuthenticatedProjectsResponse | null>(null);
	const [latestHeartbeat, setLatestHeartbeat] =
		useState<GetAuthenticatedLatestHeartbeatResponse | null>(null);
	const [stats, setStats] = useState<GetAnyUserStatsResponse | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [filters, setFilters] = useState<FilterState>({
		startDate: "",
		endDate: "",
		project: "",
		category: "",
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);

				const userData = await hackatimeApi.authenticated.getMe();
				setUser(userData);

				const username = userData.slack_id || userData.github_username;
				if (!username) {
					setError("No username found for user");
					setIsLoading(false);
					return;
				}

				const query: Record<string, string> = {};
				if (filters.startDate) query.start_date = filters.startDate;
				if (filters.endDate) query.end_date = filters.endDate;
				if (filters.project) query.filter_by_project = filters.project;
				if (filters.category) query.filter_by_category = filters.category;

				const featureQuery = {
					features: "languages,editors",
					...query,
				};

				const [hoursData, streakData, projectsData, heartbeatData, statsData] =
					await Promise.all([
						hackatimeApi.authenticated.getHours({ parameters: {}, query }),
						hackatimeApi.authenticated.getStreak(),
						hackatimeApi.authenticated.getProjects({
							parameters: {},
							query: {},
						}),
						hackatimeApi.authenticated.getLatestHeartbeat(),
						hackatimeApi.stats.getAnyUserStats({
							parameters: { username },
							query: featureQuery,
						}),
					]);
				setHours(hoursData);
				setStreak(streakData);
				setProjects(projectsData);
				setLatestHeartbeat(heartbeatData);
				setStats(statsData);
			} catch (err) {
				console.error("Failed to fetch authenticated data:", err);
				setError("Failed to load dashboard data. Please try again.");
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, [filters]);

	const handleFilterChange = useCallback((newFilters: FilterState) => {
		setFilters(newFilters);
	}, []);

	if (error) {
		return <ErrorState error={error} />;
	}

	if (
		isLoading ||
		!user ||
		!hours ||
		!streak ||
		!projects ||
		!latestHeartbeat
	) {
		return <LoadingState isLoading={true} />;
	}

	return (
		<div className="p-6 space-y-6 min-h-screen cyberpunk-grid">
			<div className="flex justify-end mb-4">
				<ThemeToggle />
			</div>

			<HeroSection user={user} hours={hours} streak={streak} />

			<FilterBar projects={projects} onFilterChange={handleFilterChange} />

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<HoursCard hours={hours} />
				<StreakCard streak={streak} />
				<LiveActivityCard heartbeat={latestHeartbeat} />
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<LanguageChart stats={stats} />
				<EditorChart stats={stats} />
				<OSChart heartbeat={latestHeartbeat} />
			</div>

			<ProjectsGrid projects={projects} />
		</div>
	);
}
