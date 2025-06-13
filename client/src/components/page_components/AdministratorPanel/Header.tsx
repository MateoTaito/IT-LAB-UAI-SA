import React from "react";

interface HeaderProps {
	userName: string;
	userEmail: string;
}

export default function Header({ userName, userEmail }: HeaderProps) {
	return (
		<header className="bg-indigo-800 text-white shadow-lg">
			<div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold">Administrator Panel</h1>
					<p className="text-indigo-200">Welcome to the LAB-Control management system</p>
				</div>
				<div className="bg-indigo-700 px-4 py-2 rounded-lg shadow-md">
					<p className="text-sm font-semibold">{userName}</p>
					<p className="text-xs text-indigo-200">{userEmail}</p>
				</div>
			</div>
		</header>
	);
}
