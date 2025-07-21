import React, { useState } from "react";
import { Reason } from "../../../../api/ReasonsApi";

interface ReasonModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (reasonData: { Name: string; Description?: string }) => Promise<void>;
	title: string;
	initialData?: Reason;
	isEdit?: boolean;
}

export default function ReasonModal({ isOpen, onClose, onSubmit, title, initialData, isEdit = false }: ReasonModalProps) {
	const [formData, setFormData] = useState({
		Name: initialData?.Name || "",
		Description: initialData?.Description || "",
	});

	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

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

		if (!formData.Name?.trim()) {
			newErrors.Name = "Reason name is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (validate()) {
			setIsSubmitting(true);
			try {
				await onSubmit({
					Name: formData.Name.trim(),
					Description: formData.Description.trim() || undefined,
				});
				setIsSubmitting(false);
				onClose();
			} catch (error) {
				setIsSubmitting(false);
				console.error("Error submitting reason:", error);
			}
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
								Reason Name*
							</label>
							<input
								type="text"
								id="Name"
								name="Name"
								value={formData.Name}
								onChange={handleChange}
								disabled={isSubmitting}
								className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
									errors.Name ? "border-red-500" : ""
								} ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
								placeholder="e.g., Study, Meeting, Research"
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
								value={formData.Description}
								onChange={handleChange}
								disabled={isSubmitting}
								rows={3}
								className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
									isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""
								}`}
								placeholder="Optional description of the reason for visiting"
							/>
						</div>
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
							className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isSubmitting ? (
								<div className="inline-flex items-center">
									<div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
									{isEdit ? "Saving..." : "Creating..."}
								</div>
							) : (
								isEdit ? "Save Changes" : "Create Reason"
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
