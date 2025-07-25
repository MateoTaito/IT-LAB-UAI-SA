import React, { useState, useEffect } from "react";
import { User, UserCreationState } from "../../../../api/UsersApi";
import { getRolesForUsers, Role } from "../../../../api/RolesApi";

interface UserModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (userData: any, onStateChange?: (state: UserCreationState, message?: string) => void) => Promise<void>;
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

	const [selectedRole, setSelectedRole] = useState<string>("");
	const [roles, setRoles] = useState<Role[]>([]);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [creationState, setCreationState] = useState<UserCreationState>(UserCreationState.IDLE);
	const [stateMessage, setStateMessage] = useState<string>("");

	// Load roles when component mounts or when modal opens
	useEffect(() => {
		if (isOpen) {
			if (!isEdit) {
				loadRoles();
			}
		}
	}, [isOpen, isEdit]);

	const loadRoles = async () => {
		try {
			const availableRoles = await getRolesForUsers();
			setRoles(availableRoles);
			// Set default role if available
			if (availableRoles.length > 0) {
				setSelectedRole(availableRoles[0].Name);
			}
		} catch (error) {
			console.error("Error loading roles:", error);
		}
	};

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

		if (!isEdit && !selectedRole?.trim()) {
			newErrors.Role = "Role is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (validate()) {
			setIsSubmitting(true);
			setCreationState(UserCreationState.IDLE);
			setStateMessage("");

			try {
				const handleStateChange = (state: UserCreationState, message?: string) => {
					setCreationState(state);
					setStateMessage(message || "");
					
					// Close modal when success state is reached
					if (state === UserCreationState.SUCCESS) {
						setTimeout(() => {
							setIsSubmitting(false);
							setCreationState(UserCreationState.IDLE);
							setStateMessage("");
							onClose();
						}, 1500);
					}
				};

				// Rename LastName to Lastname for create user API if needed and include the role
				if (!isEdit && formData.LastName) {
					await onSubmit({
						...formData,
						LastName: formData.LastName,
						Role: selectedRole, // Include the selected role
					}, handleStateChange);
				} else {
					await onSubmit(formData, handleStateChange);
				}
			} catch (error) {
				setIsSubmitting(false);
				setCreationState(UserCreationState.ERROR);
				setStateMessage("An error occurred. Please try again.");
			}
		}
	};

	const getSubmitButtonText = () => {
		if (!isSubmitting) {
			return isEdit ? "Save Changes" : "Add User";
		}

		switch (creationState) {
			case UserCreationState.CREATING_USER:
				return "Creating User...";
			case UserCreationState.WAITING_FINGERPRINT:
				return "Waiting for Fingerprint...";
			case UserCreationState.ENROLLING_FINGERPRINT:
				return "Enrolling Fingerprint...";
			case UserCreationState.SUCCESS:
				return "Success!";
			case UserCreationState.ERROR:
				return "Error Occurred";
			default:
				return "Processing...";
		}
	};

	const getSubmitButtonColor = () => {
		if (creationState === UserCreationState.SUCCESS) {
			return "bg-green-600 hover:bg-green-700";
		}
		if (creationState === UserCreationState.ERROR) {
			return "bg-red-600 hover:bg-red-700";
		}
		if (creationState === UserCreationState.WAITING_FINGERPRINT) {
			return "bg-yellow-600 hover:bg-yellow-700";
		}
		return "bg-indigo-600 hover:bg-indigo-700";
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white p-6 rounded-lg max-w-md w-full">
				<h3 className="text-lg font-medium mb-4">{title}</h3>

				{/* Progress indicator for user operations */}
				{isSubmitting && (
					<div className="mb-4 p-3 rounded-md bg-blue-50 border border-blue-200">
						<div className="flex items-center">
							{creationState === UserCreationState.WAITING_FINGERPRINT ? (
								<div className="animate-pulse w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
							) : creationState === UserCreationState.SUCCESS ? (
								<div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
							) : creationState === UserCreationState.ERROR ? (
								<div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
							) : (
								<div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
							)}
							<span className="text-sm text-gray-700">{stateMessage}</span>
						</div>

						{creationState === UserCreationState.WAITING_FINGERPRINT && (
							<div className="mt-2 text-xs text-yellow-700">
								Please place finger on the fingerprint scanner and wait for {isEdit ? 'update' : 'enrollment'} to complete.
							</div>
						)}
					</div>
				)}

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
								disabled={isSubmitting}
								className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.Rut ? "border-red-500" : ""
									} ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
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
								disabled={isSubmitting}
								className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.Email ? "border-red-500" : ""
									} ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
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
								disabled={isSubmitting}
								className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.Name ? "border-red-500" : ""
									} ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
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
								disabled={isSubmitting}
								className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.LastName ? "border-red-500" : ""
									} ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
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
									disabled={isSubmitting}
									className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""
										}`}
								>
									<option value="active">Active</option>
									<option value="inactive">Inactive</option>
								</select>
							</div>
						)}

						{/* Role Field - only shown for create mode */}
						{!isEdit && (
							<div>
								<label htmlFor="Role" className="block text-sm font-medium text-gray-700 mb-1">
									Role
								</label>
								<select
									id="Role"
									name="Role"
									value={selectedRole}
									onChange={(e) => setSelectedRole(e.target.value)}
									disabled={isSubmitting}
									className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
										errors.Role ? "border-red-500" : ""
									} ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
								>
									{roles.map(role => (
										<option key={role.Id} value={role.Name}>{role.Name}</option>
									))}
								</select>
								{errors.Role && <p className="mt-1 text-xs text-red-600">{errors.Role}</p>}
							</div>
						)}
					</div>

					{/* Form Actions */}
					<div className="mt-6 flex justify-end space-x-3">
						<button
							type="button"
							className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
							onClick={onClose}
							disabled={isSubmitting}
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md disabled:cursor-not-allowed disabled:opacity-50 ${getSubmitButtonColor()}`}
						>
							{isSubmitting && (
								<div className="inline-flex items-center">
									{creationState !== UserCreationState.WAITING_FINGERPRINT && (
										<div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
									)}
									{getSubmitButtonText()}
								</div>
							)}
							{!isSubmitting && (isEdit ? "Save Changes" : "Add User")}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
