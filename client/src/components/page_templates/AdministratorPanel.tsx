import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAdminInfo, User } from "../../api/UsersApi";

// Import components
import Header from "../page_components/AdministratorPanel/Header";

export default function AdministratorPanel() {
	const { isAuthenticated, userId } = useAuth();
	const navigate = useNavigate();
	const [userInfo, setUserInfo] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// If not authenticated, redirect to login
	useEffect(() => {
		if (!isAuthenticated) {
			navigate("/login");
			return;
		}

		// Fetch user information
		const fetchUserInfo = async () => {
			try {
				if (userId) {
					const userData = await getAdminInfo(userId);
					setUserInfo(userData);
				}
			} catch (err) {
				setError("Failed to load user information");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchUserInfo();
	}, [isAuthenticated, userId, navigate]);

	// Display loading state while fetching user info
	if (loading) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="text-center">
					<div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
					<p className="mt-2 text-gray-700">Loading...</p>
				</div>
			</div>
		);
	}

	// Display error if something went wrong
	if (error) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="text-center text-red-600">
					<p>{error}</p>
					<button
						className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
						onClick={() => navigate("/login")}
					>
						Return to Login
					</button>
				</div>
			</div>
		);
	}

	const fullName = userInfo ? `${userInfo.Name} ${userInfo.LastName}` : "Administrator";
	const email = userInfo ? userInfo.Email : "";

	return (
		<div className="min-h-screen bg-gray-100">
			{/* Admin Header */}
			<Header userName={fullName} userEmail={email} />

			{/* Main content will go here */}
			<main className="max-w-7xl mx-auto px-4 py-8">
				<div className="bg-white p-6 rounded-lg shadow">
					<h2 className="text-xl font-semibold mb-4">Welcome to the Administrator Dashboard</h2>
					<p>This dashboard is currently under development. More features will be added soon.</p>
				</div>
			</main>
		</div>
	);
}
