"use client";

interface PetIconProps {
	className?: string;
	size?: number;
}

export function PetIcon({ className = "", size = 20 }: PetIconProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 40 40"
			className={className}
			aria-label="Pet icon"
		>
			<defs>
				<linearGradient id="petBody" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="0%" stopColor="#FFB6C1" />
					<stop offset="100%" stopColor="#FF69B4" />
				</linearGradient>
			</defs>
			{/* Body */}
			<ellipse cx="20" cy="24" rx="16" ry="13" fill="url(#petBody)" />
			{/* Ears */}
			<ellipse cx="10" cy="12" rx="6" ry="8" fill="url(#petBody)" />
			<ellipse cx="30" cy="12" rx="6" ry="8" fill="url(#petBody)" />
			{/* Inner ears */}
			<ellipse cx="11" cy="13" rx="3" ry="4" fill="#FF69B4" />
			<ellipse cx="29" cy="13" rx="3" ry="4" fill="#FF69B4" />
			{/* Blush */}
			<ellipse cx="12" cy="23" rx="4" ry="3" fill="rgba(255, 182, 193, 0.5)" />
			<ellipse cx="28" cy="23" rx="4" ry="3" fill="rgba(255, 182, 193, 0.5)" />
			{/* Tail */}
			<path
				d="M34 22 Q38 12 42 16"
				stroke="#FF69B4"
				strokeWidth="2.5"
				fill="none"
				strokeLinecap="round"
			/>
		</svg>
	);
}
