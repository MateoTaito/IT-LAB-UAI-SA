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
    getHourlyUtilization,
    HourlyUtilization,
} from "../../../../api/AttendanceApi";

interface MonthlyHourlyData {
    hour: string;
    averageUtilization: number;
    averageActiveUsers: number;
    daysWithData: number;
}

interface MonthlyHourlyUtilizationChartProps {
    refreshTrigger?: number;
}

export default function MonthlyHourlyUtilizationChart({
    refreshTrigger,
}: MonthlyHourlyUtilizationChartProps) {
    const [hourlyData, setHourlyData] = useState<MonthlyHourlyData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<number>(
        new Date().getMonth() + 1,
    );
    const [selectedYear, setSelectedYear] = useState<number>(
        new Date().getFullYear(),
    );

    useEffect(() => {
        fetchMonthlyHourlyData();
    }, [selectedMonth, selectedYear]);

    // Auto-refresh when trigger changes
    useEffect(() => {
        if (refreshTrigger && refreshTrigger > 0) {
            fetchMonthlyHourlyData();
        }
    }, [refreshTrigger]);

    const fetchMonthlyHourlyData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get all days in the selected month
            const daysInMonth = new Date(
                selectedYear,
                selectedMonth,
                0,
            ).getDate();
            const allDates = Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                return `${selectedYear}-${selectedMonth.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
            });

            // Filter for business days only (Monday to Friday)
            const businessDays = allDates.filter((dateString) => {
                const date = new Date(dateString + "T00:00:00");
                const dayOfWeek = date.getDay();
                return dayOfWeek >= 1 && dayOfWeek <= 5; // 1 = Monday, 5 = Friday
            });

            // Fetch hourly data for each business day
            const allHourlyData: HourlyUtilization[][] = [];

            for (const date of businessDays) {
                try {
                    const dayHourlyData = await getHourlyUtilization(date);
                    if (dayHourlyData && dayHourlyData.length > 0) {
                        allHourlyData.push(dayHourlyData);
                    }
                } catch (err) {
                    // Skip days with no data or errors
                    console.warn(`No data for ${date}:`, err);
                }
            }

            // Calculate averages for each hour
            const hourlyAverages = calculateHourlyAverages(allHourlyData);
            setHourlyData(hourlyAverages);
        } catch (err) {
            setError("Failed to fetch monthly hourly utilization data");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const calculateHourlyAverages = (
        allDaysData: HourlyUtilization[][],
    ): MonthlyHourlyData[] => {
        const hourlyTotals: {
            [hour: string]: {
                totalUtilization: number;
                totalActiveUsers: number;
                count: number;
            };
        } = {};

        // Sum up data for each hour across all days
        allDaysData.forEach((dayData) => {
            dayData.forEach((hourData) => {
                const hour = hourData.hour;
                if (!hourlyTotals[hour]) {
                    hourlyTotals[hour] = {
                        totalUtilization: 0,
                        totalActiveUsers: 0,
                        count: 0,
                    };
                }

                hourlyTotals[hour].totalUtilization += hourData.utilization;
                hourlyTotals[hour].totalActiveUsers += hourData.activeUsers;
                hourlyTotals[hour].count += 1;
            });
        });

        // Calculate averages and convert to array
        const averages: MonthlyHourlyData[] = Object.entries(hourlyTotals)
            .map(([hour, totals]) => ({
                hour,
                averageUtilization:
                    Math.round((totals.totalUtilization / totals.count) * 10) /
                    10,
                averageActiveUsers:
                    Math.round((totals.totalActiveUsers / totals.count) * 10) /
                    10,
                daysWithData: totals.count,
            }))
            .sort((a, b) => {
                // Sort by hour (24-hour format)
                const hourA = parseInt(a.hour.split(":")[0]);
                const hourB = parseInt(b.hour.split(":")[0]);
                return hourA - hourB;
            });

        return averages;
    };

    const formatTooltip = (value: any, name: string) => {
        if (name === "averageUtilization") {
            return [`${value}%`, "Avg. Utilization"];
        }
        if (name === "averageActiveUsers") {
            return [`${value}`, "Avg. Active Users"];
        }
        return [value, name];
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0]?.payload;
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-700">{`Hour: ${label}`}</p>
                    {payload.map((entry: any, index: number) => (
                        <p
                            key={index}
                            style={{ color: entry.color }}
                            className="text-sm"
                        >
                            {`${entry.name}: ${entry.value}${entry.dataKey === "averageUtilization" ? "%" : ""}`}
                        </p>
                    ))}
                    {data && (
                        <p className="text-xs text-gray-500 mt-1">
                            {`Based on ${data.daysWithData} business days`}
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    const getMonthName = (month: number) => {
        return new Date(selectedYear, month - 1).toLocaleDateString("en-US", {
            month: "long",
        });
    };

    const getBusinessDaysCount = () => {
        const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
        let businessDaysCount = 0;
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(selectedYear, selectedMonth - 1, day);
            const dayOfWeek = date.getDay();
            if (dayOfWeek >= 1 && dayOfWeek <= 5) {
                businessDaysCount++;
            }
        }
        return businessDaysCount;
    };

    const calculateOverallStats = () => {
        if (hourlyData.length === 0)
            return { avgUtilization: 0, peakHour: null, lowHour: null };

        const avgUtilization =
            Math.round(
                (hourlyData.reduce(
                    (sum, hour) => sum + hour.averageUtilization,
                    0,
                ) /
                    hourlyData.length) *
                    10,
            ) / 10;

        const peakHour = hourlyData.reduce((peak, current) =>
            current.averageUtilization > peak.averageUtilization
                ? current
                : peak,
        );

        const lowHour = hourlyData.reduce((low, current) =>
            current.averageUtilization < low.averageUtilization ? current : low,
        );

        return { avgUtilization, peakHour, lowHour };
    };

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
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
                        onClick={fetchMonthlyHourlyData}
                        className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const stats = calculateOverallStats();

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                    Business Days Hourly Utilization Averages
                </h3>
                <div className="flex items-center space-x-4">
                    <select
                        value={selectedMonth}
                        onChange={(e) =>
                            setSelectedMonth(parseInt(e.target.value))
                        }
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {new Date(2024, i).toLocaleDateString("en-US", {
                                    month: "long",
                                })}
                            </option>
                        ))}
                    </select>
                    <select
                        value={selectedYear}
                        onChange={(e) =>
                            setSelectedYear(parseInt(e.target.value))
                        }
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {Array.from({ length: 5 }, (_, i) => {
                            const year = new Date().getFullYear() - 2 + i;
                            return (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <h4 className="text-xs font-medium text-blue-700">
                        Business Days Average
                    </h4>
                    <p className="text-xl font-bold text-blue-900">
                        {stats.avgUtilization}%
                    </p>
                    <p className="text-xs text-blue-600">
                        {getBusinessDaysCount()} business days
                    </p>
                </div>

                <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                    <h4 className="text-xs font-medium text-green-700">
                        Peak Hour
                    </h4>
                    <p className="text-lg font-bold text-green-900">
                        {stats.peakHour?.hour || "N/A"}
                    </p>
                    <p className="text-xs text-green-600">
                        {stats.peakHour?.averageUtilization || 0}% avg
                    </p>
                </div>

                <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                    <h4 className="text-xs font-medium text-orange-700">
                        Low Hour
                    </h4>
                    <p className="text-lg font-bold text-orange-900">
                        {stats.lowHour?.hour || "N/A"}
                    </p>
                    <p className="text-xs text-orange-600">
                        {stats.lowHour?.averageUtilization || 0}% avg
                    </p>
                </div>
            </div>

            {/* Average Hourly Utilization Chart */}
            <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Average Hourly Utilization Pattern (Business Days)
                </h4>
                <ResponsiveContainer width="100%" height={220}>
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
                            dataKey="averageUtilization"
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

            {/* Average Active Users Chart */}
            <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Average Active Users Throughout the Day (Business Days)
                </h4>
                <ResponsiveContainer width="100%" height={160}>
                    <BarChart
                        data={hourlyData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="hour" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                            dataKey="averageActiveUsers"
                            fill="#10b981"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
