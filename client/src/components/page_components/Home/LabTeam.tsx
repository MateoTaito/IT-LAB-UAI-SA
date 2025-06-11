import React from "react";

const students = [
	{
		name: "Ana Martínez",
		role: "Lab Manager",
		img: "",
		description: "Oversees daily operations and coordinates student projects.",
	},
	{
		name: "Carlos Pérez",
		role: "Student in Charge",
		img: "",
		description: "Leads the AI research group and mentors new members.",
	},
	{
		name: "Lucía Gómez",
		role: "Student in Charge",
		img: "",
		description: "Coordinates data science initiatives and outreach.",
	},
];

const professors = [
	{
		name: "Dr. Elena Torres",
		role: "Professor",
		img: "",
		description: "Expert in Machine Learning and Data Science.",
	},
	{
		name: "Dr. Pablo Ruiz",
		role: "Professor",
		img: "",
		description: "Specialist in Artificial Intelligence and Robotics.",
	},
];

export default function LabTeam() {
	return (
		<section id="lab-team" className="w-full flex flex-col items-center justify-center py-20 bg-[#18122B]">
			<div className="max-w-6xl w-full px-4">
				<h2 className="text-3xl md:text-5xl font-extrabold text-center mb-4 text-white">Meet the Lab Team</h2>
				<p className="text-center text-gray-300 mb-12">
					Students, managers, and professors driving innovation in the laboratory.
				</p>
				{/* Professors first */}
				<div className="mb-12">
					<h3 className="text-xl font-bold mb-6 text-gray-200 text-center">Professors</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{professors.map((person, idx) => (
							<div
								key={idx}
								className="flex flex-col items-center bg-[#232046] bg-opacity-90 rounded-lg p-6 shadow"
							>
								<div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center mb-4">
									{person.img ? (
										<img
											src={person.img}
											alt={person.name}
											className="w-full h-full rounded-full object-cover"
										/>
									) : (
										<svg
											className="w-10 h-10 text-gray-400"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											viewBox="0 0 24 24"
										>
											<circle cx="12" cy="8" r="4" />
											<path d="M6 20c0-2.2 3.6-3.5 6-3.5s6 1.3 6 3.5" />
										</svg>
									)}
								</div>
								<div className="text-center">
									<p className="font-bold text-lg text-white">{person.name}</p>
									<p className="text-blue-300 font-medium">{person.role}</p>
									<p className="text-gray-300 mt-2 text-sm">{person.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>
				{/* Lab Managers & Students in Charge */}
				<div>
					<h3 className="text-xl font-bold mb-6 text-gray-200 text-center">
						Lab Managers & Students in Charge
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{students.map((person, idx) => (
							<div
								key={idx}
								className="flex flex-col items-center bg-[#232046] bg-opacity-90 rounded-lg p-6 shadow"
							>
								<div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center mb-4">
									{person.img ? (
										<img
											src={person.img}
											alt={person.name}
											className="w-full h-full rounded-full object-cover"
										/>
									) : (
										<svg
											className="w-10 h-10 text-gray-400"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											viewBox="0 0 24 24"
										>
											<circle cx="12" cy="8" r="4" />
											<path d="M6 20c0-2.2 3.6-3.5 6-3.5s6 1.3 6 3.5" />
										</svg>
									)}
								</div>
								<div className="text-center">
									<p className="font-bold text-lg text-white">{person.name}</p>
									<p className="text-blue-300 font-medium">{person.role}</p>
									<p className="text-gray-300 mt-2 text-sm">{person.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
