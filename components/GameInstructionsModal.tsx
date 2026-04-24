"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { PetIcon } from "./PetIcon";

interface GameInstructionsModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	isFirstTime?: boolean;
}

export function GameInstructionsModal({
	open,
	onOpenChange,
	isFirstTime = false,
}: GameInstructionsModalProps) {
	const [dontShowAgain, setDontShowAgain] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	const handleClose = () => {
		if (dontShowAgain) {
			if (typeof window !== "undefined") {
				localStorage.setItem("petGameInstructionsShown", "true");
			}
		}
		onOpenChange(false);
	};

	const handleOpenPet = () => {
		onOpenChange(false);
	};

	if (!mounted) return null;

	if (!open) return null;

	return createPortal(
		<>
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
				{/* Backdrop */}
				<div
					className="absolute inset-0 bg-black/80 backdrop-blur-sm"
					onClick={handleClose}
					aria-hidden="true"
				/>

				{/* Modal */}
				<Card className="relative z-10 w-full max-w-lg max-h-[90vh] border border-cyan/30 bg-black/95 shadow-[0_0_30px_theme('colors.cyan/30')] animate-fade-in">
					{/* Glow border effect */}
					<div className="absolute -inset-px rounded-lg bg-gradient-to-r from-cyan/30 to-magenta/30 opacity-50 blur-sm" />
					<div className="relative">
						<CardHeader className="border-b border-cyan/20 bg-black/50 py-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="w-8 h-8 rounded-full bg-cyan/20 flex items-center justify-center">
										<PetIcon size={16} />
									</div>
									<CardTitle className="text-cyan glow-cyan text-lg">
										{isFirstTime ? "Welcome to Pet Game!" : "How to Play"}
									</CardTitle>
								</div>
								<Button
									variant="ghost"
									size="icon"
									onClick={handleClose}
									className="text-cyan/70 hover:text-cyan hover:bg-cyan/10"
									aria-label="Close instructions"
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
						</CardHeader>

						<CardContent className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
							{/* Objective */}
							<section>
								<h3 className="text-sm font-mono text-cyan uppercase tracking-wider mb-2 flex items-center gap-2">
									<span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
									Objective
								</h3>
								<p className="text-sm text-foreground/80 leading-relaxed">
									Catch the virtual pet by positioning it inside the red target
									circle at the center of your PiP window. Each successful catch
									earns you +1 point!
								</p>
							</section>

							{/* How to Play */}
							<section className="space-y-3">
								<h3 className="text-sm font-mono text-magenta uppercase tracking-wider mb-2 flex items-center gap-2">
									<span className="w-2 h-2 rounded-full bg-magenta animate-pulse" />
									How to Play
								</h3>
								<ol className="space-y-3 text-sm text-foreground/80">
									<li className="flex gap-3">
										<span className="flex-shrink-0 w-5 h-5 rounded bg-cyan/20 text-cyan text-xs flex items-center justify-center font-mono">
											1
										</span>
										<span>
											Click <strong className="text-cyan">Play Pet Game</strong>{" "}
											to open the Picture-in-Picture window on your screen.
										</span>
									</li>
									<li className="flex gap-3">
										<span className="flex-shrink-0 w-5 h-5 rounded bg-cyan/20 text-cyan text-xs flex items-center justify-center font-mono">
											2
										</span>
										<span>
											Move the PiP window around your screen using your mouse or
											trackpad.
										</span>
									</li>
									<li className="flex gap-3">
										<span className="flex-shrink-0 w-5 h-5 rounded bg-cyan/20 text-cyan text-xs flex items-center justify-center font-mono">
											3
										</span>
										<span>
											Position the pet inside the{" "}
											<strong className="text-red-400">
												red target circle
											</strong>{" "}
											at the center of the window.
										</span>
									</li>
									<li className="flex gap-3">
										<span className="flex-shrink-0 w-5 h-5 rounded bg-cyan/20 text-cyan text-xs flex items-center justify-center font-mono">
											4
										</span>
										<span>
											Score +1 when the pet is caught! The pet will teleport
											after 1 second.
										</span>
									</li>
								</ol>
							</section>

							{/* Scoring */}
							<section className="bg-cyan/5 rounded-none p-4 border border-cyan/20">
								<h3 className="text-sm font-mono text-green uppercase tracking-wider mb-2 flex items-center gap-2">
									<span className="w-2 h-2 rounded-full bg-green animate-pulse" />
									Scoring
								</h3>
								<ul className="text-sm text-foreground/80 space-y-2">
									<li className="flex items-start gap-2">
										<span className="text-green mt-0.5">+</span>
										<span>
											<strong className="text-green">1 point</strong> per
											successful catch
										</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-green mt-0.5">→</span>
										<span>
											Score <strong className="text-cyan">persists</strong>{" "}
											across game sessions
										</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-green mt-0.5">★</span>
										<span>
											<strong className="text-magenta">
												Teleport burst effect
											</strong>{" "}
											when pet moves
										</span>
									</li>
								</ul>
							</section>

							{/* Tips */}
							<section>
								<h3 className="text-sm font-mono text-yellow-400 uppercase tracking-wider mb-2 flex items-center gap-2">
									<span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
									Pro Tips
								</h3>
								<ul className="text-sm text-foreground/80 space-y-2">
									<li className="flex gap-2">
										<span className="text-yellow-400">→</span>
										<span>
											Watch for the{" "}
											<strong className="text-red-400">pulsing red dot</strong>{" "}
											- it's always centered on the PiP window
										</span>
									</li>
									<li className="flex gap-2">
										<span className="text-yellow-400">→</span>
										<span>
											Use the{" "}
											<strong className="text-cyan">X/Y controls</strong> in the
											PiP panel to pin the pet&apos;s position
										</span>
									</li>
									<li className="flex gap-2">
										<span className="text-yellow-400">→</span>
										<span>
											Look for the{" "}
											<strong className="text-magenta">sparkle burst</strong>{" "}
											when the pet teleports
										</span>
									</li>
									<li className="flex gap-2">
										<span className="text-yellow-400">→</span>
										<span>
											The pet{" "}
											<strong className="text-cyan">
												breaths and sparkles
											</strong>{" "}
											- making it easier to spot!
										</span>
									</li>
								</ul>
							</section>

							{/* Don't show checkbox */}
							{!isFirstTime && (
								<label className="flex items-center gap-2 text-xs text-foreground/60 hover:text-foreground/80 cursor-pointer">
									<input
										type="checkbox"
										checked={dontShowAgain}
										onChange={(e) => setDontShowAgain(e.target.checked)}
										className="w-3 h-3 rounded border-cyan/30 bg-black/50 text-cyan focus:ring-cyan"
									/>
									Don&apos;t show this again
								</label>
							)}
						</CardContent>

						<div className="border-t border-cyan/20 p-4 flex gap-3">
							<Button
								variant="cyberpunk"
								className="flex-1"
								onClick={handleOpenPet}
							>
								<PetIcon size={14} className="mr-2" />
								Play Now
							</Button>
							<Button
								variant="outline"
								onClick={handleClose}
								className="border-cyan/30 text-foreground hover:bg-cyan/5 hover:border-cyan"
							>
								Close
							</Button>
						</div>
					</div>
				</Card>
			</div>
		</>,
		document.body,
	);
}
