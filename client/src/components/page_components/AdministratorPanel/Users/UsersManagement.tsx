import React, { useState, useEffect } from "react";
import { createUser, listUsers, deleteUser } from "../../../../api/UsersApi";
import UserModal from "./UserModal";

// Update the User interface to include Status property
interface User {
	Id: string;
	Name: string;
	LastName: string;
	Email: string;
	Role?: string;
	Status: string; // Make Status required since we'll always have a value for it
}

export default function UsersManagement() {
	const [users, setUsers] = useState<User[]>([]);
	const [showAddModal, setShowAddModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch users when component mounts
	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			setLoading(true);
			const fetchedUsers = await listUsers();
			// Add a default status if it's missing
			const usersWithStatus = fetchedUsers.map((user) => ({
				...user,
				Status: user.Status || "Active",
			}));
			setUsers(usersWithStatus);
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
			user.Email.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Add new user
	const handleAddUser = async (userData: any) => {
		try {
			setLoading(true);
			await createUser(userData);

			// Refresh the user list
			await fetchUsers();

			// Close the modal
			setShowAddModal(false);
		} catch (err: any) {
			console.error("Error creating user:", err);
			setError(err.response?.data?.error || "Failed to create user. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	// Delete user
	const handleDeleteUser = async (email: string) => {
		if (window.confirm("Are you sure you want to delete this user?")) {
			try {
				setLoading(true);
				await deleteUser(email);

				// Refresh the user list
				await fetchUsers();
			} catch (err: any) {
				console.error("Error deleting user:", err);
				setError(err.response?.data?.error || "Failed to delete user. Please try again.");
			} finally {
				setLoading(false);
			}
		}
	};

	// Set up user for editing
	const handleEditClick = (user: User) => {
		setCurrentUser(user);
		setShowEditModal(true);
	};

	return (
		<div>
			{error && (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>
			)}

			<div className="bg-white p-6 rounded-lg shadow mb-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold text-gray-800">User Management</h2>
					<button
						onClick={() => setShowAddModal(true)}
						className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
						disabled={loading}
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
							placeholder="Search users..."
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
										Email
									</th>
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
										Status
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
											<div className="text-sm text-gray-500">{user.Email}</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span
												className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
							user.Role === "Admin"
								? "bg-purple-100 text-purple-800"
								: user.Role === "Professor"
								? "bg-blue-100 text-blue-800"
								: "bg-green-100 text-green-800"
						}`}
											>
												{user.Role || "User"}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span
												className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.Status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
											>
												{user.Status}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
											<button
												onClick={() => handleEditClick(user)}
												className="text-indigo-600 hover:text-indigo-900 mr-3"
											>
												Edit
											</button>
											<button
												onClick={() => handleDeleteUser(user.Email)}
												className="text-red-600 hover:text-red-900"
												disabled={loading}
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

			{/* Edit User Modal */}
			{showEditModal && currentUser && (
				<UserModal
					isOpen={showEditModal}
					onClose={() => {
						setShowEditModal(false);
						setCurrentUser(null);
					}}
					onSubmit={(userData) => {
						console.log("Edit user functionality not yet implemented", userData);
						setShowEditModal(false);
					}}
					title="Edit User"
					initialData={currentUser}
					isEdit
				/>
			)}
		</div>
	);
}
