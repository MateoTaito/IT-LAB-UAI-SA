import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/page_templates/Home";
import Login from "./components/page_templates/Login";
import AdministratorPanel from "./components/page_templates/AdministratorPanel";
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
						<Route path="/admin" element={<AdministratorPanel />} />
						<Route path="/admin/dashboard" element={<AdministratorPanel />} />
						{/* Add more admin routes here as needed */}
					</Route>

					{/* Fallback route */}
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}

export default App;
