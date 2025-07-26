import React, { useState, useEffect } from "react";
import { getLabUtilization, getMonthlyUtilization, LabUtilization, MonthlyUtilization } from "../../../../api/AttendanceApi";

export default function HistoricalMetrics() {
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

    const [dailyUtilization, setDailyUtilization] = useState<LabUtilization | null>(null);
    const [monthlyUtilization, setMonthlyUtilization] = useState<MonthlyUtilization | null>(null);

    const [loadingDaily, setLoadingDaily] = useState(false);
    const [loadingMonthly, setLoadingMonthly] = useState(false);

    const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('daily');

    // Generate years for the selector (current year and past 2 years)
    const years: number[] = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 2; i--) {
        years.push(i);
    }

    // Month names
    const months = [
        { value: 1, label: "Enero" },
        { value: 2, label: "Febrero" },
        { value: 3, label: "Marzo" },
        { value: 4, label: "Abril" },
        { value: 5, label: "Mayo" },
        { value: 6, label: "Junio" },
        { value: 7, label: "Julio" },
        { value: 8, label: "Agosto" },
        { value: 9, label: "Septiembre" },
        { value: 10, label: "Octubre" },
        { value: 11, label: "Noviembre" },
        { value: 12, label: "Diciembre" }
    ];

    useEffect(() => {
        // Load current month on component mount
        fetchMonthlyUtilization();
    }, []);

    const fetchDailyUtilization = async () => {
        if (!selectedDate) return;

        setLoadingDaily(true);
        try {
            const data = await getLabUtilization(selectedDate);
            setDailyUtilization(data);
        } catch (error) {
            console.error("Error fetching daily utilization:", error);
        } finally {
            setLoadingDaily(false);
        }
    };

    const fetchMonthlyUtilization = async () => {
        setLoadingMonthly(true);
        try {
            const data = await getMonthlyUtilization(selectedMonth, selectedYear);
            setMonthlyUtilization(data);
        } catch (error) {
            console.error("Error fetching monthly utilization:", error);
        } finally {
            setLoadingMonthly(false);
        }
    };

    const formatTime = (hours: number, minutes: number) => {
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Métricas Históricas</h3>

            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
                <button
                    onClick={() => setActiveTab('daily')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'daily'
                            ? 'bg-white text-indigo-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    Consulta Diaria
                </button>
                <button
                    onClick={() => setActiveTab('monthly')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'monthly'
                            ? 'bg-white text-indigo-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    Consulta Mensual
                </button>
            </div>

            {/* Daily Tab */}
            {activeTab === 'daily' && (
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="flex-1">
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                                Seleccionar Fecha
                            </label>
                            <input
                                type="date"
                                id="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <button
                            onClick={fetchDailyUtilization}
                            disabled={!selectedDate || loadingDaily}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loadingDaily ? 'Cargando...' : 'Consultar'}
                        </button>
                    </div>

                    {dailyUtilization && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold text-gray-800 mb-3">
                                Utilización del {formatDate(dailyUtilization.date)}
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-indigo-600">
                                        {dailyUtilization.utilizationPercentage}%
                                    </p>
                                    <p className="text-sm text-gray-600">Porcentaje de Utilización</p>
                                </div>

                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">
                                        {formatTime(dailyUtilization.utilizationHours, dailyUtilization.utilizationMinutesRemainder)}
                                    </p>
                                    <p className="text-sm text-gray-600">Tiempo Total Utilizado</p>
                                </div>

                                <div className="text-center">
                                    <p className="text-2xl font-bold text-purple-600">
                                        {dailyUtilization.currentOccupancy}/{dailyUtilization.maxCapacity}
                                    </p>
                                    <p className="text-sm text-gray-600">Ocupación Actual</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Monthly Tab */}
            {activeTab === 'monthly' && (
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="flex-1">
                            <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-2">
                                Mes
                            </label>
                            <select
                                id="month"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {months.map((month) => (
                                    <option key={month.value} value={month.value}>
                                        {month.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-1">
                            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                                Año
                            </label>
                            <select
                                id="year"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={fetchMonthlyUtilization}
                            disabled={loadingMonthly}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loadingMonthly ? 'Cargando...' : 'Consultar'}
                        </button>
                    </div>

                    {monthlyUtilization && (
                        <div className="mt-6 space-y-6">
                            {/* Monthly Summary */}
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-semibold text-gray-800 mb-3">
                                    Resumen de {months.find(m => m.value === monthlyUtilization.month)?.label} {monthlyUtilization.year}
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-indigo-600">
                                            {monthlyUtilization.monthlyUtilizationPercentage}%
                                        </p>
                                        <p className="text-sm text-gray-600">Utilización Mensual</p>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-green-600">
                                            {monthlyUtilization.averageDailyUtilizationPercentage}%
                                        </p>
                                        <p className="text-sm text-gray-600">Promedio Diario</p>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-purple-600">
                                            {formatTime(monthlyUtilization.totalUtilizedHours, monthlyUtilization.totalUtilizedMinutesRemainder)}
                                        </p>
                                        <p className="text-sm text-gray-600">Tiempo Total</p>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-orange-600">
                                            {monthlyUtilization.businessDaysCount}
                                        </p>
                                        <p className="text-sm text-gray-600">Días Laborables</p>
                                    </div>
                                </div>
                            </div>

                            {/* Peak and Low Days */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                    <h5 className="font-medium text-green-800 mb-2">Día Pico</h5>
                                    <p className="text-lg font-bold text-green-700">
                                        {monthlyUtilization.peakDay?.utilizationPercentage}%
                                    </p>
                                    <p className="text-sm text-green-600">
                                        {monthlyUtilization.peakDay?.date && formatDate(monthlyUtilization.peakDay.date)}
                                    </p>
                                </div>

                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <h5 className="font-medium text-blue-800 mb-2">Día de Menor Uso</h5>
                                    <p className="text-lg font-bold text-blue-700">
                                        {monthlyUtilization.lowDay?.utilizationPercentage}%
                                    </p>
                                    <p className="text-sm text-blue-600">
                                        {monthlyUtilization.lowDay?.date && formatDate(monthlyUtilization.lowDay.date)}
                                    </p>
                                </div>
                            </div>

                            {/* Daily Breakdown Preview */}
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h5 className="font-medium text-gray-800 mb-3">Últimos 7 Días del Mes</h5>
                                <div className="space-y-2">
                                    {monthlyUtilization.dailyBreakdown
                                        .slice(-7)
                                        .map((day) => (
                                            <div key={day.date} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                                                <span className="text-sm text-gray-600">
                                                    {new Date(day.date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })}
                                                </span>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm font-medium">{day.utilizationPercentage}%</span>
                                                    <div className="w-20 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={`bg-indigo-600 h-2 rounded-full`}
                                                            style={{ width: `${Math.min(day.utilizationPercentage, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
