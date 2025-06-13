import React, { useState } from "react";
import { User } from "../../../../api/UsersApi";

interface UserModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (userData: any) => void; // Change to any to accommodate both partial and complete User
	title: string;
	initialData?: User;
	isEdit?: boolean;
}

export default function UserModal({ isOpen, onClose, onSubmit, title, initialData, isEdit = false }: UserModalProps) {
	const [formData, setFormData] = useState<Partial<User>>({
		Rut: initialData?.Rut || "",
		Email: initialData?.Email || "",
		Name: initialData?.Name || "",
		LastName: initialData?.LastName || "",
		Status: initialData?.Status || "active",
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	if (!isOpen) return null;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});

		// Clear error when field is edited
		if (errors[name]) {
			setErrors({
				...errors,
				[name]: "",
			});
		}
	};

	const validate = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.Rut?.trim()) {
			newErrors.Rut = "RUT is required";
		}

		if (!formData.Email?.trim()) {
			newErrors.Email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.Email)) {
			newErrors.Email = "Email is invalid";
		}

		if (!formData.Name?.trim()) {
			newErrors.Name = "Name is required";
		}

		if (!formData.LastName?.trim()) {
			newErrors.LastName = "Last name is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (validate()) {
			// Rename LastName to Lastname for create user API if needed
			if (!isEdit && formData.LastName) {
				onSubmit({
					...formData,
					LastName: formData.LastName,
				});
			} else {
				onSubmit(formData);
			}
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white p-6 rounded-lg max-w-md w-full">
				<h3 className="text-lg font-medium mb-4">{title}</h3>

				<form onSubmit={handleSubmit}>
					<div className="space-y-4">
						{/* Rut Field */}
						<div>
							<label htmlFor="Rut" className="block text-sm font-medium text-gray-700 mb-1">
								RUT
							</label>
							<input
								type="text"
								id="Rut"
								name="Rut"
								value={formData.Rut}
								onChange={handleChange}
								className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
									errors.Rut ? "border-red-500" : ""
								}`}
								placeholder="12345678-9"
							/>
							{errors.Rut && <p className="mt-1 text-xs text-red-600">{errors.Rut}</p>}
						</div>

						{/* Email Field */}
						<div>
							<label htmlFor="Email" className="block text-sm font-medium text-gray-700 mb-1">
								Email
							</label>
							<input
								type="email"
								id="Email"
								name="Email"
								value={formData.Email}
								onChange={handleChange}
								className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
									errors.Email ? "border-red-500" : ""
								}`}
								placeholder="user@example.com"
							/>
							{errors.Email && <p className="mt-1 text-xs text-red-600">{errors.Email}</p>}
						</div>

						{/* Name Field */}
						<div>
							<label htmlFor="Name" className="block text-sm font-medium text-gray-700 mb-1">
								Name
							</label>
							<input
								type="text"
								id="Name"
								name="Name"
								value={formData.Name}
								onChange={handleChange}
								className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
									errors.Name ? "border-red-500" : ""
								}`}
							/>
							{errors.Name && <p className="mt-1 text-xs text-red-600">{errors.Name}</p>}
						</div>

						{/* Last Name Field */}
						<div>
							<label htmlFor="LastName" className="block text-sm font-medium text-gray-700 mb-1">
								Last Name
							</label>
							<input
								type="text"
								id="LastName"
								name="LastName"
								value={formData.LastName}
								onChange={handleChange}
								className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
									errors.LastName ? "border-red-500" : ""
								}`}
							/>
							{errors.LastName && <p className="mt-1 text-xs text-red-600">{errors.LastName}</p>}
						</div>

						{/* Status Field - only shown for edit mode */}
						{isEdit && (
							<div>
								<label htmlFor="Status" className="block text-sm font-medium text-gray-700 mb-1">
									Status
								</label>
								<select
									id="Status"
									name="Status"
									value={formData.Status}
									onChange={handleChange}
									className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								>
									<option value="active">Active</option>
									<option value="inactive">Inactive</option>
								</select>
							</div>
						)}
					</div>

					{/* Form Actions */}
					<div className="mt-6 flex justify-end space-x-3">
						<button
							type="button"
							className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
							onClick={onClose}
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
						>
							{isEdit ? "Save Changes" : "Add User"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
