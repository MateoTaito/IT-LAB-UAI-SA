import React, { useState } from "react";
import Navbar from "../page_components/Navbar/Navbar";
import LoginBox from "../page_components/Login/LoginBox";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!email || !password) {
			setError("Please enter both email and password.");
			return;
		}
		setError("");
		alert("Login submitted! (Implement your logic here)");
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
