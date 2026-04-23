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

export function getState(): PetWorldState {
	return petWorldState;
}
