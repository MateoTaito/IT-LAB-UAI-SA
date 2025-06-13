import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useSidebar } from "../../../context/SidebarContext";

interface SidebarProps {
	userName?: string;
	userEmail?: string;
}

export default function Sidebar({ userName = "Administrator", userEmail = "" }: SidebarProps) {
	const { collapsed, toggleSidebar } = useSidebar();
	const { logout } = useAuth();
	const location = useLocation();

	// Simplified menu items - add Roles item
	const menuItems = [
		{
			id: "dashboard",
			label: "Dashboard",
			icon: (
				<svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
					<path d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5z" />
					<path d="M14 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5z" />
					<path d="M4 14a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-5z" />
					<path d="M14 12a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-8z" />
				</svg>
			),
			path: "/admin",
		},
		{
			id: "users",
			label: "Users",
			icon: (
				<svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z"
					/>
				</svg>
			),
			path: "/admin/users",
		},
		{
			id: "roles",
			label: "Roles",
			icon: (
				<svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
					/>
				</svg>
			),
			path: "/admin/roles",
		},
	];

	const handleLogout = () => {
		logout();
	};

	return (
		<aside
			className={`h-screen bg-gray-900 text-white transition-all duration-300 ${
				collapsed ? "w-24" : "w-64"
			} fixed left-0 top-0 z-40 flex flex-col shadow-lg`}
		>
			{/* Logo section */}
			<div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
				<Link to="/admin" className="flex items-center">
					<div className="bg-indigo-600 h-10 w-10 rounded-full flex items-center justify-center">
						<span className={`text-white font-bold text-lg ${collapsed ? "hidden" : "block"}`}>LC</span>
					</div>
					{!collapsed && <span className="ml-3 font-bold text-lg">LAB Control</span>}
				</Link>
				<button
					onClick={toggleSidebar}
					className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 focus:outline-none"
					aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
				>
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d={collapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7M19 19l-7-7 7-7"}
						/>
					</svg>
				</button>
			</div>

			{/* Navigation Menu */}
			<nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
				{menuItems.map((item) => {
					const isActive = location.pathname === item.path;
					return (
						<Link
							key={item.id}
							to={item.path}
							className={`flex items-center ${
								collapsed ? "justify-center" : ""
							} px-2 py-3 rounded-md transition-colors ${
								isActive
									? "bg-indigo-600 text-white"
									: "text-gray-300 hover:bg-gray-800 hover:text-white"
							}`}
						>
							<div className={isActive ? "text-white" : "text-gray-400"}>{item.icon}</div>
							{!collapsed && <span className="ml-3 text-sm font-medium">{item.label}</span>}
						</Link>
					);
				})}
			</nav>

			{/* User Section */}
			<div className="border-t border-gray-800 p-4">
				{!collapsed ? (
					<div className="flex flex-col">
						<p className="font-medium text-sm text-white">{userName}</p>
						<p className="text-xs text-gray-400 mb-2">{userEmail}</p>
						<button
							onClick={handleLogout}
							className="text-xs bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white py-1 px-2 rounded mt-1 transition-colors"
						>
							Sign Out
						</button>
					</div>
				) : (
					<button
						onClick={handleLogout}
						className="w-full flex justify-center p-1 text-gray-400 hover:text-white rounded-full hover:bg-gray-800"
						title="Sign Out"
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
							/>
						</svg>
					</button>
				)}
			</div>
		</aside>
	);
}
