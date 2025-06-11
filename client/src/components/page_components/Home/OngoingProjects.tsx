import React from "react";
import Card from "./Card";

const projects = [
	{
		icon: (
			<svg
				className="w-8 h-8 text-gray-900"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				viewBox="0 0 24 24"
			>
				<path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="2" />
				<circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
			</svg>
		),
		title: "Artificial Intelligence",
		desc: "Harnessing data to create intelligent systems that learn and adapt.",
	},
	{
		icon: (
			<svg
				className="w-8 h-8 text-gray-900"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				viewBox="0 0 24 24"
			>
				<rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
				<path d="M8 20h8" stroke="currentColor" strokeWidth="2" />
			</svg>
		),
		title: "Revolutionizing the Future of Computing",
		desc: "Pioneering new frontiers in computational power.",
	},
	{
		icon: (
			<svg
				className="w-8 h-8 text-gray-900"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				viewBox="0 0 24 24"
			>
				<path
					d="M12 3l7 4v5c0 5.25-3.5 9.74-7 11-3.5-1.26-7-5.75-7-11V7l7-4z"
					stroke="currentColor"
					strokeWidth="2"
				/>
			</svg>
		),
		title: "Securing Our Digital World",
		desc: "Protecting data and systems from cyber threats.",
	},
];

const delayClasses = ["card-gradient-cascade-0", "card-gradient-cascade-1", "card-gradient-cascade-2"];

export default function OngoingProjects() {
	return (
		<section className="w-full flex flex-col items-center justify-center py-20 bg-white bg-opacity-90">
			<div className="max-w-6xl w-full px-4">
				<p className="text-center font-semibold text-lg mb-2 text-gray-700">Innovate</p>
				<h2 className="text-3xl md:text-5xl font-extrabold text-center mb-4 text-gray-900">
					Explore Cutting-Edge Research
				</h2>
				<p className="text-center text-gray-600 mb-12">Transforming ideas into groundbreaking technologies.</p>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{projects.map((proj, idx) => (
						<Card
							key={idx}
							icon={proj.icon}
							title={proj.title}
							desc={proj.desc}
							delayClass={delayClasses[idx]}
						/>
					))}
				</div>
			</div>
			<style>
				{`
				.card-gradient-animate::before {
					content: "";
					position: absolute;
					inset: 0;
					background: linear-gradient(to top right, #1e3a8a, #7c3aed, #ec4899);
					opacity: 0;
					transition: opacity 0.7s;
					z-index: 10;
				}
				.card-gradient-cascade-0::before {
					transition-delay: 0s;
				}
				.card-gradient-cascade-1::before {
					transition-delay: 0.15s;
				}
				.card-gradient-cascade-2::before {
					transition-delay: 0.3s;
				}
				.group:hover .card-gradient-animate::before {
					opacity: 1;
				}
				`}
			</style>
		</section>
	);
}
