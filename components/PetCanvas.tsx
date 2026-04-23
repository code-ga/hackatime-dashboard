"use client";

import { useEffect, useRef } from "react";
import { petWorldState } from "@/lib/pet-world";
import { ARROW_SIZE_CONST } from "@/lib/pet-animation";

interface PetCanvasProps {
	width: number;
	height: number;
}

export function PetCanvas({ width, height }: PetCanvasProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let animationId: number;

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

			const earSize = 15 * scale;
			const earLeft: [number, number, number][] = [
				[cx - 25 * scale, cy - 25 * scale, 0],
				[cx - 15 * scale, cy - 45 * scale, 0],
				[cx - 5 * scale, cy - 25 * scale, 0],
			];
			const earRight: [number, number, number][] = [
				[cx + 5 * scale, cy - 25 * scale, 0],
				[cx + 15 * scale, cy - 45 * scale, 0],
				[cx + 25 * scale, cy - 25 * scale, 0],
			];

			drawTriangle(ctx, earLeft[0], earLeft[1], earLeft[2], earGradient);
			drawTriangle(ctx, earRight[0], earRight[1], earRight[2], earGradient);

			const innerEarLeft: [number, number, number][] = [
				[cx - 20 * scale, cy - 25 * scale, 0],
				[cx - 15 * scale, cy - 40 * scale, 0],
				[cx - 10 * scale, cy - 25 * scale, 0],
			];
			const innerEarRight: [number, number, number][] = [
				[cx + 10 * scale, cy - 25 * scale, 0],
				[cx + 15 * scale, cy - 40 * scale, 0],
				[cx + 20 * scale, cy - 25 * scale, 0],
			];

			drawTriangle(
				ctx,
				innerEarLeft[0],
				innerEarLeft[1],
				innerEarLeft[2],
				"#FF69B4",
			);
			drawTriangle(
				ctx,
				innerEarRight[0],
				innerEarRight[1],
				innerEarRight[2],
				"#FF69B4",
			);

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

			const highlightRx = 2 * scale;
			ctx.fillStyle = "white";
			ctx.beginPath();
			ctx.arc(
				leftEyeX + 4 * scale,
				eyeY - 2 * scale,
				highlightRx,
				0,
				Math.PI * 2,
			);
			ctx.fill();
			ctx.beginPath();
			ctx.arc(
				rightEyeX + 4 * scale,
				eyeY - 2 * scale,
				highlightRx,
				0,
				Math.PI * 2,
			);
			ctx.fill();

			const mouthX = cx;
			const mouthY = cy + 5 * scale;
			ctx.beginPath();
			ctx.ellipse(mouthX, mouthY, 4 * scale, 3 * scale, 0, 0, Math.PI * 2);
			ctx.fillStyle = "#DB7093";
			ctx.fill();

			ctx.beginPath();
			ctx.moveTo(cx - 15 * scale, mouthY + 7 * scale);
			ctx.quadraticCurveTo(
				cx,
				mouthY + 15 * scale,
				cx + 15 * scale,
				mouthY + 7 * scale,
			);
			ctx.strokeStyle = "#DB7093";
			ctx.lineWidth = 2 * scale;
			ctx.stroke();

			const blushRx = 6 * scale;
			const blushRy = 4 * scale;
			ctx.fillStyle = "rgba(255, 182, 193, 0.6)";
			ctx.beginPath();
			ctx.ellipse(
				cx - 28 * scale,
				cy + 5 * scale,
				blushRx,
				blushRy,
				0,
				0,
				Math.PI * 2,
			);
			ctx.fill();
			ctx.beginPath();
			ctx.ellipse(
				cx + 28 * scale,
				cy + 5 * scale,
				blushRx,
				blushRy,
				0,
				0,
				Math.PI * 2,
			);
			ctx.fill();

			ctx.fillStyle = "rgba(255, 105, 180, 0.3)";
			ctx.beginPath();
			ctx.ellipse(
				cx,
				cy + 25 * scale,
				20 * scale,
				4 * scale,
				0,
				0,
				Math.PI * 2,
			);
			ctx.fill();
		};

		const drawDirectionArrow = (angle: number, size: number) => {
			ctx.save();
			ctx.translate(width / 2, height / 2);
			ctx.rotate(angle);

			const arrowDist = Math.min(width, height) / 2 - size - 10;
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

		const render = () => {
			const { pet, pipWindow } = petWorldState;

			const localX = pet.x - pipWindow.x;
			const localY = pet.y - pipWindow.y;

			const isVisible =
				localX >= -40 &&
				localX <= width + 40 &&
				localY >= -40 &&
				localY <= height + 40;

			ctx.fillStyle = "#111827";
			ctx.fillRect(0, 0, width, height);

			if (isVisible) {
				drawPet(localX, localY, 0.5);
			} else {
				const globalAngle = Math.atan2(
					pet.y - pipWindow.y,
					pet.x - pipWindow.x,
				);
				drawDirectionArrow(globalAngle, ARROW_SIZE_CONST);
			}

			animationId = requestAnimationFrame(render);
		};

		render();

		return () => {
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
		};
	}, [width, height]);

	return (
		<canvas
			ref={canvasRef}
			width={width}
			height={height}
			style={{ display: "block" }}
		/>
	);
}

function drawTriangle(
	ctx: CanvasRenderingContext2D,
	p1: [number, number, number],
	p2: [number, number, number],
	p3: [number, number, number],
	fill: string | CanvasGradient,
) {
	ctx.beginPath();
	ctx.moveTo(p1[0], p1[1]);
	ctx.lineTo(p2[0], p2[1]);
	ctx.lineTo(p3[0], p3[1]);
	ctx.closePath();
	ctx.fillStyle = fill;
	ctx.fill();
}
