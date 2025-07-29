import React, { useState, useEffect } from "react";
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

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [users, activeUsers, utilization] = await Promise.all([
                listUsers(),
                listActiveUsers(),
                getLabUtilization(),
            ]);

            setTotalUsers(users.length);
            setActiveSessions(activeUsers.length);
            setLabUtilization(utilization);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    {new Date().toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </h2>

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
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600">
                            All systems operational
                        </span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Daily Utilization Chart */}
                <DailyUtilizationChart />

                {/* Monthly Utilization Chart */}
                <MonthlyUtilizationChart />
            </div>

            {/* Active Users Table */}
            <ActiveUsersTable />

            {/* Top Users Table */}
            <TopUsersTable />

            {/* Historical Metrics */}
            {/* <HistoricalMetrics /> */}

            {/* Recent Activity Table */}
            <RecentActivityTable />
        </div>
    );
}
