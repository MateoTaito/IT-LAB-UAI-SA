import React from "react";

export default function Hero() {
	return (
		<section
			className="w-full min-h-screen flex flex-col md:flex-row items-center justify-center py-12 px-4"
			style={{
				background: "linear-gradient(135deg, #fff 0%, #e0e7ff 100%)",
			}}
		>
			{/* Left: Image */}
			<div className="flex-1 flex justify-center mb-8 md:mb-0">
				<img
					src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg"
					alt="IT Lab"
					className="rounded-lg object-cover w-full max-w-md h-72 md:h-80"
				/>
			</div>
			{/* Right: Minimal Text Content */}
			<div className="flex-1 flex flex-col justify-center md:pl-16">
				<div className="border-l-2 border-gray-300 pl-6">
					<h2 className="text-3xl font-semibold mb-4 text-gray-900">Professional IT Lab Design</h2>
					<p className="mb-8 text-gray-700">Create customized IT lab layouts tailored to academic needs</p>
					<h2 className="text-3xl font-semibold mb-4 text-gray-900">Technology Implementation</h2>
					<p className="mb-8 text-gray-700">Implement innovative technology solutions for academic IT labs</p>
					<h2 className="text-3xl font-semibold mb-4 text-gray-900">Collaborative Design</h2>
					<p className="text-gray-700">Collaborate with academic staff to design cutting-edge IT labs</p>
				</div>
			</div>
		</section>
	);
}
