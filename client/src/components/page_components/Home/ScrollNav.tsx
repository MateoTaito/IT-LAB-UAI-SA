import React, { useState, useEffect } from "react";
import MinimalScrollNav from "./ScrollNav/MinimalScrollNav";
import FullScrollNav from "./ScrollNav/FullScrollNav";

const sections = [
	{ id: "banner", label: "Banner" },
	{ id: "hero", label: "Hero" },
	{ id: "projects", label: "Projects" },
	{ id: "labteam", label: "Lab Team" },
	{ id: "footer", label: "Contact" },
];

export default function ScrollNav() {
	const [active, setActive] = useState(0);
	const [showNav, setShowNav] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const offsets = sections.map((s) => {
				const el = document.getElementById(s.id);
				if (!el) return Infinity;
				const rect = el.getBoundingClientRect();
				return Math.abs(rect.top);
			});
			const minOffset = Math.min(...offsets);
			const current = offsets.findIndex((o) => o === minOffset);
			const newActive = current === -1 ? 0 : current;

			setActive(newActive);

			// Hide navigation when banner is active (first section)
			setShowNav(newActive !== 0);
		};

		// Use requestAnimationFrame for smooth updates during scroll
		let ticking = false;
		const onScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					handleScroll();
					ticking = false;
				});
				ticking = true;
			}
		};

		const scrollContainer = document.getElementById("main-scroll-container");
		if (scrollContainer) {
			scrollContainer.addEventListener("scroll", onScroll, { passive: true });
			window.addEventListener("resize", onScroll);
			handleScroll();
			return () => {
				scrollContainer.removeEventListener("scroll", onScroll);
				window.removeEventListener("resize", onScroll);
			};
		}
	}, []);

	const scrollToSection = (id: string) => {
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: "smooth" });
		}
	};

	const handleMouseEnter = () => {
		setIsAnimating(true);
		setTimeout(() => {
			setIsExpanded(true);
		}, 50);
	};

	const handleMouseLeave = () => {
		setIsExpanded(false);
		setTimeout(() => {
			setIsAnimating(false);
		}, 500); // Wait for the transition to complete
	};

	return (
		<div
			className={`fixed top-1/2 left-4 z-50 -translate-y-1/2 transition-opacity duration-300 ${
				showNav ? "opacity-100" : "opacity-0 pointer-events-none"
			}`}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{/* Container for the morphing effect */}
			<div className="relative">
				{/* Minimal version */}
				<div
					className={`transition-all duration-500 ${
						isExpanded
							? "opacity-0 transform scale-75 -translate-x-4 pointer-events-none"
							: "opacity-100 transform scale-100 translate-x-0"
					}`}
				>
					<MinimalScrollNav active={active} />
				</div>

				{/* Full version with morphing effect */}
				<div
					className={`absolute top-1/2 left-0 -translate-y-1/2 transform transition-all duration-500 ${
						!isAnimating ? "hidden" : ""
					} ${
						isExpanded
							? "opacity-100 transform scale-100 translate-x-0"
							: "opacity-0 transform scale-90 -translate-x-4 pointer-events-none"
					}`}
				>
					<FullScrollNav
						sections={sections.filter((_section, idx) => idx !== 0)}
						active={active}
						scrollToSection={scrollToSection}
					/>
				</div>
			</div>
		</div>
	);
}
