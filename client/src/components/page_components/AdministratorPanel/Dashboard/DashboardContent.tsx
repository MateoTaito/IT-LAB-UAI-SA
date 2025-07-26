import React, { useState, useEffect } from "react";
import { listUsers } from "../../../../api/UsersApi";
import { listActiveUsers } from "../../../../api/AttendanceApi";
import ActiveUsersTable from "./ActiveUsersTable";
import RecentActivityTable from "./RecentActivityTable";
import TopUsersTable from "./TopUsersTable";

export default function DashboardContent() {
	const [totalUsers, setTotalUsers] = useState<number>(0);
	const [activeSessions, setActiveSessions] = useState<number>(0);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchDashboardData();
	}, []);

	const fetchDashboardData = async () => {
		try {
			const [users, activeUsers] = await Promise.all([
				listUsers(),
				listActiveUsers()
			]);

			setTotalUsers(users.length);
			setActiveSessions(activeUsers.length);
		} catch (error) {
			console.error("Error fetching dashboard data:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="bg-white p-6 rounded-lg shadow">
				<h2 className="text-xl font-semibold mb-4 text-gray-800">Dashboard Overview</h2>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
						<h3 className="text-lg font-medium text-indigo-700">Total Users</h3>
						<p className="text-3xl font-bold text-indigo-900">
							{loading ? (
								<div className="animate-pulse bg-indigo-200 h-8 w-8 rounded"></div>
							) : (
								totalUsers
							)}
						</p>
					</div>

					<div className="bg-green-50 p-4 rounded-lg border border-green-100">
						<h3 className="text-lg font-medium text-green-700">Active Sessions</h3>
						<p className="text-3xl font-bold text-green-900">
							{loading ? (
								<div className="animate-pulse bg-green-200 h-8 w-8 rounded"></div>
							) : (
								activeSessions
							)}
						</p>
					</div>

					<div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
						<h3 className="text-lg font-medium text-purple-700">Lab Utilization</h3>
						<p className="text-3xl font-bold text-purple-900">
							{loading ? (
								<div className="animate-pulse bg-purple-200 h-8 w-8 rounded"></div>
							) : (
								totalUsers > 0 ? Math.round((activeSessions / totalUsers) * 100) : 0
							)}%
						</p>
					</div>
				</div>

				<div className="bg-gray-50 p-4 rounded-lg">
					<h3 className="text-md font-semibold mb-2 text-gray-700">System Status</h3>
					<div className="flex items-center space-x-2">
						<div className="w-3 h-3 bg-green-500 rounded-full"></div>
						<span className="text-gray-600">All systems operational</span>
					</div>
				</div>
			</div>

			{/* Active Users Table */}
			<ActiveUsersTable />

			{/* Top Users Table */}
			<TopUsersTable />

			{/* Recent Activity Table */}
			<RecentActivityTable />
		</div>
	);
}
