import React, { ReactNode } from "react";

interface CardProps {
	icon: ReactNode;
	title: string;
	desc: string;
	delayClass?: string;
}

export default function Card({ icon, title, desc, delayClass = "" }: CardProps) {
	return (
		<div className="flex justify-center items-stretch">
			<div className="relative w-full min-h-[320px] h-full transition-transform duration-300 transform-gpu hover:scale-105 group overflow-hidden">
				{/* Animated diagonal gradient overlay with cascade effect */}
				<div
					className={`absolute inset-0 rounded-none border-4 border-gray-900 bg-white transition-all duration-700 group-hover:border-transparent card-gradient-animate ${delayClass}`}
				></div>
				<div className="relative z-20 p-8 flex flex-col justify-between min-h-[320px] h-full">
					<div>
						<div className="mb-4">{icon}</div>
						<h3 className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-white transition-colors duration-300">
							{title}
						</h3>
						<p className="text-gray-700 mb-6 group-hover:text-gray-100 transition-colors duration-300">
							{desc}
						</p>
					</div>
					<div className="flex space-x-3">
						<button className="border border-gray-900 px-5 py-2 rounded-none font-medium text-gray-900 hover:bg-gray-900 hover:text-white transition group-hover:border-white group-hover:text-white">
							Learn
						</button>
						<button className="flex items-center text-gray-900 font-medium hover:underline group-hover:text-white transition">
							Discover
							<svg
								className="ml-1 w-4 h-4"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								viewBox="0 0 24 24"
							>
								<path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
