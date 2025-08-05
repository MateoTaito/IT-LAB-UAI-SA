import React, { useState, useEffect, useCallback, useRef } from "react";
import { listUsers } from "../../../../api/UsersApi";
import {
    listActiveUsers,
    getLabUtilization,
    LabUtilization,
} from "../../../../api/AttendanceApi";
import ActiveUsersTable from "./ActiveUsersTable";
import RecentActivityTable from "./RecentActivityTable";
import TopUsersTable from "./TopUsersTable";
import HistoricalMetrics from "./HistoricalMetrics";
import DailyUtilizationChart from "./DailyUtilizationChart";
import MonthlyUtilizationChart from "./MonthlyUtilizationChart";

export default function DashboardContent() {
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [activeSessions, setActiveSessions] = useState<number>(0);
    const [labUtilization, setLabUtilization] = useState<LabUtilization | null>(
        null,
    );
    const [loading, setLoading] = useState(true);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
    const intervalRef = useRef<number | null>(null);

    const fetchDashboardData = useCallback(async () => {
        try {
            const [users, activeUsers, utilization] = await Promise.all([
                listUsers(),
                listActiveUsers(),
                getLabUtilization(),
            ]);

            setTotalUsers(users.length);
            setActiveSessions(activeUsers.length);
            setLabUtilization(utilization);
            setLastRefresh(new Date());

            // Trigger refresh for child components
            setRefreshTrigger((prev) => prev + 1);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial data fetch
    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    // Auto-refresh functionality
    useEffect(() => {
        if (autoRefresh) {
            intervalRef.current = setInterval(() => {
                fetchDashboardData();
            }, 60000); // 60 seconds

            return () => {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            };
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
    }, [autoRefresh, fetchDashboardData]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const handleManualRefresh = () => {
        fetchDashboardData();
    };

    const handleToggleAutoRefresh = () => {
        setAutoRefresh((prev) => !prev);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
                {/* Header with refresh controls */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {new Date().toLocaleDateString("es-ES", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </h2>

                    <div className="flex items-center space-x-3">
                        {/* Auto-refresh toggle */}
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                                Auto-refresh:
                            </span>
                            <button
                                onClick={handleToggleAutoRefresh}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    autoRefresh ? "bg-blue-600" : "bg-gray-200"
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        autoRefresh
                                            ? "translate-x-6"
                                            : "translate-x-1"
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Manual refresh button */}
                        <button
                            onClick={handleManualRefresh}
                            disabled={loading}
                            className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <svg
                                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
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
                            <span>Refresh</span>
                        </button>

                        {/* Last refresh indicator */}
                        <div className="text-xs text-gray-500">
                            Last updated: {lastRefresh.toLocaleTimeString()}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                        <h3 className="text-lg font-medium text-indigo-700">
                            Total Users
                        </h3>
                        <p className="text-3xl font-bold text-indigo-900">
                            {loading ? (
                                <div className="animate-pulse bg-indigo-200 h-8 w-8 rounded"></div>
                            ) : (
                                totalUsers
                            )}
                        </p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                        <h3 className="text-lg font-medium text-green-700">
                            Active Sessions
                        </h3>
                        <p className="text-3xl font-bold text-green-900">
                            {loading ? (
                                <div className="animate-pulse bg-green-200 h-8 w-8 rounded"></div>
                            ) : (
                                activeSessions
                            )}
                        </p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                        <h3 className="text-lg font-medium text-purple-700">
                            Lab Utilization
                        </h3>
                        <p className="text-3xl font-bold text-purple-900">
                            {loading ? (
                                <div className="animate-pulse bg-purple-200 h-8 w-8 rounded"></div>
                            ) : (
                                `${labUtilization?.utilizationPercentage || 0}%`
                            )}
                        </p>
                        {labUtilization && (
                            <p className="text-sm text-purple-600 mt-1">
                                {labUtilization.currentOccupancy}/
                                {labUtilization.maxCapacity} ocupado
                            </p>
                        )}
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                        <h3 className="text-lg font-medium text-orange-700">
                            Usage Time
                        </h3>
                        <p className="text-3xl font-bold text-orange-900">
                            {loading ? (
                                <div className="animate-pulse bg-orange-200 h-8 w-8 rounded"></div>
                            ) : labUtilization ? (
                                labUtilization.utilizationHours > 0 ? (
                                    `${labUtilization.utilizationHours}h ${labUtilization.utilizationMinutesRemainder}m`
                                ) : (
                                    `${labUtilization.utilizationMinutesRemainder}m`
                                )
                            ) : (
                                "0m"
                            )}
                        </p>
                        {labUtilization && (
                            <p className="text-sm text-orange-600 mt-1">
                                de{" "}
                                {Math.floor(
                                    labUtilization.maxPossibleMinutes / 60,
                                )}
                                h posibles
                            </p>
                        )}
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-md font-semibold mb-2 text-gray-700">
                        System Status
                    </h3>
                    <div className="flex items-center space-x-2">
                        <div
                            className={`w-3 h-3 rounded-full ${autoRefresh ? "bg-green-500" : "bg-yellow-500"}`}
                        ></div>
                        <span className="text-gray-600">
                            {autoRefresh
                                ? "Auto-refresh enabled"
                                : "Auto-refresh disabled"}{" "}
                            - All systems operational
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid - More Efficient Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Daily Chart (spans 2 columns) */}
                <div className="lg:col-span-2">
                    <DailyUtilizationChart refreshTrigger={refreshTrigger} />
                </div>

                {/* Right Column - Active Users Table */}
                <div className="lg:col-span-1">
                    <ActiveUsersTable refreshTrigger={refreshTrigger} />
                </div>
            </div>

            {/* Secondary Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Monthly Chart - Reduced priority */}
                <MonthlyUtilizationChart refreshTrigger={refreshTrigger} />

                {/* Top Users - Better positioned */}
                <TopUsersTable refreshTrigger={refreshTrigger} />
            </div>

            {/* Recent Activity - Full width for detailed view */}
            <RecentActivityTable refreshTrigger={refreshTrigger} />

            {/* Historical Metrics */}
            {/* <HistoricalMetrics /> */}
        </div>
    );
}
