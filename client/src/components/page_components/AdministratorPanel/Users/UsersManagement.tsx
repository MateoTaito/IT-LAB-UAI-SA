import React, { useState, useEffect } from "react";
import { listUsers, createUser, createUserTest, deleteUser, deleteUserTest, updateUserStatus, assignRoleToUser, User, UserCreationState } from "../../../../api/UsersApi";
import UserModal from "./UserModal";

export default function UsersManagement() {
	const [users, setUsers] = useState<User[]>([]);
	const [showAddModal, setShowAddModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [testEnv, setTestEnv] = useState<boolean>(false);

	// Fetch users when component mounts
	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			setLoading(true);
			const fetchedUsers = await listUsers();
			setUsers(fetchedUsers);
			setError(null);
		} catch (err) {
			console.error("Error fetching users:", err);
			setError("Failed to load users. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	// Filter users based on search term
	const filteredUsers = users.filter(
		(user) =>
			user.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.LastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.Rut.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Add new user
	const handleAddUser = async (userData: Partial<User> & { Role?: string }, onStateChange?: (state: UserCreationState, message?: string) => void): Promise<void> => {
		try {
			// Structure payload to match API expectations
			const newUser = {
				Rut: userData.Rut || "",
				Email: userData.Email || "",
				Name: userData.Name || "",
				Lastname: userData.LastName || "", // Note: API expects Lastname not LastName
			};

			// First create the user
			let createdUser;
			if (testEnv) {
				createdUser = await createUserTest(newUser, onStateChange);
			} else {
				createdUser = await createUser(newUser, onStateChange);
			}

			// After user creation, assign the role if provided
			if (userData.Role && createdUser) {
				try {
					await assignRoleToUser(createdUser.Email, userData.Role);
				} catch (roleErr) {
					console.error("Error assigning role to user:", roleErr);
					// Continue with user creation even if role assignment fails
				}
			}

			// Refresh the users list after successful creation
			await fetchUsers();
		} catch (err: any) {
			console.error("Error creating user:", err);
			throw err; // Re-throw to let modal handle the error
		}
	};

	// Update user status - Modified to accept partial user data
	const handleUpdateUser = async (userData: any): Promise<void> => {
		try {
			if (currentUser && userData.Status && userData.Status !== currentUser.Status) {
				await updateUserStatus(userData.Email, userData.Status as "active" | "inactive");
			}

			await fetchUsers();
			setShowEditModal(false);
			setCurrentUser(null);
		} catch (err: any) {
			console.error("Error updating user:", err);
			throw err; // Re-throw to let modal handle the error
		}
	};

	// Delete user
	const handleDeleteUser = async (email: string) => {
		if (window.confirm("Are you sure you want to delete this user?")) {
			try {
				if (testEnv) {
					await deleteUserTest(email);
				}
				else {
					await deleteUser(email);
				}
				await fetchUsers();
				// Clear any previous errors
				setError(null);
			} catch (err: any) {
				console.error("Error deleting user:", err);
				// Provide more detailed error message
				const errorMessage = err.response?.data?.error ||
					err.response?.data?.details ||
					"Failed to delete user. Please try again.";

				setError(`Error: ${errorMessage}`);
			}
		}
	};

	// Set up user for editing
	const handleEditClick = (user: User) => {
		setCurrentUser(user);
		setShowEditModal(true);
	};

	// Toggle user status
	const toggleUserStatus = async (email: string, currentStatus: string) => {
		const newStatus = currentStatus === "active" ? "inactive" : "active";
		try {
			await updateUserStatus(email, newStatus as "active" | "inactive");
			await fetchUsers();
		} catch (err: any) {
			console.error("Error toggling user status:", err);
			setError(err.response?.data?.error || "Failed to update user status. Please try again.");
		}
	};

	return (
		<div>
			{error && (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>
			)}

			<div className="bg-white p-6 rounded-lg shadow mb-6">
				<div className="flex justify-between items-center mb-6">
					<div className="flex items-center gap-4">
						<h2 className="text-xl font-semibold text-gray-800">User Management</h2>

						{/* Test Environment Toggle */}
						<div className="flex items-center gap-2">
							<span className="text-sm text-gray-600">Test Mode:</span>
							<label className="relative inline-flex items-center cursor-pointer">
								<label htmlFor="testEnvToggle" className="sr-only">Toggle Test Mode</label>
								<input
									id="testEnvToggle"
									type="checkbox"
									className="sr-only peer"
									checked={testEnv}
									onChange={(e) => setTestEnv(e.target.checked)}
									title="Toggle test environment mode"
									placeholder="Toggle test environment mode"
								/>
								<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
							</label>
							<span className={`text-xs font-medium ${testEnv ? 'text-blue-600' : 'text-gray-500'}`}>
								{testEnv ? 'ON' : 'OFF'}
							</span>
						</div>
					</div>

					<button
						onClick={() => setShowAddModal(true)}
						className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
					>
						Add User
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
							placeholder="Search users by name, email, or RUT..."
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

				{/* Users Table */}
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
										RUT
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Email
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Status
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Roles
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
								{filteredUsers.map((user) => (
									<tr key={user.Id}>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm font-medium text-gray-900">
												{user.Name} {user.LastName}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-gray-500">{user.Rut}</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-gray-500">{user.Email}</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span
												className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
												${user.Status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
											>
												{user.Status}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex flex-wrap gap-1">
												{user.Roles && user.Roles.length > 0 ? (
													<>
														{user.Roles.map((role, idx) => (
															<span
																key={idx}
																className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full"
															>
																{role}
															</span>
														))}
													</>
												) : (
													<span className="text-sm text-gray-500">No roles</span>
												)}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
											<button
												onClick={() => handleEditClick(user)}
												className="text-indigo-600 hover:text-indigo-900 mr-3"
											>
												Edit
											</button>
											<button
												onClick={() => toggleUserStatus(user.Email, user.Status)}
												className={`text-yellow-600 hover:text-yellow-900 mr-3`}
												title={user.Status === "active" ? "Deactivate user" : "Activate user"}
											>
												{user.Status === "active" ? "Deactivate" : "Activate"}
											</button>
											<button
												onClick={() => handleDeleteUser(user.Email)}
												className="text-red-600 hover:text-red-900"
											>
												Delete
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>

						{filteredUsers.length === 0 && !loading && (
							<div className="text-center py-4">
								<p className="text-gray-500">No users found</p>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Add User Modal */}
			{showAddModal && (
				<UserModal
					isOpen={showAddModal}
					onClose={() => setShowAddModal(false)}
					onSubmit={handleAddUser}
					title="Add New User"
				/>
			)}

			{/* Edit User Modal - Updated to handle the complete User object */}
			{showEditModal && currentUser && (
				<UserModal
					isOpen={showEditModal}
					onClose={() => {
						setShowEditModal(false);
						setCurrentUser(null);
					}}
					onSubmit={(userData) => handleUpdateUser({ ...currentUser, ...userData })}
					title="Edit User"
					initialData={currentUser}
					isEdit={true}
				/>
			)}
		</div>
	);
}
