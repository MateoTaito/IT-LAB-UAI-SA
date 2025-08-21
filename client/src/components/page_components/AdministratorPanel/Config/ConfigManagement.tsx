import React, { useState, useEffect } from "react";
import {
    getActualConfig,
    updateConfig,
    InstanceConfigDTO,
} from "../../../../api/ConfigApi";
import { useAuth } from "../../../../context/AuthContext";

export default function ConfigManagement() {
    const { adminName } = useAuth();
    const [config, setConfig] = useState<InstanceConfigDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [updating, setUpdating] = useState<boolean>(false);
    const [editing, setEditing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Form state for editing
    const [formData, setFormData] = useState({
        inicialHour: "",
        finalHour: "",
        maxCapacity: 0,
        lastUpdated: "",
        updatedBy: "",
    });

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getActualConfig();

            // Handle API response - adjust based on your actual API response format
            if (Array.isArray(data) && data.length > 0) {
                setConfig(data[0]);
            } else if (data && !Array.isArray(data)) {
                // If API returns single object
                setConfig(data as InstanceConfigDTO);
            } else {
                setConfig(null);
                setError("No configuration found");
            }
        } catch (err) {
            setError("Failed to fetch configuration");
            console.error("Error fetching config:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditConfig = () => {
        if (!config) return;

        setEditing(true);
        setFormData({
            inicialHour: config.inicialHour,
            finalHour: config.finalHour,
            maxCapacity: config.maxCapacity,
            lastUpdated: config.lastUpdated,
            updatedBy: config.updatedBy,
        });
        setError(null);
        setSuccessMessage(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "maxCapacity" ? parseInt(value) || 0 : value,
        }));
    };

    const handleUpdateConfig = async () => {
        try {
            setUpdating(true);
            setError(null);
            setSuccessMessage(null);

            const updatedConfigData: InstanceConfigDTO = {
                ...formData,
                lastUpdated: new Date().toISOString(),
                updatedBy: adminName || "Administrator",
            };

            const result = await updateConfig(updatedConfigData);

            // Handle response based on your API
            if (Array.isArray(result) && result.length > 0) {
                setConfig(result[0]);
            } else if (result && !Array.isArray(result)) {
                setConfig(result as InstanceConfigDTO);
            }

            setSuccessMessage("Configuration updated successfully!");
            setEditing(false);

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            setError("Failed to update configuration");
            console.error("Error updating config:", err);
        } finally {
            setUpdating(false);
        }
    };

    const handleCancelEdit = () => {
        setEditing(false);
        setFormData({
            inicialHour: "",
            finalHour: "",
            maxCapacity: 0,
            lastUpdated: "",
            updatedBy: "",
        });
        setError(null);
        setSuccessMessage(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <span className="ml-2 text-gray-600">
                    Loading configuration...
                </span>
            </div>
        );
    }

    if (!config && !loading) {
        return (
            <div className="space-y-6">
                <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Instance Configuration
                    </h1>
                    <p className="text-gray-600 mb-6">No configuration found</p>
                    <button
                        onClick={fetchConfig}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                    >
                        Refresh
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Instance Configuration
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage laboratory instance settings
                    </p>
                </div>
                <div className="flex space-x-3">
                    {!editing && (
                        <button
                            onClick={handleEditConfig}
                            disabled={updating}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 disabled:opacity-50"
                        >
                            Edit Configuration
                        </button>
                    )}
                    <button
                        onClick={fetchConfig}
                        disabled={loading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors duration-200 disabled:opacity-50"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {/* Error and Success Messages */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                    {successMessage}
                </div>
            )}

            {/* Configuration Display/Edit */}
            {config && (
                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                    {!editing ? (
                        /* View Mode */
                        <div className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Initial Hour
                                    </label>
                                    <div className="text-lg text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                                        {config.inicialHour}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Final Hour
                                    </label>
                                    <div className="text-lg text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                                        {config.finalHour}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Max Capacity
                                    </label>
                                    <div className="text-lg text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                                        {config.maxCapacity} users
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Last Updated
                                    </label>
                                    <div className="text-lg text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                                        {new Date(
                                            config.lastUpdated,
                                        ).toLocaleString()}
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Updated By
                                    </label>
                                    <div className="text-lg text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                                        {config.updatedBy}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Edit Mode */
                        <div className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Initial Hour
                                    </label>
                                    <input
                                        type="time"
                                        name="inicialHour"
                                        value={formData.inicialHour}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Final Hour
                                    </label>
                                    <input
                                        type="time"
                                        name="finalHour"
                                        value={formData.finalHour}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Max Capacity
                                    </label>
                                    <input
                                        type="number"
                                        name="maxCapacity"
                                        value={formData.maxCapacity}
                                        onChange={handleInputChange}
                                        min="1"
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                                <button
                                    onClick={handleCancelEdit}
                                    disabled={updating}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors duration-200 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateConfig}
                                    disabled={updating}
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors duration-200 disabled:opacity-50 flex items-center"
                                >
                                    {updating && (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    )}
                                    {updating
                                        ? "Updating..."
                                        : "Update Configuration"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
