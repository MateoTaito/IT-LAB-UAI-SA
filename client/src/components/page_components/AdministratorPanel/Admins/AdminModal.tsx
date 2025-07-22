import React, { useState } from "react";

interface AdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (adminData: any) => Promise<void>;
}

export default function AdminModal({ isOpen, onClose, onSubmit }: AdminModalProps) {
    const [formData, setFormData] = useState({
        Rut: "",
        Email: "",
        Name: "",
        LastName: "",
        Password: "",
        confirmPassword: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.Rut.trim()) newErrors.Rut = "RUT is required";
        if (!formData.Email.trim()) newErrors.Email = "Email is required";
        if (!formData.Name.trim()) newErrors.Name = "Name is required";
        if (!formData.LastName.trim()) newErrors.LastName = "Last Name is required";
        if (!formData.Password.trim()) newErrors.Password = "Password is required";
        if (formData.Password.length < 6) newErrors.Password = "Password must be at least 6 characters";
        if (formData.Password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.Email && !emailRegex.test(formData.Email)) {
            newErrors.Email = "Invalid email format";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const adminData = {
                Rut: formData.Rut,
                Email: formData.Email,
                Name: formData.Name,
                LastName: formData.LastName,
                Password: formData.Password
            };
            
            await onSubmit(adminData);
            
            // Reset form
            setFormData({
                Rut: "",
                Email: "",
                Name: "",
                LastName: "",
                Password: "",
                confirmPassword: ""
            });
            setErrors({});
            onClose();
        } catch (error) {
            console.error("Error creating admin:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Create New Administrator</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                        disabled={isSubmitting}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            RUT *
                        </label>
                        <input
                            type="text"
                            name="Rut"
                            value={formData.Rut}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                errors.Rut ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="12345678-9"
                            disabled={isSubmitting}
                        />
                        {errors.Rut && <p className="text-red-500 text-xs mt-1">{errors.Rut}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                        </label>
                        <input
                            type="email"
                            name="Email"
                            value={formData.Email}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                errors.Email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="admin@example.com"
                            disabled={isSubmitting}
                        />
                        {errors.Email && <p className="text-red-500 text-xs mt-1">{errors.Email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name *
                        </label>
                        <input
                            type="text"
                            name="Name"
                            value={formData.Name}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                errors.Name ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="John"
                            disabled={isSubmitting}
                        />
                        {errors.Name && <p className="text-red-500 text-xs mt-1">{errors.Name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name *
                        </label>
                        <input
                            type="text"
                            name="LastName"
                            value={formData.LastName}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                errors.LastName ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Doe"
                            disabled={isSubmitting}
                        />
                        {errors.LastName && <p className="text-red-500 text-xs mt-1">{errors.LastName}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password *
                        </label>
                        <input
                            type="password"
                            name="Password"
                            value={formData.Password}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                errors.Password ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Minimum 6 characters"
                            disabled={isSubmitting}
                        />
                        {errors.Password && <p className="text-red-500 text-xs mt-1">{errors.Password}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password *
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Repeat password"
                            disabled={isSubmitting}
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating..." : "Create Administrator"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
