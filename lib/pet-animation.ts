import {
	petWorldState,
	updatePetPosition,
	updatePipWindow,
	updatePipVelocity,
	updateScreenDimensions,
	updateFixedPositionOnScreen,
} from "./pet-world";

const ARROW_SIZE = 20;
const MIN_PIP_WIDTH = 200;
const MIN_PIP_HEIGHT = 150;

let lastPipX = 0;
let lastPipY = 0;
let lastTime = 0;
let animationId: number | null = null;
let pipWidth = 300;
let pipHeight = 200;

function getMaxScreen() {
	return {
		x: petWorldState.screen.width,
		y: petWorldState.screen.height,
	};
}

export function startAnimation(
	pipX: number,
	pipY: number,
	pipW: number,
	pipH: number,
	customFixedX?: number,
	customFixedY?: number,
) {
	pipWidth = pipW;
	pipHeight = pipH;
	updatePipWindow(pipX, pipY, pipW, pipH);
	lastPipX = pipX;
	lastPipY = pipY;

	// Set fixed pet position to center of screen or custom position
	const max = getMaxScreen();
	const fixedX = customFixedX ?? max.x / 2;
	const fixedY = customFixedY ?? max.y / 2;
	updateFixedPositionOnScreen(fixedX, fixedY);

	updateScreenDimensions(window.innerWidth, window.innerHeight);

	const handleScreenResize = () => {
		updateScreenDimensions(window.innerWidth, window.innerHeight);
	};
	window.addEventListener("resize", handleScreenResize);

	const loop = (time: number) => {
		// Keep pet at fixed position - no wandering or physics
		const { pipWindow, pipVelocity } = petWorldState;
		const { x: fixedX, y: fixedY } = petWorldState.fixedPositionOnScreen;
		updatePetPosition(fixedX, fixedY, 0, 0);
		updatePipVelocity(0, 0);

		animationId = requestAnimationFrame(loop);
	};

	animationId = requestAnimationFrame(loop);
}

export function resizePipWindow(newWidth: number, newHeight: number) {
	pipWidth = Math.max(MIN_PIP_WIDTH, newWidth);
	pipHeight = Math.max(MIN_PIP_HEIGHT, newHeight);
	updatePipWindow(
		petWorldState.pipWindow.x,
		petWorldState.pipWindow.y,
		pipWidth,
		pipHeight,
	);
}

export function getPipSize(): { width: number; height: number } {
	return { width: pipWidth, height: pipHeight };
}

export function stopAnimation() {
	if (animationId !== null) {
		cancelAnimationFrame(animationId);
		animationId = null;
	}
	lastTime = 0;
}

export function updatePipPosition(x: number, y: number) {
	updatePipWindow(
		x,
		y,
		petWorldState.pipWindow.width,
		petWorldState.pipWindow.height,
	);
}

export const ARROW_SIZE_CONST = ARROW_SIZE;
