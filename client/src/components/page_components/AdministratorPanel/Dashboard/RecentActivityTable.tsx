import React, { useState, useEffect } from "react";
import { getRecentActivity, ActiveUser } from "../../../../api/AttendanceApi";

export default function RecentActivityTable() {
	const [recentActivity, setRecentActivity] = useState<ActiveUser[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchRecentActivity();
		
		// Refresh every minute
		const interval = setInterval(fetchRecentActivity, 60000);
		
		return () => clearInterval(interval);
	}, []);

	const fetchRecentActivity = async () => {
		try {
			const activity = await getRecentActivity(10);
			setRecentActivity(activity);
			setError(null);
		} catch (err) {
			console.error("Error fetching recent activity:", err);
			setError("Failed to load recent activity");
		} finally {
			setLoading(false);
		}
	};

	const formatTime = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleString([], { 
			month: 'short',
			day: 'numeric',
			hour: '2-digit', 
			minute: '2-digit',
			hour12: true
		});
	};

	const getTimeAgo = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMinutes = Math.floor(diffMs / (1000 * 60));
		const diffHours = Math.floor(diffMinutes / 60);
		const diffDays = Math.floor(diffHours / 24);

		if (diffMinutes < 1) return "Just now";
		if (diffMinutes < 60) return `${diffMinutes} min ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		return `${diffDays}d ago`;
	};

	const getActivityIcon = (activity: ActiveUser) => {
		if (activity.CheckOut) {
			// User has checked out
			return (
				<div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
					<svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
					</svg>
				</div>
			);
		} else {
			// User has checked in (still active)
			return (
				<div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
					<svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
					</svg>
				</div>
			);
		}
	};

	const getActivityText = (activity: ActiveUser) => {
		const userName = `${activity.Name} ${activity.LastName}`;
		
		if (activity.CheckOut) {
			return (
				<>
					<span className="font-medium text-gray-900">{userName}</span>
					<span className="text-gray-600"> left the lab</span>
					<span className="text-gray-500"> • {activity.Reason}</span>
				</>
			);
		} else {
			return (
				<>
					<span className="font-medium text-gray-900">{userName}</span>
					<span className="text-gray-600"> entered the lab</span>
					<span className="text-gray-500"> • {activity.Reason}</span>
				</>
			);
		}
	};

	const getActivityTime = (activity: ActiveUser) => {
		// Show the most recent time (CheckOut if available, otherwise CheckIn)
		const timeToShow = activity.CheckOut || activity.CheckIn;
		return getTimeAgo(timeToShow);
	};

	if (loading) {
		return (
			<div className="bg-white p-6 rounded-lg shadow">
				<h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h2>
				<div className="space-y-3">
					{[...Array(3)].map((_, i) => (
						<div key={i} className="pb-3 border-b border-gray-100 animate-pulse">
							<div className="flex items-center space-x-3">
								<div className="w-8 h-8 bg-gray-200 rounded-full"></div>
								<div className="flex-1">
									<div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
									<div className="h-3 bg-gray-200 rounded w-1/2"></div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-white p-6 rounded-lg shadow">
				<h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h2>
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
					{error}
					<button
						onClick={fetchRecentActivity}
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
				<h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
				<button
					onClick={fetchRecentActivity}
					className="text-indigo-600 hover:text-indigo-800 text-sm"
					title="Refresh"
				>
					<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
					</svg>
				</button>
			</div>

			{recentActivity.length === 0 ? (
				<div className="text-center py-8">
					<div className="text-gray-500 mb-2">
						<svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<p className="text-gray-500">No recent activity</p>
					<p className="text-xs text-gray-400 mt-1">Activity updates automatically every minute</p>
				</div>
			) : (
				<div className="space-y-3">
					{recentActivity.map((activity, index) => (
						<div key={`${activity.Id}-${activity.CheckOut ? 'out' : 'in'}`} className="pb-3 border-b border-gray-100 last:border-b-0">
							<div className="flex items-start space-x-3">
								{getActivityIcon(activity)}
								<div className="flex-1 min-w-0">
									<p className="text-sm text-gray-800">
										{getActivityText(activity)}
									</p>
									<p className="text-xs text-gray-500 mt-1">
										{getActivityTime(activity)}
									</p>
								</div>
							</div>
						</div>
					))}
					
					<div className="text-center pt-2">
						<p className="text-xs text-gray-400">
							Last updated: {new Date().toLocaleTimeString()} • Updates every minute
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
