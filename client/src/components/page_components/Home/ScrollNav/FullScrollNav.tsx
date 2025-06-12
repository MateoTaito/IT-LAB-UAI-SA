import React from "react";

interface Section {
	id: string;
	label: string;
}

interface FullScrollNavProps {
	sections: Section[];
	active: number;
	scrollToSection: (id: string) => void;
}

export default function FullScrollNav({ sections, active, scrollToSection }: FullScrollNavProps) {
	// Function to get icon based on section id
	const getSectionIcon = (id: string) => {
		switch (id) {
			case "banner":
				return (
					<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
						<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
					</svg>
				);
			case "hero":
				return (
					<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
						<path d="M12 2L1 12h3v9h6v-6h4v6h6v-9h3L12 2z" />
					</svg>
				);
			case "projects":
				return (
					<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
						<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
					</svg>
				);
			case "labteam":
				return (
					<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
						<path d="M12 12.75c1.63 0 3.07.39 4.24.9 1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73 1.17-.52 2.61-.91 4.24-.91zM4 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.13 1.1c-.37-.06-.74-.1-1.13-.1-.99 0-1.93.21-2.78.58C.48 14.9 0 15.62 0 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29zM20 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.13 1.1c.37-.06.74-.1 1.13-.1.99 0 1.93.21 2.78.58.73.32 1.21 1.04 1.21 1.85V18h-4.5v-1.61c0-.83-.23-1.61-.63-2.29zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" />
					</svg>
				);
			case "footer":
				return (
					<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
						<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z" />
					</svg>
				);
			default:
				return (
					<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
						<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
					</svg>
				);
		}
	};

	// Add "Home" section at the beginning
	const allSections = [{ id: "banner", label: "Home" }, ...sections];

	return (
		<nav
			className="bg-indigo-600 bg-opacity-80 backdrop-blur-sm p-3 pr-4 pl-3.5 rounded-lg border border-indigo-500 border-opacity-50 shadow-xl"
			aria-label="Section navigation"
			style={{ height: "auto", maxHeight: "70vh" }}
		>
			<div className="w-36 flex flex-col gap-3.5">
				{/* Sections list */}
				{allSections.map((section, idx) => (
					<button
						key={section.id}
						onClick={() => scrollToSection(section.id)}
						className={`flex items-center transition-all duration-500 py-2 px-2 rounded-md ${
							active === idx ? "bg-indigo-700 bg-opacity-90" : "hover:bg-indigo-700 hover:bg-opacity-50"
						}`}
						aria-label={`Go to ${section.label} section`}
					>
						<div
							className={`flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 mr-3 ${
								active === idx
									? "bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/50"
									: "bg-white bg-opacity-20 text-white text-opacity-70"
							}`}
						>
							{getSectionIcon(section.id)}
						</div>

						{/* Label - always visible */}
						<span
							className={`text-sm whitespace-nowrap transition-all duration-300 ${
								active === idx ? "text-white font-medium" : "text-gray-200"
							}`}
						>
							{section.label}
						</span>
					</button>
				))}
			</div>
		</nav>
	);
}
