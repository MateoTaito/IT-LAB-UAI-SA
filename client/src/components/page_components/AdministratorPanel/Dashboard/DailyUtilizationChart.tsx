import React, { useState, useEffect } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";
import {
    getLabUtilization,
    getHourlyUtilization,
    LabUtilization,
    HourlyUtilization,
} from "../../../../api/AttendanceApi";

// Utility function to safely parse date strings to avoid timezone issues
const parseDisplayDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day); // month is 0-indexed
};

// Use the HourlyUtilization interface from the API
type HourlyData = HourlyUtilization;

export default function DailyUtilizationChart() {
    const [dailyData, setDailyData] = useState<LabUtilization | null>(null);
    const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split("T")[0],
    );

    useEffect(() => {
        fetchDailyData();
    }, [selectedDate]);

    const fetchDailyData = async () => {
        try {
            setLoading(true);
            const [dailyUtilData, hourlyUtilData] = await Promise.all([
                getLabUtilization(selectedDate),
                getHourlyUtilization(selectedDate),
            ]);

            setDailyData(dailyUtilData);
            setHourlyData(hourlyUtilData);
        } catch (err) {
            setError("Failed to fetch daily utilization data");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // No longer needed - using real data from API

    const formatTooltip = (value: any, name: string) => {
        if (name === "utilization") {
            return [`${value}%`, "Lab Utilization"];
        }
        if (name === "activeUsers") {
            return [`${value}`, "Active Users"];
        }
        return [value, name];
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-700">{`Time: ${label}`}</p>
                    {payload.map((entry: any, index: number) => (
                        <p
                            key={index}
                            style={{ color: entry.color }}
                            className="text-sm"
                        >
                            {`${entry.name}: ${entry.value}${entry.dataKey === "utilization" ? "%" : ""}`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-center text-red-600">
                    <p>{error}</p>
                    <button
                        onClick={fetchDailyData}
                        className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                    Daily Lab Utilization
                </h3>
                <div className="flex items-center space-x-4">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h4 className="text-sm font-medium text-blue-700">
                        Total Utilization
                    </h4>
                    <p className="text-2xl font-bold text-blue-900">
                        {dailyData?.utilizationPercentage || 0}%
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                        {dailyData?.utilizationHours || 0}h{" "}
                        {dailyData?.utilizationMinutesRemainder || 0}m used
                    </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <h4 className="text-sm font-medium text-purple-700">
                        Date
                    </h4>
                    <p className="text-lg font-bold text-purple-900">
                        {parseDisplayDate(selectedDate).toLocaleDateString(
                            "en-US",
                            {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                            },
                        )}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                        {selectedDate === new Date().toISOString().split("T")[0]
                            ? "Today"
                            : "Historical data"}
                    </p>
                </div>
            </div>

            {/* Hourly Utilization Chart */}
            <div className="mb-6">
                <h4 className="text-md font-medium text-gray-700 mb-3">
                    Hourly Utilization Pattern
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                        data={hourlyData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="hour" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="utilization"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                            activeDot={{
                                r: 6,
                                stroke: "#3b82f6",
                                strokeWidth: 2,
                                fill: "#ffffff",
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Active Users Chart */}
            <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">
                    Active Users Throughout the Day
                </h4>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                        data={hourlyData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="hour" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                            dataKey="activeUsers"
                            fill="#10b981"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
