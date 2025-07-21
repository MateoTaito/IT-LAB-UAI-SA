import React, { useState, useEffect } from "react";
import { listReasons, createReason, deleteReasonByName, Reason } from "../../../../api/ReasonsApi";
import ReasonModal from "./ReasonModal";

export default function ReasonsManagement() {
	const [reasons, setReasons] = useState<Reason[]>([]);
	const [showAddModal, setShowAddModal] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch reasons when component mounts
	useEffect(() => {
		fetchReasons();
	}, []);

	const fetchReasons = async () => {
		try {
			setLoading(true);
			const fetchedReasons = await listReasons();
			setReasons(fetchedReasons);
			setError(null);
		} catch (err) {
			console.error("Error fetching reasons:", err);
			setError("Failed to load reasons. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	// Filter reasons based on search term
	const filteredReasons = reasons.filter(
		(reason) =>
			reason.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(reason.Description && reason.Description.toLowerCase().includes(searchTerm.toLowerCase()))
	);

	// Add new reason
	const handleAddReason = async (reasonData: { Name: string; Description?: string }): Promise<void> => {
		try {
			await createReason(reasonData);
			await fetchReasons();
		} catch (err: any) {
			console.error("Error creating reason:", err);
			setError(err.response?.data?.error || "Failed to create reason. Please try again.");
			throw err;
		}
	};

	// Delete reason
	const handleDeleteReason = async (name: string) => {
		if (window.confirm(`Are you sure you want to delete the reason "${name}"?`)) {
			try {
				await deleteReasonByName(name);
				await fetchReasons();
			} catch (err: any) {
				console.error("Error deleting reason:", err);
				setError(err.response?.data?.error || "Failed to delete reason. Please try again.");
			}
		}
	};

	return (
		<div>
			{error && (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
					{error}
					<button
						onClick={() => setError(null)}
						className="float-right text-red-500 hover:text-red-700"
					>
						×
					</button>
				</div>
			)}

			<div className="bg-white p-6 rounded-lg shadow mb-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold text-gray-800">Reasons Management</h2>
					<button
						onClick={() => setShowAddModal(true)}
						className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
					>
						Add Reason
					</button>
				</div>

				{/* Search Bar */}
				<div className="mb-6">
					<div className="relative">
						<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
							<svg
								className="w-4 h-4 text-gray-500"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</div>
						<input
							type="text"
							className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
							placeholder="Search reasons by name or description..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>

				{/* Loading indicator */}
				{loading && (
					<div className="flex justify-center items-center py-8">
						<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
					</div>
				)}

				{/* Reasons Table */}
				{!loading && (
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Name
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Description
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{filteredReasons.map((reason) => (
									<tr key={reason.Id}>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm font-medium text-gray-900">
												{reason.Name}
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="text-sm text-gray-500 max-w-xs">
												{reason.Description || "No description provided"}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
											<button
												onClick={() => handleDeleteReason(reason.Name)}
												className="text-red-600 hover:text-red-900"
											>
												Delete
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>

						{filteredReasons.length === 0 && !loading && (
							<div className="text-center py-8">
								<div className="text-gray-500">
									{searchTerm ? "No reasons found matching your search" : "No reasons found"}
								</div>
								{!searchTerm && (
									<button
										onClick={() => setShowAddModal(true)}
										className="mt-2 text-indigo-600 hover:text-indigo-900 font-medium"
									>
										Add the first reason
									</button>
								)}
							</div>
						)}
					</div>
				)}
			</div>

			{/* Add Reason Modal */}
			{showAddModal && (
				<ReasonModal
					isOpen={showAddModal}
					onClose={() => setShowAddModal(false)}
					onSubmit={handleAddReason}
					title="Add New Reason"
				/>
			)}
		</div>
	);
}
