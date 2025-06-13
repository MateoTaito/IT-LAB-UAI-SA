import React, { createContext, useState, useContext, ReactNode } from "react";

interface SidebarContextType {
	collapsed: boolean;
	toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
	const context = useContext(SidebarContext);
	if (!context) {
		throw new Error("useSidebar must be used within a SidebarProvider");
	}
	return context;
}

interface SidebarProviderProps {
	children: ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
	const [collapsed, setCollapsed] = useState(false);

	const toggleSidebar = () => {
		setCollapsed((prev) => !prev);
	};

	return <SidebarContext.Provider value={{ collapsed, toggleSidebar }}>{children}</SidebarContext.Provider>;
}
