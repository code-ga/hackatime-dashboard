"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
	startAnimation,
	stopAnimation,
	updatePipPosition,
	resizePipWindow,
	getPipSize,
} from "@/lib/pet-animation";
import { updateFixedPositionOnScreen, getState } from "@/lib/pet-world";

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

export const PetPiP = () => {
	const requestRef = useRef<number | null>(null);
	const pipWindowRef = useRef<Window | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const positionRef = useRef({ x: 0, y: 0 });
	const [fixedPos, setFixedPos] = useState({ x: 0, y: 0 });
	const [isOpen, setIsOpen] = useState(false);

	const trackMovement = useCallback(() => {
		const pipWindow = pipWindowRef.current;
		if (!pipWindow) return;

		const { screenX, screenY } = pipWindow;
		const prev = positionRef.current;

		if (screenX !== prev.x || screenY !== prev.y) {
			positionRef.current = { x: screenX, y: screenY };
			updatePipPosition(screenX, screenY);
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

					for (let rule of cssRules) {
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

			renderCanvas(pipWindow, canvas);

			const handleResize = () => {
				const newWidth = pipWindow.innerWidth;
				const newHeight = pipWindow.innerHeight;
				canvas.width = newWidth;
				canvas.height = newHeight;
				resizePipWindow(newWidth, newHeight);
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
		return () => {
			if (requestRef.current) {
				cancelAnimationFrame(requestRef.current);
			}
		};
	}, []);

	if (!isOpen) {
		return (
			<button
				className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
				onClick={handleOpenPet}
			>
				Open Pet
			</button>
		);
	}

	return (
		<div className="absolute top-2 right-2 flex flex-col gap-2 p-4 bg-white rounded-lg shadow-lg border border-gray-200">
			<div className="flex items-center justify-between mb-2">
				<h3 className="text-sm font-semibold text-gray-700">Pet Position</h3>
				<button
					className="text-xs text-blue-500 hover:text-blue-700"
					onClick={handleClosePet}
				>
					Close
				</button>
			</div>

			<div className="flex flex-col gap-2">
				<div className="flex items-center gap-2">
					<label className="text-xs text-gray-600 w-8">X:</label>
					<input
						type="number"
						value={fixedPos.x}
						onChange={(e) =>
							handleSetFixedPosition(Number(e.target.value), fixedPos.y)
						}
						className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
						min="0"
						max={typeof window !== "undefined" ? window.screen.width : 1920}
					/>
				</div>
				<div className="flex items-center gap-2">
					<label className="text-xs text-gray-600 w-8">Y:</label>
					<input
						type="number"
						value={fixedPos.y}
						onChange={(e) =>
							handleSetFixedPosition(fixedPos.x, Number(e.target.value))
						}
						className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
						min="0"
						max={typeof window !== "undefined" ? window.screen.height : 1080}
					/>
				</div>
			</div>

			<button
				className="mt-2 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
				onClick={handlePinCurrentPosition}
			>
				Pin at Current Pet Position
			</button>

			<p className="text-xs text-gray-500 mt-2">
				Pet stays at fixed screen position. Move PiP window to see effect.
			</p>
		</div>
	);
};

function renderCanvas(pipWindow: Window, canvas: HTMLCanvasElement) {
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	let animationId: number;
	let canvasWidth = canvas.width;
	let canvasHeight = canvas.height;

	const drawPet = (x: number, y: number, scale: number = 1) => {
		const cx = x;
		const cy = y;
		const bodyRx = 35 * scale;
		const bodyRy = 30 * scale;

		const gradient = ctx.createLinearGradient(
			cx - bodyRx,
			cy - bodyRy,
			cx + bodyRx,
			cy + bodyRy,
		);
		gradient.addColorStop(0, "#FFB6C1");
		gradient.addColorStop(1, "#FF69B4");

		ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
		ctx.shadowBlur = 3;
		ctx.shadowOffsetY = 4;

		ctx.beginPath();
		ctx.ellipse(cx, cy, bodyRx, bodyRy, 0, 0, Math.PI * 2);
		ctx.fillStyle = gradient;
		ctx.fill();

		ctx.shadowColor = "transparent";
		ctx.shadowBlur = 0;
		ctx.shadowOffsetY = 0;

		const earGradient = ctx.createLinearGradient(
			cx - bodyRx,
			cy - bodyRy,
			cx + bodyRx,
			cy + bodyRy,
		);
		earGradient.addColorStop(0, "#FFB6C1");
		earGradient.addColorStop(1, "#DB7093");

		ctx.beginPath();
		ctx.moveTo(cx - 25 * scale, cy - 25 * scale);
		ctx.lineTo(cx - 15 * scale, cy - 45 * scale);
		ctx.lineTo(cx - 5 * scale, cy - 25 * scale);
		ctx.closePath();
		ctx.fillStyle = earGradient;
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(cx + 5 * scale, cy - 25 * scale);
		ctx.lineTo(cx + 15 * scale, cy - 45 * scale);
		ctx.lineTo(cx + 25 * scale, cy - 25 * scale);
		ctx.closePath();
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(cx - 20 * scale, cy - 25 * scale);
		ctx.lineTo(cx - 15 * scale, cy - 40 * scale);
		ctx.lineTo(cx - 10 * scale, cy - 25 * scale);
		ctx.closePath();
		ctx.fillStyle = "#FF69B4";
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(cx + 10 * scale, cy - 25 * scale);
		ctx.lineTo(cx + 15 * scale, cy - 40 * scale);
		ctx.lineTo(cx + 20 * scale, cy - 25 * scale);
		ctx.closePath();
		ctx.fill();

		const eyeRx = 10 * scale;
		const eyeRy = 10 * scale;
		const leftEyeX = cx - 20 * scale;
		const rightEyeX = cx + 20 * scale;
		const eyeY = cy - 15 * scale;

		ctx.fillStyle = "white";
		ctx.beginPath();
		ctx.ellipse(leftEyeX, eyeY, eyeRx, eyeRy, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.beginPath();
		ctx.ellipse(rightEyeX, eyeY, eyeRx, eyeRy, 0, 0, Math.PI * 2);
		ctx.fill();

		const pupilRx = 5 * scale;
		const pupilRy = 5 * scale;
		ctx.fillStyle = "#2D2D2D";
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

		ctx.fillStyle = "white";
		ctx.beginPath();
		ctx.arc(leftEyeX + 4 * scale, eyeY - 2 * scale, 2 * scale, 0, Math.PI * 2);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(rightEyeX + 4 * scale, eyeY - 2 * scale, 2 * scale, 0, Math.PI * 2);
		ctx.fill();

		ctx.beginPath();
		ctx.ellipse(cx, cy + 5 * scale, 4 * scale, 3 * scale, 0, 0, Math.PI * 2);
		ctx.fillStyle = "#DB7093";
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(cx - 15 * scale, cy + 12 * scale);
		ctx.quadraticCurveTo(cx, cy + 20 * scale, cx + 15 * scale, cy + 12 * scale);
		ctx.strokeStyle = "#DB7093";
		ctx.lineWidth = 2 * scale;
		ctx.stroke();

		ctx.fillStyle = "rgba(255, 182, 193, 0.6)";
		ctx.beginPath();
		ctx.ellipse(
			cx - 28 * scale,
			cy + 5 * scale,
			6 * scale,
			4 * scale,
			0,
			0,
			Math.PI * 2,
		);
		ctx.fill();
		ctx.beginPath();
		ctx.ellipse(
			cx + 28 * scale,
			cy + 5 * scale,
			6 * scale,
			4 * scale,
			0,
			0,
			Math.PI * 2,
		);
		ctx.fill();

		ctx.fillStyle = "rgba(255, 105, 180, 0.3)";
		ctx.beginPath();
		ctx.ellipse(cx, cy + 25 * scale, 20 * scale, 4 * scale, 0, 0, Math.PI * 2);
		ctx.fill();
	};

	const drawDirectionArrow = (angle: number, size: number) => {
		ctx.save();
		ctx.translate(canvasWidth / 2, canvasHeight / 2);
		ctx.rotate(angle);

		const arrowDist = Math.min(canvasWidth, canvasHeight) / 2 - size - 10;
		ctx.translate(arrowDist, 0);

		ctx.fillStyle = "#00ffff";
		ctx.shadowColor = "#00ffff";
		ctx.shadowBlur = 10;

		ctx.beginPath();
		ctx.moveTo(size, 0);
		ctx.lineTo(-size / 2, -size / 2);
		ctx.lineTo(-size / 4, 0);
		ctx.lineTo(-size / 2, size / 2);
		ctx.closePath();
		ctx.fill();

		ctx.restore();
	};

	const { petWorldState } = require("@/lib/pet-world");
	const ARROW_SIZE = 20;

	const render = () => {
		if (pipWindow.closed) return;

		canvasWidth = canvas.width;
		canvasHeight = canvas.height;

		const state = petWorldState;
		const localX = state.pet.x - state.pipWindow.x;
		const localY = state.pet.y - state.pipWindow.y;

		const isVisible =
			localX >= -40 &&
			localX <= canvasWidth + 40 &&
			localY >= -40 &&
			localY <= canvasHeight + 40;

		ctx.fillStyle = "#111827";
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);

		if (isVisible) {
			drawPet(localX, localY, 0.5);
		} else {
			const globalAngle = Math.atan2(
				state.pet.y - state.pipWindow.y,
				state.pet.x - state.pipWindow.x,
			);
			drawDirectionArrow(globalAngle, ARROW_SIZE);
		}

		animationId = requestAnimationFrame(render);
	};

	render();
}
