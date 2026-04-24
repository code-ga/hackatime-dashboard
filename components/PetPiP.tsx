"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
	startAnimation,
	stopAnimation,
	updatePipPosition,
	resizePipWindow,
} from "@/lib/pet-animation";
import {
	updateFixedPositionOnScreen,
	getState,
	incrementScore,
	setLastPetOnTarget,
	resetScore,
	teleportPet,
	updateTargetPosition,
	isPetOnTarget,
	petWorldState,
} from "@/lib/pet-world";
import { GameInstructionsModal } from "./GameInstructionsModal";
import { Button } from "@/components/ui/button";

/// <reference lib="dom" />
declare global {
	interface Window {
		documentPictureInPicture: {
			requestWindow: (options: {
				width: number;
				height: number;
				preferInitialWindowPlacement: boolean;
			}) => Promise<Window>;
		};
	}
}

const PIP_WIDTH = 300;
const PIP_HEIGHT = 200;
const TELEPORT_DELAY = 1000; // 1 second delay after catching before teleport

interface PetPiPProps {
	totalHours?: number; // Hackatime total hours in seconds
}

export const PetPiP = ({ totalHours = 0 }: PetPiPProps) => {
	const requestRef = useRef<number | null>(null);
	const pipWindowRef = useRef<Window | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const positionRef = useRef({ x: 0, y: 0 });
	const teleportEffectRef = useRef(0);
	const [fixedPos, setFixedPos] = useState({ x: 0, y: 0 });
	const [isOpen, setIsOpen] = useState(false);
	const [score, setScore] = useState(0);
	const [showScorePopup, setShowScorePopup] = useState(false);
	const [showInstructions, setShowInstructions] = useState(false);

	const trackMovement = useCallback(() => {
		const pipWindow = pipWindowRef.current;
		if (!pipWindow) return;

		const { screenX, screenY } = pipWindow;
		const prev = positionRef.current;

		if (screenX !== prev.x || screenY !== prev.y) {
			positionRef.current = { x: screenX, y: screenY };
			updatePipPosition(screenX, screenY);
			// Update target to stay centered on the PiP window
			updateTargetPosition(screenX + PIP_WIDTH / 2, screenY + PIP_HEIGHT / 2);
		}

		if (!pipWindow.closed) {
			requestRef.current = requestAnimationFrame(trackMovement);
		}
	}, []);

	const handleOpenPet = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if ("documentPictureInPicture" in window) {
			const pipWindow: Window =
				await window.documentPictureInPicture.requestWindow({
					width: PIP_WIDTH,
					height: PIP_HEIGHT,
					preferInitialWindowPlacement: true,
				});
			pipWindowRef.current = pipWindow;
			positionRef.current = { x: pipWindow.screenX, y: pipWindow.screenY };

			// Set initial target position to center of PiP window
			updateTargetPosition(
				pipWindow.screenX + PIP_WIDTH / 2,
				pipWindow.screenY + PIP_HEIGHT / 2,
			);

			// Start tracking window movement
			requestRef.current = requestAnimationFrame(trackMovement);

			const container = pipWindow.document.createElement("div");
			container.style.width = "100%";
			container.style.height = "100%";
			container.style.margin = "0";
			container.style.padding = "0";
			pipWindow.document.body.appendChild(container);
			pipWindow.document.body.style.margin = "0";
			pipWindow.document.body.style.padding = "0";

			[...document.styleSheets].forEach((styleSheet) => {
				try {
					const cssRules = styleSheet.cssRules;
					const style = document.createElement("style");

					for (const rule of cssRules) {
						style.appendChild(document.createTextNode(rule.cssText));
					}

					pipWindow.document.head.appendChild(style);
				} catch (e) {
					console.warn("Cannot access stylesheet", e);
				}
			});

			const canvas = pipWindow.document.createElement("canvas");
			canvas.width = PIP_WIDTH;
			canvas.height = PIP_HEIGHT;
			canvas.style.display = "block";
			canvas.style.width = "100%";
			canvas.style.height = "100%";
			container.appendChild(canvas);
			canvasRef.current = canvas;

			// Use the fixed position from state
			const state = getState();
			startAnimation(
				pipWindow.screenX,
				pipWindow.screenY,
				PIP_WIDTH,
				PIP_HEIGHT,
				state.fixedPositionOnScreen.x,
				state.fixedPositionOnScreen.y,
			);

			renderCanvas(pipWindow, canvas, teleportEffectRef, () => {
				// Update score state immediately
				setScore(getState().score);
				setShowScorePopup(true);
				setTimeout(() => setShowScorePopup(false), 500);

				// Delayed teleport: pet stays in place for TELEPORT_DELAY ms
				setTimeout(() => {
					// Check if PiP window still open
					if (pipWindowRef.current && !pipWindowRef.current.closed) {
						teleportPet();
						setFixedPos({
							x: getState().fixedPositionOnScreen.x,
							y: getState().fixedPositionOnScreen.y,
						});
						// Trigger teleport visual effect
						teleportEffectRef.current = 15;
					}
				}, TELEPORT_DELAY);
			});

			const handleResize = () => {
				const newWidth = pipWindow.innerWidth;
				const newHeight = pipWindow.innerHeight;
				canvas.width = newWidth;
				canvas.height = newHeight;
				resizePipWindow(newWidth, newHeight);
				// Update target to center of resized PiP window
				const state = getState();
				updateTargetPosition(
					state.pipWindow.x + newWidth / 2,
					state.pipWindow.y + newHeight / 2,
				);
			};

			pipWindow.addEventListener("resize", handleResize);

			pipWindow.addEventListener("pagehide", () => {
				if (requestRef.current) {
					cancelAnimationFrame(requestRef.current);
				}
				stopAnimation();
				pipWindowRef.current = null;
				canvasRef.current = null;
				setIsOpen(false);
			});

			setIsOpen(true);
		} else {
			alert("Picture-in-Picture API is not supported in this browser.");
		}
	};

	const handlePinCurrentPosition = useCallback(() => {
		const state = getState();
		setFixedPos({
			x: state.pet.x,
			y: state.pet.y,
		});
		updateFixedPositionOnScreen(state.pet.x, state.pet.y);
	}, []);

	const handleSetFixedPosition = useCallback((x: number, y: number) => {
		setFixedPos({ x, y });
		updateFixedPositionOnScreen(x, y);
	}, []);

	const handleClosePet = useCallback(() => {
		if (pipWindowRef.current) {
			pipWindowRef.current.close();
		}
	}, []);

	useEffect(() => {
		// Sync score from global state
		const state = getState();
		setScore(state.score);
		setFixedPos({
			x: state.fixedPositionOnScreen.x,
			y: state.fixedPositionOnScreen.y,
		});
	}, [isOpen]);

	useEffect(() => {
		return () => {
			if (requestRef.current) {
				cancelAnimationFrame(requestRef.current);
			}
		};
	}, []);

	if (!isOpen) {
		return (
			<>
				<div className="absolute top-2 right-2 flex gap-2">
					<Button
						variant="cyberpunk"
						size="sm"
						onClick={handleOpenPet}
						className="glow-cyan hover:scale-105 transition-transform"
					>
						Play Pet Game
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => setShowInstructions(true)}
						className="border-cyan/30 text-cyan hover:bg-cyan/10 hover:border-cyan"
					>
						?
					</Button>
				</div>
				{showInstructions && (
					<GameInstructionsModal
						open={showInstructions}
						onOpenChange={setShowInstructions}
					/>
				)}
			</>
		);
	}

	return (
		<>
			<div className="absolute top-2 right-2 flex flex-col gap-2 p-4 bg-black/80 border border-cyan/30 rounded-lg shadow-lg backdrop-blur-sm text-cyan">
				{/* Score popup animation */}
				{showScorePopup && (
					<div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-yellow-400 font-bold text-lg animate-bounce">
						+1!
					</div>
				)}

				<div className="flex items-center justify-between mb-2">
					<h3 className="text-sm font-semibold text-cyan glow-cyan">
						Gameplay
					</h3>
					<div className="flex gap-1">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setShowInstructions(true)}
							className="text-cyan/70 hover:text-cyan hover:bg-cyan/10 h-7 w-7"
							title="Instructions"
						>
							?
						</Button>
						<button
							className="text-xs text-cyan hover:text-white"
							onClick={handleClosePet}
						>
							Close
						</button>
					</div>
				</div>

				{/* Score display */}
				<div className="bg-cyan/10 border border-cyan/30 rounded p-2 text-center">
					<p className="text-xs text-cyan/70 uppercase tracking-wider">Score</p>
					<p className="text-2xl font-bold font-mono text-cyan glow-cyan">
						{score}
					</p>
				</div>

				{/* Hackatime hours */}
				<div className="bg-magenta/10 border border-magenta/30 rounded p-2 text-center">
					<p className="text-xs text-magenta/70 uppercase tracking-wider">
						Hackatime
					</p>
					<p className="text-lg font-bold font-mono text-magenta glow-magenta">
						{Math.floor(totalHours / 3600)}h{" "}
						{Math.floor((totalHours % 3600) / 60)}m
					</p>
				</div>

				{/* Position controls */}
				<div className="flex flex-col gap-2 mt-2 pt-2 border-t border-cyan/20">
					<div className="flex items-center gap-2">
						<label className="text-xs text-cyan/70 w-8">X:</label>
						<input
							type="number"
							value={fixedPos.x}
							onChange={(e) =>
								handleSetFixedPosition(Number(e.target.value), fixedPos.y)
							}
							className="w-20 px-2 py-1 text-sm bg-black/50 border border-cyan/30 rounded text-cyan font-mono focus:outline-none focus:border-cyan"
							min="0"
							max={typeof window !== "undefined" ? window.screen.width : 1920}
						/>
					</div>
					<div className="flex items-center gap-2">
						<label className="text-xs text-cyan/70 w-8">Y:</label>
						<input
							type="number"
							value={fixedPos.y}
							onChange={(e) =>
								handleSetFixedPosition(fixedPos.x, Number(e.target.value))
							}
							className="w-20 px-2 py-1 text-sm bg-black/50 border border-cyan/30 rounded text-cyan font-mono focus:outline-none focus:border-cyan"
							min="0"
							max={typeof window !== "undefined" ? window.screen.height : 1080}
						/>
					</div>
				</div>

				{/* Action buttons */}
				<div className="flex gap-2 mt-2">
					<button
						className="flex-1 px-2 py-1 text-xs bg-cyan/20 border border-cyan/30 text-cyan rounded hover:bg-cyan/30 transition-colors"
						onClick={handlePinCurrentPosition}
					>
						Pin Current
					</button>
					<button
						className="flex-1 px-2 py-1 text-xs bg-magenta/20 border border-magenta/30 text-magenta rounded hover:bg-magenta/30 transition-colors"
						onClick={() => {
							resetScore();
							setScore(0);
						}}
					>
						Reset Score
					</button>
				</div>

				<p className="text-xs text-cyan/50 mt-2 text-center">
					Pet stays fixed. Move PiP window to catch it!
				</p>
			</div>
			{showInstructions && (
				<GameInstructionsModal
					open={showInstructions}
					onOpenChange={setShowInstructions}
				/>
			)}
		</>
	);
};

function renderCanvas(
	pipWindow: Window,
	canvas: HTMLCanvasElement,
	teleportEffectRef: { current: number },
	onScoreAndTeleport: () => void,
) {
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	let canvasWidth = canvas.width;
	let canvasHeight = canvas.height;
	let frameCount = 0;
	const PET_COLORS = {
		primary: "#FFB6C1",
		secondary: "#FF69B4",
		earDark: "#DB7093",
		dark: "#2D2D2D",
		eyeWhite: "#FFFFFF",
	};

	const drawHeart = (x: number, y: number, size: number, alpha: number) => {
		ctx.fillStyle = `rgba(255, 105, 180, ${alpha})`;
		ctx.beginPath();
		ctx.moveTo(x, y + size * 0.3);
		ctx.bezierCurveTo(x, y, x - size, y, x - size, y + size * 0.3);
		ctx.bezierCurveTo(x - size, y + size * 0.6, x, y + size * 0.9, x, y + size);
		ctx.bezierCurveTo(
			x,
			y + size * 0.9,
			x + size,
			y + size * 0.6,
			x + size,
			y + size * 0.3,
		);
		ctx.bezierCurveTo(x + size, y, x, y, x, y + size * 0.3);
		ctx.fill();
	};

	const drawSparkle = (x: number, y: number, size: number) => {
		ctx.fillStyle = "white";
		ctx.shadowColor = "white";
		ctx.shadowBlur = 5;
		ctx.beginPath();
		ctx.arc(x, y, size, 0, Math.PI * 2);
		ctx.fill();
		ctx.shadowBlur = 0;

		// Cross
		ctx.strokeStyle = "white";
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(x - size * 2, y);
		ctx.lineTo(x + size * 2, y);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(x, y - size * 2);
		ctx.lineTo(x, y + size * 2);
		ctx.stroke();
	};

	const drawTarget = (
		x: number,
		y: number,
		radius: number,
		active: boolean,
	) => {
		const pulse = active ? 1 + Math.sin(frameCount * 0.1) * 0.2 : 1;
		const outerRadius = radius * pulse;

		// Outer glow ring
		ctx.shadowColor = "#ff0000";
		ctx.shadowBlur = 10;
		ctx.strokeStyle = `rgba(255, 0, 0, ${active ? 0.8 : 0.3})`;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(x, y, outerRadius, 0, Math.PI * 2);
		ctx.stroke();
		ctx.shadowBlur = 0;

		// Inner red dot
		ctx.fillStyle = active ? "#ff0000" : "#660000";
		ctx.beginPath();
		ctx.arc(x, y, radius * 0.3, 0, Math.PI * 2);
		ctx.fill();

		// Crosshair (small plus sign)
		ctx.strokeStyle = active ? "#ff6666" : "#993333";
		ctx.lineWidth = 1;
		const crossSize = radius * 0.5;
		ctx.beginPath();
		ctx.moveTo(x - crossSize, y);
		ctx.lineTo(x + crossSize, y);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(x, y - crossSize);
		ctx.lineTo(x, y + crossSize);
		ctx.stroke();
	};

	const drawPet = (x: number, y: number, scale: number = 1) => {
		const cx = x;
		const cy = y;
		const bodyRx = 35 * scale;
		const bodyRy = 30 * scale;
		frameCount++;

		// Breathing effect
		const breathScale = 1 + Math.sin(frameCount * 0.08) * 0.03;
		const currentBodyRx = bodyRx * breathScale;
		const currentBodyRy = bodyRy * breathScale;

		// Sparkles around pet
		if (frameCount % 15 === 0) {
			for (let s = 0; s < 4; s++) {
				const angle = (frameCount * 0.1 + (s * Math.PI) / 2) % (Math.PI * 2);
				const dist = (40 + Math.sin(frameCount * 0.05 + s) * 5) * scale;
				const sparkleX = cx + Math.cos(angle) * dist;
				const sparkleY = cy + Math.sin(angle) * dist;
				drawSparkle(sparkleX, sparkleY, 1.5 * scale);
			}
		}

		// Floating hearts
		if (frameCount % 30 === 0) {
			for (let h = 0; h < 3; h++) {
				const heartX = cx + Math.sin(frameCount * 0.1 + h) * 30 * scale;
				const heartY = cy - 30 * scale + (frameCount % 20) * 2;
				const heartSize = (3 + Math.random() * 4) * scale;
				drawHeart(heartX, heartY, heartSize, 0.7);
			}
		}

		// Glow effect around pet
		ctx.save();
		ctx.shadowColor = PET_COLORS.secondary;
		ctx.shadowBlur = 15 + Math.sin(frameCount * 0.05) * 5;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.beginPath();
		ctx.ellipse(cx, cy, currentBodyRx, currentBodyRy, 0, 0, Math.PI * 2);
		ctx.fillStyle = "rgba(255, 105, 180, 0.2)";
		ctx.fill();
		ctx.restore();

		// Main body gradient
		const bodyGradient = ctx.createRadialGradient(
			cx - currentBodyRx * 0.3,
			cy - currentBodyRy * 0.3,
			0,
			cx,
			cy,
			currentBodyRx * 1.2,
		);
		bodyGradient.addColorStop(0, "#FFDDFF");
		bodyGradient.addColorStop(0.5, PET_COLORS.primary);
		bodyGradient.addColorStop(1, PET_COLORS.secondary);

		ctx.shadowColor = PET_COLORS.secondary;
		ctx.shadowBlur = 8;
		ctx.shadowOffsetY = 4;

		ctx.beginPath();
		ctx.ellipse(cx, cy, currentBodyRx, currentBodyRy, 0, 0, Math.PI * 2);
		ctx.fillStyle = bodyGradient;
		ctx.fill();

		ctx.shadowColor = "transparent";
		ctx.shadowBlur = 0;
		ctx.shadowOffsetY = 0;

		// Ears with gradient
		const earGradient = ctx.createLinearGradient(
			cx - bodyRx,
			cy - bodyRy,
			cx + bodyRx,
			cy - bodyRy,
		);
		earGradient.addColorStop(0, PET_COLORS.primary);
		earGradient.addColorStop(1, PET_COLORS.earDark);

		// Left ear
		ctx.beginPath();
		ctx.moveTo(cx - 25 * scale, cy - 25 * scale);
		ctx.lineTo(cx - 15 * scale, cy - 45 * scale);
		ctx.lineTo(cx - 5 * scale, cy - 25 * scale);
		ctx.closePath();
		ctx.fillStyle = earGradient;
		ctx.fill();

		// Right ear
		ctx.beginPath();
		ctx.moveTo(cx + 5 * scale, cy - 25 * scale);
		ctx.lineTo(cx + 15 * scale, cy - 45 * scale);
		ctx.lineTo(cx + 25 * scale, cy - 25 * scale);
		ctx.closePath();
		ctx.fillStyle = earGradient;
		ctx.fill();

		// Inner ears
		const innerEarGradient = ctx.createLinearGradient(
			cx - bodyRx,
			cy - bodyRy,
			cx + bodyRx,
			cy - bodyRy,
		);
		innerEarGradient.addColorStop(0, "#FFB6C1");
		innerEarGradient.addColorStop(1, "#FF69B1");

		ctx.fillStyle = innerEarGradient;
		ctx.beginPath();
		ctx.moveTo(cx - 20 * scale, cy - 25 * scale);
		ctx.lineTo(cx - 15 * scale, cy - 40 * scale);
		ctx.lineTo(cx - 10 * scale, cy - 25 * scale);
		ctx.closePath();
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(cx + 10 * scale, cy - 25 * scale);
		ctx.lineTo(cx + 15 * scale, cy - 40 * scale);
		ctx.lineTo(cx + 20 * scale, cy - 25 * scale);
		ctx.closePath();
		ctx.fill();

		// Eyes with shine
		const eyeRx = 10 * scale;
		const eyeRy = 10 * scale;
		const leftEyeX = cx - 20 * scale;
		const rightEyeX = cx + 20 * scale;
		const eyeY = cy - 15 * scale;

		// Eye white with subtle glow
		ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
		ctx.shadowBlur = 5;
		ctx.fillStyle = PET_COLORS.eyeWhite;
		ctx.beginPath();
		ctx.ellipse(leftEyeX, eyeY, eyeRx, eyeRy, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.beginPath();
		ctx.ellipse(rightEyeX, eyeY, eyeRx, eyeRy, 0, 0, Math.PI * 2);
		ctx.fill();

		ctx.shadowColor = "transparent";
		ctx.shadowBlur = 0;

		// Pupils
		const pupilRx = 5 * scale;
		const pupilRy = 5 * scale;
		ctx.fillStyle = PET_COLORS.dark;
		ctx.beginPath();
		ctx.ellipse(
			leftEyeX + 2 * scale,
			eyeY,
			pupilRx,
			pupilRy,
			0,
			0,
			Math.PI * 2,
		);
		ctx.fill();
		ctx.beginPath();
		ctx.ellipse(
			rightEyeX + 2 * scale,
			eyeY,
			pupilRx,
			pupilRy,
			0,
			0,
			Math.PI * 2,
		);
		ctx.fill();

		// Eye reflections (sparkle)
		ctx.fillStyle = "white";
		ctx.beginPath();
		ctx.arc(
			leftEyeX + 4 * scale,
			eyeY - 2 * scale,
			2.5 * scale,
			0,
			Math.PI * 2,
		);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(
			rightEyeX + 4 * scale,
			eyeY - 2 * scale,
			2.5 * scale,
			0,
			Math.PI * 2,
		);
		ctx.fill();

		// Nose
		ctx.fillStyle = PET_COLORS.earDark;
		ctx.beginPath();
		ctx.ellipse(
			cx,
			cy + 5 * scale,
			4.5 * scale,
			3.5 * scale,
			0,
			0,
			Math.PI * 2,
		);
		ctx.fill();

		// Mouth
		ctx.beginPath();
		ctx.moveTo(cx - 15 * scale, cy + 12 * scale);
		ctx.quadraticCurveTo(cx, cy + 20 * scale, cx + 15 * scale, cy + 12 * scale);
		ctx.strokeStyle = PET_COLORS.earDark;
		ctx.lineWidth = 2.5 * scale;
		ctx.stroke();

		// Blush
		ctx.fillStyle = "rgba(255, 182, 193, 0.7)";
		ctx.beginPath();
		ctx.ellipse(
			cx - 28 * scale,
			cy + 5 * scale,
			7 * scale,
			5 * scale,
			0,
			0,
			Math.PI * 2,
		);
		ctx.fill();
		ctx.beginPath();
		ctx.ellipse(
			cx + 28 * scale,
			cy + 5 * scale,
			7 * scale,
			5 * scale,
			0,
			0,
			Math.PI * 2,
		);
		ctx.fill();

		// Tail with wave effect
		const tailWave = Math.sin(frameCount * 0.1) * 3 * scale;
		ctx.strokeStyle = PET_COLORS.secondary;
		ctx.lineWidth = 3 * scale;
		ctx.lineCap = "round";
		ctx.beginPath();
		ctx.moveTo(cx + 30 * scale, cy);
		ctx.quadraticCurveTo(
			cx + 45 * scale,
			cy - 20 * scale + tailWave,
			cx + 50 * scale,
			cy - 35 * scale + tailWave,
		);
		ctx.stroke();

		// Little paws
		ctx.fillStyle = PET_COLORS.earDark;
		ctx.beginPath();
		ctx.ellipse(
			cx - 20 * scale,
			cy + 28 * scale,
			5 * scale,
			3 * scale,
			0,
			0,
			Math.PI * 2,
		);
		ctx.fill();
		ctx.beginPath();
		ctx.ellipse(
			cx + 20 * scale,
			cy + 28 * scale,
			5 * scale,
			3 * scale,
			0,
			0,
			Math.PI * 2,
		);
		ctx.fill();
	};

	const drawDirectionArrow = (angle: number, size: number) => {
		ctx.save();
		ctx.translate(canvasWidth / 2, canvasHeight / 2);
		ctx.rotate(angle);

		const arrowDist = Math.min(canvasWidth, canvasHeight) / 2 - size - 10;
		ctx.translate(arrowDist, 0);

		// Glow effect
		ctx.shadowColor = "#00ffff";
		ctx.shadowBlur = 15;
		ctx.fillStyle = "#00ffff";
		ctx.strokeStyle = "#00cccc";
		ctx.lineWidth = 2;

		ctx.beginPath();
		ctx.moveTo(size, 0);
		ctx.lineTo(-size / 2, -size / 2);
		ctx.lineTo(-size / 4, 0);
		ctx.lineTo(-size / 2, size / 2);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

		// Additional ring around arrow
		ctx.beginPath();
		ctx.arc(0, 0, size * 1.5, 0, Math.PI * 2);
		ctx.strokeStyle = "rgba(0, 255, 255, 0.3)";
		ctx.lineWidth = 1;
		ctx.stroke();

		ctx.restore();
	};

	const ARROW_SIZE = 20;

	const render = () => {
		if (pipWindow.closed) return;

		canvasWidth = canvas.width;
		canvasHeight = canvas.height;

		const state = petWorldState;
		const localX = state.pet.x - state.pipWindow.x;
		const localY = state.pet.y - state.pipWindow.y;

		// Target position in local canvas coordinates
		const targetLocalX = state.target.x - state.pipWindow.x;
		const targetLocalY = state.target.y - state.pipWindow.y;

		const isVisible =
			localX >= -40 &&
			localX <= canvasWidth + 40 &&
			localY >= -40 &&
			localY <= canvasHeight + 40;

		const isOnTarget = isPetOnTarget();

		// Scoring: trigger when pet becomes visible AND is on the target (within radius)
		if (isVisible && isOnTarget && !state.lastPetOnTarget) {
			incrementScore(1);
			setLastPetOnTarget(true);
			// Keep target centered on PiP window after scoring
			updateTargetPosition(
				state.pipWindow.x + state.pipWindow.width / 2,
				state.pipWindow.y + state.pipWindow.height / 2,
			);
			onScoreAndTeleport();
		} else if (!isVisible || !isOnTarget) {
			// Reset flag when pet leaves target or goes off-screen
			if (state.lastPetOnTarget) {
				setLastPetOnTarget(false);
			}
		}

		// Dark background
		ctx.fillStyle = "#111827";
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);

		// Scanline effect
		const scanlineY = (frameCount * 0.5) % canvasHeight;
		ctx.strokeStyle = "rgba(0, 255, 255, 0.05)";
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(0, scanlineY);
		ctx.lineTo(canvasWidth, scanlineY);
		ctx.stroke();

		// Grid lines
		ctx.strokeStyle = "rgba(255, 0, 255, 0.03)";
		ctx.lineWidth = 1;
		const gridSize = 20;
		for (let x = 0; x < canvasWidth; x += gridSize) {
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, canvasHeight);
			ctx.stroke();
		}
		for (let y = 0; y < canvasHeight; y += gridSize) {
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(canvasWidth, y);
			ctx.stroke();
		}

		// Draw particles
		const particles = 5;
		for (let i = 0; i < particles; i++) {
			const px = (Math.sin(frameCount * 0.01 + i) * 0.5 + 0.5) * canvasWidth;
			const py =
				(Math.cos(frameCount * 0.01 + i * 2) * 0.5 + 0.5) * canvasHeight;
			const size = 2 + Math.sin(frameCount * 0.05 + i) * 1;
			ctx.fillStyle = "rgba(0, 255, 255, 0.3)";
			ctx.beginPath();
			ctx.arc(px, py, size, 0, Math.PI * 2);
			ctx.fill();
		}

		// Draw target (red dot) on screen
		if (state.target.active) {
			drawTarget(
				targetLocalX,
				targetLocalY,
				state.target.radius,
				state.target.active,
			);
		}

		// Teleport burst effect (when pet teleports)
		if (teleportEffectRef.current > 0) {
			const burstProgress = 1 - teleportEffectRef.current / 15;
			const maxRadius = 100;
			const rings = 3;
			for (let r = 0; r < rings; r++) {
				const ringProgress = (burstProgress * 2 + r * 0.3) % 1;
				const radius = ringProgress * maxRadius;
				const alpha = 1 - ringProgress;
				ctx.strokeStyle = `rgba(255, 105, 180, ${alpha * 0.8})`;
				ctx.lineWidth = 3;
				ctx.beginPath();
				ctx.arc(localX, localY, radius, 0, Math.PI * 2);
				ctx.stroke();
			}
			// Sparkle burst
			for (let s = 0; s < 8; s++) {
				const angle = (frameCount * 0.2 + (s * Math.PI) / 4) % (Math.PI * 2);
				const dist = 30 + burstProgress * 40;
				const sx = localX + Math.cos(angle) * dist;
				const sy = localY + Math.sin(angle) * dist;
				ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
				ctx.beginPath();
				ctx.arc(sx, sy, 2, 0, Math.PI * 2);
				ctx.fill();
			}
			teleportEffectRef.current--;
		}

		if (isVisible) {
			drawPet(localX, localY, 0.5);
		} else {
			const globalAngle = Math.atan2(
				state.pet.y - state.pipWindow.y,
				state.pet.x - state.pipWindow.x,
			);
			drawDirectionArrow(globalAngle, ARROW_SIZE);
		}

		frameCount++;
		requestAnimationFrame(render);
	};

	render();
}
