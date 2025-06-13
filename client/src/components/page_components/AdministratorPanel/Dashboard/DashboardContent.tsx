import React from "react";

export default function DashboardContent() {
	return (
		<div className="space-y-6">
			<div className="bg-white p-6 rounded-lg shadow">
				<h2 className="text-xl font-semibold mb-4 text-gray-800">Dashboard Overview</h2>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
						<h3 className="text-lg font-medium text-indigo-700">Total Users</h3>
						<p className="text-3xl font-bold text-indigo-900">24</p>
					</div>

					<div className="bg-green-50 p-4 rounded-lg border border-green-100">
						<h3 className="text-lg font-medium text-green-700">Active Sessions</h3>
						<p className="text-3xl font-bold text-green-900">8</p>
					</div>

					<div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
						<h3 className="text-lg font-medium text-purple-700">Lab Resources</h3>
						<p className="text-3xl font-bold text-purple-900">85%</p>
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

			<div className="bg-white p-6 rounded-lg shadow">
				<h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h2>
				<div className="space-y-3">
					<div className="pb-2 border-b border-gray-100">
						<p className="text-sm text-gray-800">
							New user registered: <span className="font-medium">Maria Garcia</span>
						</p>
						<p className="text-xs text-gray-500">2 hours ago</p>
					</div>
					<div className="pb-2 border-b border-gray-100">
						<p className="text-sm text-gray-800">
							Resource updated: <span className="font-medium">Lab Schedule</span>
						</p>
						<p className="text-xs text-gray-500">Yesterday at 15:30</p>
					</div>
					<div className="pb-2 border-b border-gray-100">
						<p className="text-sm text-gray-800">System maintenance completed</p>
						<p className="text-xs text-gray-500">2 days ago</p>
					</div>
				</div>
			</div>
		</div>
	);
}
