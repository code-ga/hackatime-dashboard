"use client";

import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { PetSvg } from "./PetSvg";

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

// this will render the pet in picture in picture mode, it will be a small window that can be moved around the screen and will always stay on top of other windows
export const PetPiP = () => {
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const requestRef = useRef<number | null>(null);
	const pipWindowRef = useRef<Window | null>(null);

	const handleOpenPet = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if ("documentPictureInPicture" in window) {
			// Use the API
			const pipWindow: Window =
				await window.documentPictureInPicture.requestWindow({
					width: 300,
					height: 200,
					preferInitialWindowPlacement: true,
				});
			pipWindowRef.current = pipWindow;
			setPosition({ x: pipWindow.screenX, y: pipWindow.screenY });

			// Create container inside PiP
			const container = pipWindow.document.createElement("div");
			pipWindow.document.body.appendChild(container);
			// Copy styles from main document
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

			// Start the movement tracking loop
			const trackMovement = () => {
				if (
					pipWindow.screenX !== position.x ||
					pipWindow.screenY !== position.y
				) {
					setPosition({ x: pipWindow.screenX, y: pipWindow.screenY });
				}

				if (!pipWindow.closed) {
					requestRef.current = requestAnimationFrame(trackMovement);
				}
			};

			requestRef.current = requestAnimationFrame(trackMovement);

			// Handle window closing
			pipWindow.addEventListener("pagehide", () => {
				if (requestRef.current) {
					cancelAnimationFrame(requestRef.current);
				}
				pipWindowRef.current = null;
			});

			// Mount React into PiP
			const root = createRoot(container);
			root.render(<PiPContent />);
		} else {
			alert("Picture-in-Picture API is not supported in this browser.");
		}
	};

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (requestRef.current) {
				cancelAnimationFrame(requestRef.current);
			}
		};
	}, []);

	console.log("PiP position:", position);

	return (
		<div>
			<button
				className="absolute top-2 right-2 text-gray-500 hover:text-gray-7000"
				onClick={handleOpenPet}
			>
				&times; Open Pet
			</button>
		</div>
	);
};

// This is the content that will be rendered inside the PiP window
function PiPContent() {
	return (
		<div className="w-full h-full flex items-center justify-center bg-black shadow-lg">
			{/* <img src="/pet.gif" alt="Pet" className="w-32 h-32 object-contain" /> */}
			<div className=" bg-gray-900 rounded-full flex items-center justify-center">
				<PetSvg></PetSvg>
			</div>
		</div>
	);
}
