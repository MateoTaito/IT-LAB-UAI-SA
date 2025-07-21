import React, { useState, useEffect } from "react";
import { listActiveUsers, ActiveUser } from "../../../../api/AttendanceApi";

export default function ActiveUsersTable() {
	const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch active users when component mounts and every 30 seconds
	useEffect(() => {
		fetchActiveUsers();
		
		// Set up auto-refresh every 30 seconds
		const interval = setInterval(fetchActiveUsers, 30000);
		
		// Cleanup interval on unmount
		return () => clearInterval(interval);
	}, []);

	const fetchActiveUsers = async () => {
		try {
			const users = await listActiveUsers();
			setActiveUsers(users);
			setError(null);
		} catch (err) {
			console.error("Error fetching active users:", err);
			setError("Failed to load active users");
		} finally {
			setLoading(false);
		}
	};

	const formatTime = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleTimeString([], { 
			hour: '2-digit', 
			minute: '2-digit',
			hour12: true
		});
	};

	const calculateDuration = (checkInString: string) => {
		const checkIn = new Date(checkInString);
		const now = new Date();
		const diffMs = now.getTime() - checkIn.getTime();
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
		const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
		
		if (diffHours > 0) {
			return `${diffHours}h ${diffMinutes}m`;
		}
		return `${diffMinutes}m`;
	};

	if (loading) {
		return (
			<div className="bg-white p-6 rounded-lg shadow">
				<h2 className="text-xl font-semibold mb-4 text-gray-800">Users Currently in Lab</h2>
				<div className="flex justify-center items-center py-8">
					<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-white p-6 rounded-lg shadow">
				<h2 className="text-xl font-semibold mb-4 text-gray-800">Users Currently in Lab</h2>
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
					{error}
					<button
						onClick={fetchActiveUsers}
						className="ml-2 text-red-600 hover:text-red-800 underline"
					>
						Try again
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white p-6 rounded-lg shadow">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-semibold text-gray-800">Users Currently in Lab</h2>
				<div className="flex items-center space-x-2">
					<div className="flex items-center space-x-1">
						<div className="w-2 h-2 bg-green-500 rounded-full"></div>
						<span className="text-sm text-gray-600">{activeUsers.length} active</span>
					</div>
					<button
						onClick={fetchActiveUsers}
						className="text-indigo-600 hover:text-indigo-800 text-sm"
						title="Refresh"
					>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						</svg>
					</button>
				</div>
			</div>

			{activeUsers.length === 0 ? (
				<div className="text-center py-8">
					<div className="text-gray-500 mb-2">
						<svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
						</svg>
					</div>
					<p className="text-gray-500">No users are currently in the lab</p>
					<p className="text-xs text-gray-400 mt-1">Data refreshes automatically every 30 seconds</p>
				</div>
			) : (
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									User
								</th>
								<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Reason
								</th>
								<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Check In
								</th>
								<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Duration
								</th>
								<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Status
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{activeUsers.map((user) => (
								<tr key={user.Id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											<div className="flex-shrink-0 h-10 w-10">
												<div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
													<span className="text-sm font-medium text-white">
														{user.Name.charAt(0)}{user.LastName.charAt(0)}
													</span>
												</div>
											</div>
											<div className="ml-4">
												<div className="text-sm font-medium text-gray-900">
													{user.Name} {user.LastName}
												</div>
												<div className="text-sm text-gray-500">
													{user.Email}
												</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
											{user.Reason}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{formatTime(user.CheckIn)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{calculateDuration(user.CheckIn)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
											<div className="w-2 h-2 bg-green-500 rounded-full mr-1 mt-0.5"></div>
											Present
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className="mt-3 text-xs text-gray-400 text-center">
						Last updated: {new Date().toLocaleTimeString()} • Auto-refreshes every 30 seconds
					</div>
				</div>
			)}
		</div>
	);
}
