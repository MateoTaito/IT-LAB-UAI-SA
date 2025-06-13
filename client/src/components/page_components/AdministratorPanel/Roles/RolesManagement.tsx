import React, { useState, useEffect } from "react";
import { getRoles, createRole, deleteRole, updateRole, Role } from "../../../../api/RolesApi";
import RoleModal from "./RoleModal";

export default function RolesManagement() {
	const [roles, setRoles] = useState<Role[]>([]);
	const [showAddModal, setShowAddModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [currentRole, setCurrentRole] = useState<Role | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch roles when component mounts
	useEffect(() => {
		fetchRoles();
	}, []);

	const fetchRoles = async () => {
		try {
			setLoading(true);
			const fetchedRoles = await getRoles();
			setRoles(fetchedRoles);
			setError(null);
		} catch (err) {
			console.error("Error fetching roles:", err);
			setError("Failed to load roles. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	// Filter roles based on search term - modified to work with a single character
	const filteredRoles = roles.filter(
		(role) =>
			role.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			role.Description.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Add new role
	const handleAddRole = async (roleData: Partial<Role>) => {
		try {
			setLoading(true);
			await createRole({
				Name: roleData.Name || "New Role",
				Description: roleData.Description || "",
			});
			await fetchRoles();
			setShowAddModal(false);
		} catch (err: any) {
			console.error("Error creating role:", err);
			setError(err.response?.data?.error || "Failed to create role. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	// Update existing role
	const handleUpdateRole = async (roleData: Role) => {
		try {
			setLoading(true);

			// Determine what fields are being updated
			const updates: { NewName?: string; Description?: string } = {};

			// Only include fields that differ from the current role
			if (roleData.Name !== currentRole?.Name) {
				updates.NewName = roleData.Name;
			}

			if (roleData.Description !== currentRole?.Description) {
				updates.Description = roleData.Description;
			}

			// Only proceed if there are actual changes
			if (Object.keys(updates).length > 0 && currentRole) {
				await updateRole(currentRole.Name, updates);
				await fetchRoles();
			}

			setShowEditModal(false);
			setCurrentRole(null);
		} catch (err: any) {
			console.error("Error updating role:", err);
			const errorMessage = err.response?.data?.error || "Failed to update role. Please try again.";
			setError(errorMessage);

			// Handle specific error cases
			if (err.response?.status === 409) {
				setError("A role with this name already exists.");
			} else if (err.response?.status === 404) {
				setError("Role not found. It may have been deleted.");
				await fetchRoles(); // Refresh the list to reflect current state
			}
		} finally {
			setLoading(false);
		}
	};

	// Delete role - updated to use role name instead of ID
	const handleDeleteRole = async (roleName: string) => {
		if (window.confirm(`Are you sure you want to delete the "${roleName}" role?`)) {
			try {
				setLoading(true);
				await deleteRole(roleName);
				await fetchRoles();
				setError(null);
			} catch (err: any) {
				console.error("Error deleting role:", err);
				setError(err.response?.data?.error || "Failed to delete role. Please try again.");
			} finally {
				setLoading(false);
			}
		}
	};

	// Set up role for editing
	const handleEditClick = (role: Role) => {
		setCurrentRole(role);
		setShowEditModal(true);
	};

	return (
		<div>
			{error && (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>
			)}

			<div className="bg-white p-6 rounded-lg shadow mb-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold text-gray-800">Role Management</h2>
					<button
						onClick={() => setShowAddModal(true)}
						className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
						disabled={loading}
					>
						Add Role
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
							placeholder="Search roles..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							// Adding debounce is optional but can improve performance with large datasets
							// onKeyUp={(e) => setTimeout(() => setSearchTerm(e.target.value), 100)}
						/>
					</div>
				</div>

				{/* Loading indicator */}
				{loading && (
					<div className="flex justify-center items-center py-8">
						<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
					</div>
				)}

				{/* Roles Table */}
				{!loading && (
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Role
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Description
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Users
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
								{filteredRoles.map((role) => (
									<tr key={role.Id}>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm font-medium text-gray-900">{role.Name}</div>
										</td>
										<td className="px-6 py-4">
											<div className="text-sm text-gray-500">{role.Description}</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-gray-500">{role.UserCount || 0} users</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
											<button
												onClick={() => handleEditClick(role)}
												className="text-indigo-600 hover:text-indigo-900 mr-3"
											>
												Edit
											</button>
											<button
												onClick={() => handleDeleteRole(role.Name)}
												className={`text-red-600 hover:text-red-900 ${
													role.Name === "Administrator" ? "opacity-50 cursor-not-allowed" : ""
												}`}
												disabled={role.Name === "Administrator" || loading}
												title={
													role.Name === "Administrator"
														? "Cannot delete Administrator role"
														: ""
												}
											>
												Delete
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>

						{filteredRoles.length === 0 && !loading && (
							<div className="text-center py-4">
								<p className="text-gray-500">No roles found</p>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Add Role Modal */}
			{showAddModal && (
				<RoleModal
					isOpen={showAddModal}
					onClose={() => setShowAddModal(false)}
					onSubmit={handleAddRole}
					title="Add New Role"
				/>
			)}

			{/* Edit Role Modal */}
			{showEditModal && currentRole && (
				<RoleModal
					isOpen={showEditModal}
					onClose={() => {
						setShowEditModal(false);
						setCurrentRole(null);
					}}
					onSubmit={handleUpdateRole}
					title="Edit Role"
					initialData={currentRole}
				/>
			)}
		</div>
	);
}
