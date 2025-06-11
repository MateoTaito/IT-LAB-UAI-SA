import React from "react";

export default function Hero() {
	return (
		<section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
			{/* Transparent dark overlay */}
			<div className="absolute inset-0 bg-black bg-opacity-70 pointer-events-none"></div>
			<div className="relative z-10 flex flex-row items-center justify-between w-full max-w-6xl px-8">
				{/* Left: Text Content */}
				<div className="flex-1 flex flex-col justify-center items-start">
					<h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
						Innovating the Future of Computer Science
					</h1>
					<p className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl">
						Driving research and technology in Artificial Intelligence, Machine Learning, and Data Science
						to shape tomorrow's world.
					</p>
					<div className="flex space-x-3">
						<button className="px-5 py-2 bg-white text-gray-900 font-medium rounded-full hover:bg-gray-100 transition text-base shadow-none border border-transparent">
							Explore
						</button>
						<button className="px-5 py-2 border border-white text-white font-medium rounded-full hover:bg-white hover:text-gray-900 transition text-base shadow-none bg-transparent">
							Join
						</button>
					</div>
				</div>
				{/* Right: Image Placeholder */}
				<div className="flex-1 flex justify-end items-center">
					<div className="flex items-center justify-center bg-gray-800 bg-opacity-60 rounded-lg w-72 h-72 md:w-96 md:h-96">
						<svg
							className="w-40 h-40 md:w-64 md:h-64 text-gray-400"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							viewBox="0 0 48 48"
						>
							<rect
								x="8"
								y="8"
								width="32"
								height="32"
								rx="4"
								stroke="currentColor"
								strokeWidth="3"
								fill="none"
							/>
							<path d="M16 32l6-8 6 8 6-12" stroke="currentColor" strokeWidth="3" fill="none" />
							<circle cx="18" cy="18" r="2.5" fill="currentColor" />
						</svg>
					</div>
				</div>
			</div>
		</section>
	);
}
