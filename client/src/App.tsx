import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/page_templates/Home";
import Login from "./components/page_templates/Login";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/routes/PrivateRoute";

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					{/* Public routes */}
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />

					{/* Protected routes */}
					<Route element={<PrivateRoute />}>
						{/* Example protected routes - replace with your actual admin pages */}
						<Route path="/admin/*" element={<div>Admin Dashboard (Replace this)</div>} />
						{/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
						{/* <Route path="/admin/users" element={<AdminUsers />} /> */}
					</Route>

					{/* Fallback route */}
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}

export default App;
