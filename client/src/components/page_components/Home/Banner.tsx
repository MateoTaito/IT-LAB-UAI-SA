import React from "react";

export default function Banner() {
	return (
		<section
			className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
			style={{
				background: "linear-gradient(135deg, #1e3a8a 0%, #4f378b 60%, #6d28d9 100%)",
			}}
		>
			{/* Transparent dark overlay */}
			<div className="absolute inset-0 bg-black bg-opacity-70 pointer-events-none"></div>
			<div className="relative z-10 flex flex-col items-center justify-center w-full max-w-6xl px-8 text-center">
				{/* Headline */}
				<h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
					Empowering Future Innovators in Computer Science
				</h1>
				{/* Subheadline */}
				<p className="text-lg md:text-2xl text-blue-100 max-w-2xl mb-8">
					The IT Lab is a student-driven space at UAI dedicated to growth, collaboration, and innovation. We
					provide a platform for aspiring technologists to explore projects, gain experience, and build their
					future in tech.
				</p>
				{/* Call to Action Buttons */}
				<div className="flex space-x-3">
					<button className="px-5 py-2 bg-white text-gray-900 font-medium rounded-full hover:bg-gray-100 transition text-base shadow-none border border-transparent">
						Explore
					</button>
					<button className="px-5 py-2 border border-white text-white font-medium rounded-full hover:bg-white hover:text-gray-900 transition text-base shadow-none bg-transparent">
						Join
					</button>
				</div>
			</div>
		</section>
	);
}
