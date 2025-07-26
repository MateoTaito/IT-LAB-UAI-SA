import React, { useState, useEffect } from "react";
import { getTopUsers, TopUser } from "../../../../api/AttendanceApi";

export default function TopUsersTable() {
    const [topUsers, setTopUsers] = useState<TopUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTopUsers();
    }, []);

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
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Top 5 Usuarios Más Activos</h3>
                <div className="animate-pulse space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Top 5 Usuarios Más Activos</h3>

            {topUsers.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No hay datos de usuarios disponibles</p>
            ) : (
                <div className="space-y-3">
                    {topUsers.map((user, index) => (
                        <div
                            key={user.userId}
                            className={`flex items-center justify-between p-4 rounded-lg border ${index === 0 ? 'bg-yellow-50 border-yellow-200' :
                                    index === 1 ? 'bg-gray-50 border-gray-200' :
                                        index === 2 ? 'bg-orange-50 border-orange-200' :
                                            'bg-blue-50 border-blue-200'
                                }`}
                        >
                            <div className="flex items-center space-x-4">
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-white ${index === 0 ? 'bg-yellow-500' :
                                        index === 1 ? 'bg-gray-500' :
                                            index === 2 ? 'bg-orange-500' :
                                                'bg-blue-500'
                                    }`}>
                                    {index + 1}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {user.name} {user.lastName}
                                    </p>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="font-semibold text-gray-900">
                                    {formatTime(user.totalTimeHours)}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {user.sessionCount} sesiones
                                </p>
                                <p className="text-xs text-gray-500">
                                    Promedio: {formatTime(user.averageSessionHours)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                    * Basado en sesiones completadas (con check-out)
                </p>
            </div>
        </div>
    );
}
