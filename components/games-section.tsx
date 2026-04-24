"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PetIcon } from "./PetIcon";
import { GameInstructionsModal } from "./GameInstructionsModal";

export function GamesSection() {
	const [hasSeenInstructions, setHasSeenInstructions] = useState(false);
	const [showInstructions, setShowInstructions] = useState(false);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const seen = localStorage.getItem("petGameInstructionsShown");
			setHasSeenInstructions(!!seen);
		}
	}, []);

	const handlePlayClick = () => {
		if (!hasSeenInstructions) {
			setShowInstructions(true);
		}
		// If already seen instructions, the PetPiP component will handle the game logic
		// (it's always rendered in the dashboard)
	};

	const handleInstructionsClose = () => {
		setShowInstructions(false);
	};

	return (
		<section className="space-y-6">
			<Card className="rounded-xl border border-cyan/20 bg-card/50 backdrop-blur-sm animate-fade-in">
				<CardHeader>
					<CardTitle className="text-sm font-mono uppercase tracking-wider text-cyan glow-cyan">
						Games
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex flex-wrap items-center gap-4">
						<Button
							variant="cyberpunk"
							size="lg"
							className="glow-cyan animate-neon-pulse hover:scale-105"
							onClick={handlePlayClick}
						>
							<PetIcon size={18} className="mr-2" />
							Play Pet Game
						</Button>

						{/* Placeholder for future games */}
						<Button
							variant="outline"
							size="lg"
							className="hover:bg-cyan/5 hover:border-cyan"
							disabled
						>
							Coming Soon
						</Button>
					</div>

					{/* Game Instructions Modal */}
					{showInstructions && (
						<GameInstructionsModal
							open={showInstructions}
							onOpenChange={handleInstructionsClose}
							isFirstTime={!hasSeenInstructions}
						/>
					)}
				</CardContent>
			</Card>
		</section>
	);
}
