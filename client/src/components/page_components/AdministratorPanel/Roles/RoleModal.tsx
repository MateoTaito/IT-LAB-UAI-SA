import React, { useState } from "react";
import { Role } from "../../../../api/RolesApi";

interface RoleModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (roleData: Role) => void;
	title: string;
	initialData?: Role;
}

export default function RoleModal({ isOpen, onClose, onSubmit, title, initialData }: RoleModalProps) {
	const [formData, setFormData] = useState({
		Id: initialData?.Id || "",
		Name: initialData?.Name || "",
		Description: initialData?.Description || "",
		UserCount: initialData?.UserCount || 0,
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	if (!isOpen) return null;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
			newErrors.Name = "Role name is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (validate()) {
			onSubmit(formData as Role);
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
							<label htmlFor="Name" className="block text-sm font-medium text-gray-700 mb-1">
								Role Name
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

						{/* Description Field */}
						<div>
							<label htmlFor="Description" className="block text-sm font-medium text-gray-700 mb-1">
								Description
							</label>
							<textarea
								id="Description"
								name="Description"
								rows={3}
								value={formData.Description}
								onChange={handleChange}
								className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							/>
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
							{initialData ? "Save Changes" : "Add Role"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
