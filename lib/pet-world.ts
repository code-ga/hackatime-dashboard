export interface PetWorldState {
	pet: {
		x: number;
		y: number;
		velocityX: number;
		velocityY: number;
	};
	pipWindow: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
	pipVelocity: {
		x: number;
		y: number;
	};
	screen: {
		width: number;
		height: number;
	};
	fixedPositionOnScreen: {
		x: number;
		y: number;
	};
	score: number;
	lastPetOnTarget: boolean;
	target: {
		x: number;
		y: number;
		radius: number;
		active: boolean;
	};
}

function getScreenDimensions() {
	if (typeof screen !== "undefined") {
		return { width: screen.width, height: screen.height };
	}
	return { width: 1920, height: 1080 };
}

function getInitialPetPosition() {
	const screen = getScreenDimensions();
	const marginX = 150;
	const marginY = 100;
	return {
		x: Math.random() * (screen.width - 2 * marginX) + marginX,
		y: Math.random() * (screen.height - 2 * marginY) + marginY,
	};
}

export const petWorldState: PetWorldState = {
	pet: {
		...getInitialPetPosition(),
		velocityX: 0,
		velocityY: 0,
	},
	pipWindow: {
		x: 0,
		y: 0,
		width: 300,
		height: 200,
	},
	pipVelocity: {
		x: 0,
		y: 0,
	},
	screen: getScreenDimensions(),
	fixedPositionOnScreen: {
		x: getScreenDimensions().width / 2,
		y: getScreenDimensions().height / 2,
	},
	score: 0,
	lastPetOnTarget: false,
	target: {
		x: Math.random() * (getScreenDimensions().width - 100) + 50,
		y: Math.random() * (getScreenDimensions().height - 100) + 50,
		radius: 35,
		active: true,
	},
};

export function updatePetPosition(
	x: number,
	y: number,
	velocityX: number,
	velocityY: number,
) {
	petWorldState.pet.x = x;
	petWorldState.pet.y = y;
	petWorldState.pet.velocityX = velocityX;
	petWorldState.pet.velocityY = velocityY;
}

export function updatePipWindow(
	x: number,
	y: number,
	width: number,
	height: number,
) {
	petWorldState.pipWindow.x = x;
	petWorldState.pipWindow.y = y;
	petWorldState.pipWindow.width = width;
	petWorldState.pipWindow.height = height;
}

export function updatePipVelocity(x: number, y: number) {
	petWorldState.pipVelocity.x = x;
	petWorldState.pipVelocity.y = y;
}

export function updateScreenDimensions(width: number, height: number) {
	petWorldState.screen.width = width;
	petWorldState.screen.height = height;
}

export function updateFixedPositionOnScreen(x: number, y: number) {
	petWorldState.fixedPositionOnScreen.x = x;
	petWorldState.fixedPositionOnScreen.y = y;
}

export function teleportPet() {
	const screen = getScreenDimensions();
	// Adjust bounds to ensure PiP window can center on pet without going off-screen
	// PiP is 300x200, so center at 150x100 from edges
	const marginX = 150;
	const marginY = 100;
	const newX = Math.random() * (screen.width - 2 * marginX) + marginX;
	const newY = Math.random() * (screen.height - 2 * marginY) + marginY;
	updateFixedPositionOnScreen(newX, newY);
	updatePetPosition(newX, newY, 0, 0);
}

export function updateTargetPosition(x: number, y: number) {
	petWorldState.target.x = x;
	petWorldState.target.y = y;
}

export function moveTargetToRandom() {
	const screen = getScreenDimensions();
	const newX = Math.random() * (screen.width - 100) + 50;
	const newY = Math.random() * (screen.height - 100) + 50;
	petWorldState.target.x = newX;
	petWorldState.target.y = newY;
}

export function setTargetActive(active: boolean) {
	petWorldState.target.active = active;
}

export function isPetOnTarget(): boolean {
	const { pet, target } = petWorldState;
	const dx = pet.x - target.x;
	const dy = pet.y - target.y;
	const distance = Math.sqrt(dx * dx + dy * dy);
	return distance <= target.radius;
}

export function incrementScore(points: number = 1) {
	petWorldState.score += points;
}

export function resetScore() {
	petWorldState.score = 0;
	petWorldState.lastPetOnTarget = false;
}

export function setLastPetOnTarget(onTarget: boolean) {
	petWorldState.lastPetOnTarget = onTarget;
}

export function getState(): PetWorldState {
	return petWorldState;
}
