import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
	const [menuOpen, setMenuOpen] = useState(false);
	const [showNavbar, setShowNavbar] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);
	const location = useLocation();
	const navigate = useNavigate();

	const handleMore = () => {};
	const handleMenuToggle = () => setMenuOpen((prev) => !prev);

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			if (currentScrollY > lastScrollY && currentScrollY > 50) {
				setShowNavbar(false);
			} else {
				setShowNavbar(true);
			}
			setLastScrollY(currentScrollY);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [lastScrollY]);

	return (
		<nav
			className={`w-full fixed top-0 left-0 z-30 transition-transform duration-1000 ${
				showNavbar ? "translate-y-0" : "-translate-y-full"
			}`}
			style={{
				background: "linear-gradient(90deg, #1e1b4b 0%, #312e81 100%)",
			}}
		>
			<div className="flex items-center justify-between px-6 py-4">
				{/* Left: Logo */}
				<div className="flex items-center">
					<a href="/" className="font-bold text-2xl text-white">
						Logo
					</a>
				</div>
				{/* Hamburger for mobile */}
				<div className="lg:hidden flex items-center">
					<button
						onClick={handleMenuToggle}
						className="text-white focus:outline-none"
						aria-label="Toggle menu"
					>
						<svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
							/>
						</svg>
					</button>
				</div>
				{/* Center: Navigation Links */}
				<div
					className={`flex-col lg:flex-row lg:flex items-center space-y-4 lg:space-y-0 lg:space-x-8 absolute lg:static top-full left-0 w-full lg:w-auto bg-transparent lg:bg-none px-6 lg:px-0 py-4 lg:py-0 transition-all duration-300 ${
						menuOpen ? "flex" : "hidden lg:flex"
					}`}
				>
					<a
						onClick={() => {
							navigate("/");
							setMenuOpen(false);
						}}
						className="text-white hover:text-blue-200 font-medium cursor-pointer"
					>
						Home Page
					</a>
					<a
						href="/about"
						className="text-white hover:text-blue-200 font-medium"
						onClick={() => setMenuOpen(false)}
					>
						About Us
					</a>
					<a href="#" className="text-white hover:text-blue-200 font-medium">
						Contact Us
					</a>
					<div className="relative">
						<button
							onClick={handleMore}
							className="flex items-center text-white hover:text-blue-200 font-medium focus:outline-none"
						>
							More Links
							<svg
								className="ml-1 w-4 h-4"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								viewBox="0 0 24 24"
							>
								<path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
							</svg>
						</button>
						{/* Dropdown placeholder */}
					</div>
					{/* Right: Log In Button (on mobile, shown in menu) */}
					<div className="block lg:hidden mt-4">
						<button
							onClick={() => {
								setMenuOpen(false);
								navigate("/login");
							}}
							className="px-5 py-2 border border-white text-white rounded-full font-medium hover:bg-white hover:text-gray-900 transition"
							style={{
								border: "none",
							}}
						>
							Log In
						</button>
					</div>
				</div>

				{/* Right: Log In Button (desktop only) */}
				<div className="hidden lg:flex items-center space-x-4">
					<button
						onClick={() => navigate("/login")}
						className="px-5 py-2 text-white rounded-full font-medium hover:bg-white hover:text-gray-900 transition"
						style={{
							border: "none",
						}}
					>
						Log In
					</button>
				</div>
			</div>
		</nav>
	);
}
