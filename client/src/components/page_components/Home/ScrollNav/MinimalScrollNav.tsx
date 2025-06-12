import React from "react";

interface MinimalScrollNavProps {
	active: number;
}

export default function MinimalScrollNav({ active }: MinimalScrollNavProps) {
	// Skip the first section (banner) when highlighting dots
	const adjustedActive = active > 0 ? active - 1 : -1;

	return (
		<div className="bg-indigo-900 bg-opacity-40 backdrop-blur-sm rounded-full p-2.5 shadow-lg border border-indigo-500 border-opacity-30 transition-all duration-300 origin-left">
			<div className="w-6 h-32 flex flex-col items-center justify-between py-3">
				{[0, 1, 2, 3].map((dot) => (
					<div
						key={dot}
						className={`rounded-full transition-all duration-500 ${
							dot === adjustedActive
								? "bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 w-2.5 h-2.5 shadow-md shadow-purple-500/50"
								: "bg-white bg-opacity-70 w-1.5 h-1.5"
						}`}
					></div>
				))}
			</div>
		</div>
	);
}
