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
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const calculateDuration = (checkInString: string) => {
        const checkIn = new Date(checkInString);
        const now = new Date();
        const diffMs = now.getTime() - checkIn.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor(
            (diffMs % (1000 * 60 * 60)) / (1000 * 60),
        );

        if (diffHours > 0) {
            return `${diffHours}h ${diffMinutes}m`;
        }
        return `${diffMinutes}m`;
    };

    if (loading) {
        return (
            <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">
                    Active Users
                </h2>
                <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">
                    Active Users
                </h2>
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
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
        <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-800">
                    Active Users
                </h2>
                <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">
                            {activeUsers.length}
                        </span>
                    </div>
                    <button
                        onClick={fetchActiveUsers}
                        className="text-indigo-600 hover:text-indigo-800 text-sm"
                        title="Refresh"
                    >
                        <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {activeUsers.length === 0 ? (
                <div className="text-center py-6">
                    <div className="text-gray-500 mb-2">
                        <svg
                            className="w-8 h-8 mx-auto mb-2 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                    </div>
                    <p className="text-sm text-gray-500">No active users</p>
                    <p className="text-xs text-gray-400 mt-1">
                        Refreshes every 30s
                    </p>
                </div>
            ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {activeUsers.map((user) => (
                        <div
                            key={user.Id}
                            className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                    <div className="flex-shrink-0 h-6 w-6">
                                        <div className="h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center">
                                            <span className="text-xs font-medium text-white">
                                                {user.Name.charAt(0)}
                                                {user.LastName.charAt(0)}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {user.Name} {user.LastName}
                                        </div>
                                    </div>
                                </div>
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            </div>
                            <div className="text-xs text-gray-500 space-y-1">
                                <div className="flex justify-between">
                                    <span>Reason:</span>
                                    <span className="font-medium">
                                        {user.Reason}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Duration:</span>
                                    <span className="font-medium">
                                        {calculateDuration(user.CheckIn)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Check-in:</span>
                                    <span className="font-medium">
                                        {formatTime(user.CheckIn)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="mt-2 text-xs text-gray-400 text-center">
                        Auto-refreshes every 30s
                    </div>
                </div>
            )}
        </div>
    );
}
