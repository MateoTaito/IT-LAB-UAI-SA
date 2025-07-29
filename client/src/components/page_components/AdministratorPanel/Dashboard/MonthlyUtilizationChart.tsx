import React, { useState, useEffect } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    AreaChart,
    Area,
} from "recharts";
import {
    getMonthlyUtilization,
    MonthlyUtilization,
    DailyUtilization,
} from "../../../../api/AttendanceApi";

// Utility function to safely parse date strings to avoid timezone issues
const parseDisplayDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day); // month is 0-indexed
};

interface MonthlyChartData {
    day: string;
    utilization: number;
    activeUsers: number;
    date: string;
}

export default function MonthlyUtilizationChart() {
    const [monthlyData, setMonthlyData] = useState<MonthlyUtilization | null>(
        null,
    );
    const [chartData, setChartData] = useState<MonthlyChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<number>(
        new Date().getMonth() + 1,
    );
    const [selectedYear, setSelectedYear] = useState<number>(
        new Date().getFullYear(),
    );
    const [viewMode, setViewMode] = useState<"bar" | "line" | "area">("bar");

    useEffect(() => {
        fetchMonthlyData();
    }, [selectedMonth, selectedYear]);

    const fetchMonthlyData = async () => {
        try {
            setLoading(true);
            const data = await getMonthlyUtilization(
                selectedMonth,
                selectedYear,
            );
            setMonthlyData(data);

            // Transform daily breakdown data for the chart
            const transformedData: MonthlyChartData[] =
                data.dailyBreakdown?.map(
                    (day: DailyUtilization, index: number) => {
                        const date = parseDisplayDate(day.date);
                        return {
                            day: date.getDate().toString(),
                            utilization: Math.round(day.utilizationPercentage),
                            activeUsers: day.activeUsers,
                            date: day.date,
                        };
                    },
                ) || [];

            setChartData(transformedData);
        } catch (err) {
            setError("Failed to fetch monthly utilization data");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatTooltip = (value: any, name: string) => {
        if (name === "utilization") {
            return [`${value}%`, "Utilization"];
        }
        if (name === "activeUsers") {
            return [`${value}`, "Active Users"];
        }
        return [value, name];
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0]?.payload;
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-700">
                        {data?.date
                            ? parseDisplayDate(data.date).toLocaleDateString(
                                  "en-US",
                                  {
                                      weekday: "short",
                                      month: "short",
                                      day: "numeric",
                                  },
                              )
                            : `Day ${label}`}
                    </p>
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

    const getMonthName = (month: number) => {
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        return months[month - 1];
    };

    const generateYearOptions = (): number[] => {
        const currentYear = new Date().getFullYear();
        const years: number[] = [];
        for (let i = currentYear; i >= currentYear - 5; i--) {
            years.push(i);
        }
        return years;
    };

    const generateMonthOptions = (): Array<{
        value: number;
        label: string;
    }> => {
        const months: Array<{ value: number; label: string }> = [];
        for (let i = 1; i <= 12; i++) {
            months.push({
                value: i,
                label: getMonthName(i),
            });
        }
        return months;
    };

    const renderChart = () => {
        const commonProps = {
            data: chartData,
            margin: { top: 5, right: 30, left: 20, bottom: 5 },
        };

        switch (viewMode) {
            case "line":
                return (
                    <LineChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="utilization"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={{ fill: "#3b82f6", strokeWidth: 1, r: 3 }}
                            activeDot={{
                                r: 5,
                                stroke: "#3b82f6",
                                strokeWidth: 2,
                                fill: "#ffffff",
                            }}
                        />
                    </LineChart>
                );
            case "area":
                return (
                    <AreaChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="utilization"
                            stroke="#3b82f6"
                            fill="#3b82f6"
                            fillOpacity={0.3}
                            strokeWidth={2}
                        />
                    </AreaChart>
                );
            default:
                return (
                    <BarChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                            dataKey="utilization"
                            fill="#3b82f6"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                );
        }
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
                        onClick={fetchMonthlyData}
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
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
                <h3 className="text-lg font-semibold text-gray-800">
                    Monthly Lab Utilization
                </h3>

                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    {/* Chart Type Selector */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode("bar")}
                            className={`px-3 py-1 rounded text-sm transition-colors ${
                                viewMode === "bar"
                                    ? "bg-white text-indigo-600 shadow"
                                    : "text-gray-600 hover:text-gray-800"
                            }`}
                        >
                            Bar
                        </button>
                        <button
                            onClick={() => setViewMode("line")}
                            className={`px-3 py-1 rounded text-sm transition-colors ${
                                viewMode === "line"
                                    ? "bg-white text-indigo-600 shadow"
                                    : "text-gray-600 hover:text-gray-800"
                            }`}
                        >
                            Line
                        </button>
                        <button
                            onClick={() => setViewMode("area")}
                            className={`px-3 py-1 rounded text-sm transition-colors ${
                                viewMode === "area"
                                    ? "bg-white text-indigo-600 shadow"
                                    : "text-gray-600 hover:text-gray-800"
                            }`}
                        >
                            Area
                        </button>
                    </div>

                    {/* Month/Year Selectors */}
                    <div className="flex space-x-2">
                        <select
                            value={selectedMonth}
                            onChange={(e) =>
                                setSelectedMonth(parseInt(e.target.value))
                            }
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        >
                            {generateMonthOptions().map((month) => (
                                <option key={month.value} value={month.value}>
                                    {month.label}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedYear}
                            onChange={(e) =>
                                setSelectedYear(parseInt(e.target.value))
                            }
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        >
                            {generateYearOptions().map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h4 className="text-sm font-medium text-blue-700">
                        Monthly Average
                    </h4>
                    <p className="text-2xl font-bold text-blue-900">
                        {Math.round(
                            monthlyData?.averageDailyUtilizationPercentage || 0,
                        )}
                        %
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                        Average daily utilization
                    </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <h4 className="text-sm font-medium text-green-700">
                        Total Usage
                    </h4>
                    <p className="text-2xl font-bold text-green-900">
                        {monthlyData?.totalUtilizedHours || 0}h
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                        {monthlyData?.totalUtilizedMinutesRemainder || 0}m
                        additional
                    </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <h4 className="text-sm font-medium text-purple-700">
                        Peak Day
                    </h4>
                    <p className="text-xl font-bold text-purple-900">
                        {monthlyData?.peakDay
                            ? parseDisplayDate(
                                  monthlyData.peakDay.date,
                              ).getDate()
                            : "N/A"}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                        {Math.round(
                            monthlyData?.peakDay?.utilizationPercentage || 0,
                        )}
                        % utilization
                    </p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                    <h4 className="text-sm font-medium text-orange-700">
                        Business Days
                    </h4>
                    <p className="text-2xl font-bold text-orange-900">
                        {monthlyData?.businessDaysCount || 0}
                    </p>
                    <p className="text-xs text-orange-600 mt-1">
                        Days with activity
                    </p>
                </div>
            </div>

            {/* Monthly Trend Chart */}
            <div className="mb-6">
                <h4 className="text-md font-medium text-gray-700 mb-3">
                    Daily Utilization for {getMonthName(selectedMonth)}{" "}
                    {selectedYear}
                </h4>
                <ResponsiveContainer width="100%" height={350}>
                    {renderChart()}
                </ResponsiveContainer>
            </div>

            {/* Monthly Statistics */}
            {monthlyData && (
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-md font-medium text-gray-700 mb-3">
                        Monthly Statistics
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="text-gray-600">
                                Overall Utilization:
                            </span>
                            <span className="font-semibold text-gray-800 ml-2">
                                {Math.round(
                                    monthlyData.monthlyUtilizationPercentage,
                                )}
                                %
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-600">Low Day:</span>
                            <span className="font-semibold text-gray-800 ml-2">
                                {monthlyData.lowDay
                                    ? parseDisplayDate(
                                          monthlyData.lowDay.date,
                                      ).getDate()
                                    : "N/A"}
                                (
                                {Math.round(
                                    monthlyData.lowDay?.utilizationPercentage ||
                                        0,
                                )}
                                %)
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-600">
                                Total Possible Hours:
                            </span>
                            <span className="font-semibold text-gray-800 ml-2">
                                {Math.floor(
                                    (monthlyData.totalPossibleMinutes || 0) /
                                        60,
                                )}
                                h
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
