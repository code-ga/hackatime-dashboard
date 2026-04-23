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
	lastPetVisible: boolean;
}

function getScreenDimensions() {
	if (typeof screen !== "undefined") {
		return { width: screen.width, height: screen.height };
	}
	return { width: 1920, height: 1080 };
}

export const petWorldState: PetWorldState = {
	pet: {
		x: Math.random() * getScreenDimensions().width,
		y: Math.random() * getScreenDimensions().height,
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
	lastPetVisible: false,
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
	const newX = Math.random() * (screen.width - 80) + 40;
	const newY = Math.random() * (screen.height - 80) + 40;
	updateFixedPositionOnScreen(newX, newY);
	updatePetPosition(newX, newY, 0, 0);
}

export function incrementScore(points: number = 1) {
	petWorldState.score += points;
}

export function resetScore() {
	petWorldState.score = 0;
	petWorldState.lastPetVisible = false;
}

export function setLastPetVisible(visible: boolean) {
	petWorldState.lastPetVisible = visible;
}

export function getState(): PetWorldState {
	return petWorldState;
}
