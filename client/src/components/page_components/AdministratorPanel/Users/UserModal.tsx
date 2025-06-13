import React, { useState } from "react";

interface UserFormData {
	Name: string;
	LastName: string;
	Email: string;
	Password: string;
	Role?: string;
}

interface UserModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (userData: UserFormData) => void;
	title: string;
	initialData?: Partial<UserFormData>;
	isEdit?: boolean;
}

export default function UserModal({
	isOpen,
	onClose,
	onSubmit,
	title,
	initialData = {},
	isEdit = false,
}: UserModalProps) {
	const [formData, setFormData] = useState<UserFormData>({
		Name: initialData.Name || "",
		LastName: initialData.LastName || "",
		Email: initialData.Email || "",
		Password: initialData.Password || "",
		Role: initialData.Role || "User",
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

		if (!formData.Name.trim()) {
			newErrors.Name = "Name is required";
		}

		if (!formData.LastName.trim()) {
			newErrors.LastName = "Last name is required";
		}

		if (!formData.Email.trim()) {
			newErrors.Email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.Email)) {
			newErrors.Email = "Email is invalid";
		}

		if (!isEdit && !formData.Password.trim()) {
			newErrors.Password = "Password is required";
		} else if (!isEdit && formData.Password.length < 8) {
			newErrors.Password = "Password must be at least 8 characters";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (validate()) {
			onSubmit(formData);
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white p-6 rounded-lg max-w-md w-full">
				<h3 className="text-lg font-medium mb-4">{title}</h3>

				<form onSubmit={handleSubmit}>
					<div className="space-y-4">
						{/* Name Field */}
						<div>
							<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
								Name
							</label>
							<input
								type="text"
								id="name"
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
							<label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
								Last Name
							</label>
							<input
								type="text"
								id="lastName"
								name="LastName"
								value={formData.LastName}
								onChange={handleChange}
								className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
									errors.LastName ? "border-red-500" : ""
								}`}
							/>
							{errors.LastName && <p className="mt-1 text-xs text-red-600">{errors.LastName}</p>}
						</div>

						{/* Email Field */}
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
								Email
							</label>
							<input
								type="email"
								id="email"
								name="Email"
								value={formData.Email}
								onChange={handleChange}
								className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
									errors.Email ? "border-red-500" : ""
								}`}
							/>
							{errors.Email && <p className="mt-1 text-xs text-red-600">{errors.Email}</p>}
						</div>

						{/* Password Field - only show for new users */}
						{!isEdit && (
							<div>
								<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
									Password
								</label>
								<input
									type="password"
									id="password"
									name="Password"
									value={formData.Password}
									onChange={handleChange}
									className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
										errors.Password ? "border-red-500" : ""
									}`}
								/>
								{errors.Password && <p className="mt-1 text-xs text-red-600">{errors.Password}</p>}
							</div>
						)}

						{/* Role Field */}
						<div>
							<label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
								Role
							</label>
							<select
								id="role"
								name="Role"
								value={formData.Role}
								onChange={handleChange}
								className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							>
								<option value="User">User</option>
								<option value="Admin">Admin</option>
								<option value="Professor">Professor</option>
								<option value="Student">Student</option>
							</select>
						</div>
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
