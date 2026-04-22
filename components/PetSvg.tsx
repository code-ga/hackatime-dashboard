"use client";

import { useState, useEffect } from "react";

interface PetSvgProps {
	width?: number;
	height?: number;
	className?: string;
}

type PetState = "sleeping" | "waking" | "talking" | "idle";

export const PetSvg = ({
	width = 120,
	height = 120,
	className,
}: PetSvgProps) => {
	const [state, setState] = useState<PetState>("idle");
	const [eyeHeight, setEyeHeight] = useState(12);
	const [mouthOpen, setMouthOpen] = useState(0);
	const [isWaking, setIsWaking] = useState(false);

	useEffect(() => {
		if (state === "sleeping") {
			setEyeHeight(2);
			setMouthOpen(0);
		} else if (state === "waking") {
			setIsWaking(true);
			setEyeHeight(2);
			const wakeInterval = setInterval(() => {
				setEyeHeight((prev) => (prev === 2 ? 12 : 2));
			}, 150);
			setTimeout(() => {
				clearInterval(wakeInterval);
				setEyeHeight(12);
				setIsWaking(false);
				setState("idle");
			}, 600);
			return () => clearInterval(wakeInterval);
		} else if (state === "talking") {
			setMouthOpen(8);
			setTimeout(() => {
				setMouthOpen(0);
				setState("idle");
			}, 300);
		}
	}, [state]);

	useEffect(() => {
		if (state === "idle") {
			const breathInterval = setInterval(() => {
				setEyeHeight((prev) => (prev === 12 ? 10 : 12));
			}, 2000);
			return () => clearInterval(breathInterval);
		}
	}, [state]);

	const triggerWake = () => {
		if (state !== "waking") {
			setState("waking");
		}
	};

	const triggerTalk = () => {
		if (state !== "waking" && state !== "sleeping") {
			setState("talking");
		}
	};

	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 120 120"
			className={className}
			onClick={triggerWake}
			onDoubleClick={triggerTalk}
			style={{ cursor: "pointer" }}
		>
			<defs>
				<linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="0%" stopColor="#FFB6C1" />
					<stop offset="100%" stopColor="#FF69B4" />
				</linearGradient>
				<linearGradient id="earGradient" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="0%" stopColor="#FFB6C1" />
					<stop offset="100%" stopColor="#DB7093" />
				</linearGradient>
				<filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
					<feDropShadow
						dx="0"
						dy="4"
						stdDeviation="3"
						floodColor="#000"
						floodOpacity="0.15"
					/>
				</filter>
			</defs>

			<ellipse
				cx="60"
				cy="70"
				rx="45"
				ry="40"
				fill="url(#bodyGradient)"
				filter="url(#shadow)"
			/>

			<polygon points="25,45 35,20 45,45" fill="url(#earGradient)" />
			<polygon points="75,45 85,20 95,45" fill="url(#earGradient)" />
			<polygon points="28,42 35,25 42,45" fill="#FF69B4" />
			<polygon points="78,42 85,25 92,45" fill="#FF69B4" />

			<ellipse cx="40" cy="55" rx="12" ry={eyeHeight} fill="white" />
			<ellipse cx="80" cy="55" rx="12" ry={eyeHeight} fill="white" />

			{eyeHeight > 4 && (
				<>
					<ellipse cx="42" cy="55" rx="6" ry={eyeHeight * 0.5} fill="#2D2D2D" />
					<ellipse cx="82" cy="55" rx="6" ry={eyeHeight * 0.5} fill="#2D2D2D" />
					<circle cx="44" cy="53" r="2" fill="white" />
					<circle cx="84" cy="53" r="2" fill="white" />
				</>
			)}

			<ellipse
				cx="60"
				cy="75"
				rx={4 + mouthOpen * 0.3}
				ry={mouthOpen}
				fill="#DB7093"
			/>

			<path
				d="M 45 82 Q 60 90 75 82"
				stroke="#DB7093"
				strokeWidth="2"
				fill="none"
				strokeLinecap="round"
			/>

			<ellipse cx="32" cy="75" rx="6" ry="4" fill="#FFB6C1" opacity="0.6" />
			<ellipse cx="88" cy="75" rx="6" ry="4" fill="#FFB6C1" opacity="0.6" />

			<ellipse cx="60" cy="95" rx="20" ry="4" fill="#FF69B4" opacity="0.3" />
		</svg>
	);
};
