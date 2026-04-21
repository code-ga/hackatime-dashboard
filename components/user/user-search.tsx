"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MagnifyingGlass, Terminal } from "@phosphor-icons/react";

export function UserSearch() {
	const router = useRouter();
	const [username, setUsername] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (username.trim()) {
			router.push(`/user/${encodeURIComponent(username.trim())}`);
		}
	};

	return (
		<Card className="border-cyan/20 bg-card/50 backdrop-blur-sm animate-fade-in">
			<CardContent className="p-4">
				<form onSubmit={handleSubmit} className="flex gap-2">
					<div className="relative flex-1">
						<Terminal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						<Input
							type="text"
							placeholder="Enter username to view profile..."
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="pl-10 font-mono bg-card border-cyan/20 focus:border-cyan placeholder:text-muted-foreground/50"
						/>
					</div>
					<Button
						type="submit"
						className="bg-gradient-to-r from-cyan to-magenta hover:opacity-90 font-mono"
						disabled={!username.trim()}
					>
						<MagnifyingGlass className="w-4 h-4" />
						<span className="hidden sm:inline ml-2">Search</span>
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
