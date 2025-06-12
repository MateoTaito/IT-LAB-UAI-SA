import React from "react";

interface LoginFormProps {
	email: string;
	setEmail: (email: string) => void;
	password: string;
	setPassword: (password: string) => void;
	error: string;
	handleSubmit: (e: React.FormEvent) => void;
}

export default function LoginForm({ email, setEmail, password, setPassword, error, handleSubmit }: LoginFormProps) {
	return (
		<form onSubmit={handleSubmit} className="space-y-6 w-full">
			<div>
				<label className="block text-gray-700 font-medium mb-2" htmlFor="email">
					Email
				</label>
				<input
					id="email"
					type="email"
					className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					autoComplete="email"
				/>
			</div>
			<div>
				<label className="block text-gray-700 font-medium mb-2" htmlFor="password">
					Password
				</label>
				<input
					id="password"
					type="password"
					className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					autoComplete="current-password"
				/>
			</div>
			{error && <p className="text-red-600 text-sm">{error}</p>}
			<button
				type="submit"
				className="w-full py-2 px-4 bg-[#1e1b4b] text-white font-semibold rounded hover:bg-[#312e81] transition"
			>
				Log In
			</button>
		</form>
	);
}
