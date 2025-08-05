import React, { useState, useEffect } from "react";
import { getTopUsers, TopUser } from "../../../../api/AttendanceApi";

interface TopUsersTableProps {
    refreshTrigger?: number;
}

export default function TopUsersTable({ refreshTrigger }: TopUsersTableProps) {
    const [topUsers, setTopUsers] = useState<TopUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTopUsers();
    }, []);

    // Auto-refresh when trigger changes
    useEffect(() => {
        if (refreshTrigger && refreshTrigger > 0) {
            fetchTopUsers();
        }
    }, [refreshTrigger]);

    const fetchTopUsers = async () => {
        try {
            const users = await getTopUsers();
            setTopUsers(users);
        } catch (error) {
            console.error("Error fetching top users:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (hours: number) => {
        if (hours < 1) {
            return `${Math.round(hours * 60)}m`;
        }
        return `${hours}h`;
    };

    if (loading) {
        return (
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    Top Users
                </h3>
                <div className="animate-pulse space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-10 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Top Users
            </h3>

            {topUsers.length === 0 ? (
                <p className="text-gray-500 text-center py-3 text-sm">
                    No data available
                </p>
            ) : (
                <div className="space-y-2">
                    {topUsers.map((user, index) => (
                        <div
                            key={user.userId}
                            className={`flex items-center justify-between p-3 rounded-lg border ${
                                index === 0
                                    ? "bg-yellow-50 border-yellow-200"
                                    : index === 1
                                      ? "bg-gray-50 border-gray-200"
                                      : index === 2
                                        ? "bg-orange-50 border-orange-200"
                                        : "bg-blue-50 border-blue-200"
                            }`}
                        >
                            <div className="flex items-center space-x-3">
                                <div
                                    className={`flex items-center justify-center w-6 h-6 rounded-full font-bold text-white text-sm ${
                                        index === 0
                                            ? "bg-yellow-500"
                                            : index === 1
                                              ? "bg-gray-500"
                                              : index === 2
                                                ? "bg-orange-500"
                                                : "bg-blue-500"
                                    }`}
                                >
                                    {index + 1}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">
                                        {user.name} {user.lastName}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        {user.email}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="font-semibold text-gray-900 text-sm">
                                    {formatTime(user.totalTimeHours)}
                                </p>
                                <p className="text-xs text-gray-600">
                                    {user.sessionCount} sessions
                                </p>
                                <p className="text-xs text-gray-500">
                                    Avg: {formatTime(user.averageSessionHours)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-3 pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                    * Based on completed sessions
                </p>
            </div>
        </div>
    );
}
