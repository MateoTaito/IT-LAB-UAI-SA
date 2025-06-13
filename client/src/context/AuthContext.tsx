import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthState {
	isAuthenticated: boolean;
	token: string | null;
	userId: string | null;
	adminId: string | null;
	loading: boolean;
}

interface AuthContextType extends AuthState {
	login: (token: string, userId: string, adminId: string) => void;
	logout: () => void;
}

const initialAuthState: AuthState = {
	isAuthenticated: false,
	token: null,
	userId: null,
	adminId: null,
	loading: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [auth, setAuth] = useState<AuthState>(initialAuthState);

	// Check local storage for existing token on mount
	useEffect(() => {
		const token = localStorage.getItem("auth_token");
		const userId = localStorage.getItem("auth_userId");
		const adminId = localStorage.getItem("auth_adminId");

		if (token && userId && adminId) {
			setAuth({
				isAuthenticated: true,
				token,
				userId,
				adminId,
				loading: false,
			});
		} else {
			setAuth((prevState) => ({ ...prevState, loading: false }));
		}
	}, []);

	const login = (token: string, userId: string, adminId: string) => {
		// Store auth data in localStorage
		localStorage.setItem("auth_token", token);
		localStorage.setItem("auth_userId", userId);
		localStorage.setItem("auth_adminId", adminId);

		// Update auth state
		setAuth({
			isAuthenticated: true,
			token,
			userId,
			adminId,
			loading: false,
		});
	};

	const logout = () => {
		// Remove auth data from localStorage
		localStorage.removeItem("auth_token");
		localStorage.removeItem("auth_userId");
		localStorage.removeItem("auth_adminId");

		// Reset auth state
		setAuth({
			isAuthenticated: false,
			token: null,
			userId: null,
			adminId: null,
			loading: false,
		});
	};

	const value = {
		...auth,
		login,
		logout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
