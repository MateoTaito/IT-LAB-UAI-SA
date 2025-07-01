import React, { useState, useEffect } from "react";
import { getVerificationUser, checkInUserPublic, checkOutUserPublic, listReasonsPublic, Reason } from "../../../api/VerificationApi";

export default function VerificationButtons() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [reasons, setReasons] = useState<Reason[]>([]);
    const [selectedReason, setSelectedReason] = useState("");

    useEffect(() => {
        loadReasons();
    }, []);

    const loadReasons = async () => {
        try {
            const reasonsList = await listReasonsPublic();
            setReasons(reasonsList);
            if (reasonsList.length > 0) {
                setSelectedReason(reasonsList[0].Name);
            }
        } catch (error) {
            console.error("Error loading reasons:", error);
            // Set default reason if API fails
            setSelectedReason("General");
        }
    };

    const handleArrival = async () => {
        setLoading(true);
        setMessage("");

        try {
            // First, get the user email from the verification endpoint
            const verificationResponse = await getVerificationUser();
            const userEmail = verificationResponse.email;

            if (!userEmail) {
                setMessage("No user detected. Please ensure you are properly authenticated.");
                return;
            }

            // Then record check-in with attendance API
            await checkInUserPublic({
                email: userEmail,
                checkIn: new Date(),
                Reason: selectedReason || "General"
            });

            setMessage(`Arrival recorded successfully for ${userEmail}!`);
        } catch (error: any) {
            console.error("Error recording arrival:", error);
            const errorMessage = error?.response?.data?.message || "Error recording arrival. Please try again.";
            setMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleDeparture = async () => {
        setLoading(true);
        setMessage("");

        try {
            // First, get the user email from the verification endpoint
            const verificationResponse = await getVerificationUser();
            const userEmail = verificationResponse.email;

            if (!userEmail) {
                setMessage("No user detected. Please ensure you are properly authenticated.");
                return;
            }

            // Then record check-out with attendance API
            await checkOutUserPublic({
                email: userEmail,
                checkOut: new Date()
            });

            setMessage(`Departure recorded successfully for ${userEmail}!`);
        } catch (error: any) {
            console.error("Error recording departure:", error);
            const errorMessage = error?.response?.data?.message || "Error recording departure. Please try again.";
            setMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-8 w-full max-w-md flex flex-col items-center">
            <img src="/logo_holder.png" alt="LAB-Control Logo" className="h-20 w-auto mb-6" />
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Lab Access Control</h1>            {message && (
                <div className={`mb-6 p-3 rounded-md text-sm text-center w-full ${message.includes("Error") || message.includes("error") || message.includes("No user")
                    ? "bg-red-100 text-red-700 border border-red-300"
                    : "bg-green-100 text-green-700 border border-green-300"
                    }`}>
                    {message}
                </div>
            )}

            {/* Reason Selection for Arrival */}
            {reasons.length > 0 && (
                <div className="w-full mb-6">
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                        Reason for Visit
                    </label>
                    <select
                        id="reason"
                        value={selectedReason}
                        onChange={(e) => setSelectedReason(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                    >
                        {reasons.map((reason) => (
                            <option key={reason.Id} value={reason.Name}>
                                {reason.Name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="space-y-4 w-full">
                <button
                    onClick={handleArrival}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-4 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 disabled:scale-100 shadow-md"
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Processing...
                        </div>
                    ) : (
                        <div className="flex items-center justify-center">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Record Arrival
                        </div>
                    )}
                </button>

                <button
                    onClick={handleDeparture}
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-4 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 disabled:scale-100 shadow-md"
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Processing...
                        </div>
                    ) : (
                        <div className="flex items-center justify-center">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Record Departure
                        </div>
                    )}
                </button>
            </div>

            <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                    Select your visit reason and use the buttons to record your attendance. User identification is automatic.
                </p>
            </div>
        </div>
    );
}
