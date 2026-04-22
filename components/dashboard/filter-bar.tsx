"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { GetAuthenticatedProjectsResponse } from "@/types/hackatime";

export interface FilterState {
	startDate: string;
	endDate: string;
	project: string;
	category: string;
}

interface FilterBarProps {
	projects: GetAuthenticatedProjectsResponse | null;
	onFilterChange: (filters: FilterState) => void;
}

const CATEGORIES = [
	{ value: "", label: "All Categories" },
	{ value: "ai+coding", label: "AI + Coding" },
	{ value: "coding", label: "Coding" },
	{ value: "writing+docs", label: "Writing + Docs" },
	{ value: "writing+tests", label: "Writing + Tests" },
];

export function FilterBar({ projects, onFilterChange }: FilterBarProps) {
	const [filters, setFilters] = useState<FilterState>({
		startDate: "",
		endDate: "",
		project: "",
		category: "",
	});

	const handleChange = useCallback(
		(field: keyof FilterState, value: string) => {
			const newFilters = { ...filters, [field]: value };
			setFilters(newFilters);
			onFilterChange(newFilters);
		},
		[filters, onFilterChange],
	);

	const handleReset = useCallback(() => {
		const emptyFilters: FilterState = {
			startDate: "",
			endDate: "",
			project: "",
			category: "",
		};
		setFilters(emptyFilters);
		onFilterChange(emptyFilters);
	}, [onFilterChange]);

	const projectOptions = projects?.projects.map((p) => p.name) || [];

	return (
		<Card className="rounded-xl border border-cyan/20 bg-card/50 backdrop-blur-sm">
			<CardContent className="p-4">
				<div className="flex flex-wrap gap-3 items-end">
					<div className="flex flex-col gap-1">
						<label className="text-xs font-mono text-muted-foreground uppercase">
							Start Date
						</label>
						<Input
							type="date"
							value={filters.startDate}
							onChange={(e) => handleChange("startDate", e.target.value)}
							className="w-36 font-mono"
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-xs font-mono text-muted-foreground uppercase">
							End Date
						</label>
						<Input
							type="date"
							value={filters.endDate}
							onChange={(e) => handleChange("endDate", e.target.value)}
							className="w-36 font-mono"
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-xs font-mono text-muted-foreground uppercase">
							Project
						</label>
						<select
							value={filters.project}
							onChange={(e) => handleChange("project", e.target.value)}
							className="h-8 w-48 rounded-none border border-input bg-transparent px-2.5 py-1 text-xs font-mono transition-colors outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
						>
							<option value="">All Projects</option>
							{projectOptions.map((name) => (
								<option key={name} value={name}>
									{name}
								</option>
							))}
						</select>
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-xs font-mono text-muted-foreground uppercase">
							Category
						</label>
						<select
							value={filters.category}
							onChange={(e) => handleChange("category", e.target.value)}
							className="h-8 w-40 rounded-none border border-input bg-transparent px-2.5 py-1 text-xs font-mono transition-colors outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
						>
							{CATEGORIES.map((cat) => (
								<option key={cat.value} value={cat.value}>
									{cat.label}
								</option>
							))}
						</select>
					</div>

					<Button
						variant="outline"
						size="sm"
						onClick={handleReset}
						className="h-8 font-mono"
					>
						Reset
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
