import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../page_components/Navbar/Navbar";
import LoginBox from "../page_components/Login/LoginBox";
import { loginAdmin } from "../../api/LoginApi";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { login } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email || !password) {
			setError("Please enter both email and password.");
			return;
		}
		setError("");
		setLoading(true);

		// Create payload and log it
		const payload = { Email: email, Password: password };
		console.log("Login request payload:", payload);

		try {
			const res = await loginAdmin(payload);
			// Log the successful response
			console.log("Login success - Response:", res);
			console.log("Token received:", res.token);
			console.log("User data:", {
				adminId: res.adminId,
				userId: res.userId,
			});

			// Store authentication data using the context
			login(res.token, res.userId, res.adminId);

			// Redirect to admin dashboard after successful login
			navigate("/admin");
		} catch (err: any) {
			// Log the error response
			console.error("Login error:", err);
			console.error("Response data:", err?.response?.data);
			console.error("Status code:", err?.response?.status);

			setError(err?.response?.data?.error || "Login failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen w-full bg-[linear-gradient(135deg,_#1e3a8a_0%,_#4f378b_60%,_#6d28d9_100%)]">
			<Navbar />
			<main className="flex flex-col items-center justify-center pt-32 pb-20 px-4 min-h-[70vh]">
				<LoginBox
					email={email}
					setEmail={setEmail}
					password={password}
					setPassword={setPassword}
					error={error}
					handleSubmit={handleSubmit}
				/>
			</main>
		</div>
	);
}
