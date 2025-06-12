import React from "react";
import Navbar from "../page_components/Navbar/Navbar";
import Banner from "../page_components/Home/Banner";
import Hero from "../page_components/Home/Hero";
import OngoingProjects from "../page_components/Home/OngoingProjects";
import LabTeam from "../page_components/Home/LabTeam";
import Footer from "../page_components/Home/Footer";
import ScrollNav from "../page_components/Home/ScrollNav";

function Home() {
	return (
		<div className="min-h-screen w-full bg-[linear-gradient(135deg,_#1e3a8a_0%,_#4f378b_60%,_#6d28d9_100%)]">
			<Navbar />
			{/* Add ScrollNav component */}
			<ScrollNav />
			<div className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth" id="main-scroll-container">
				<section id="banner" className="snap-start h-screen flex items-center justify-center">
					<Banner />
				</section>
				<section id="hero" className="relative snap-start h-screen flex items-center justify-center">
					<Hero />
				</section>
				<section id="projects" className="relative snap-start h-screen flex items-center justify-center">
					<OngoingProjects />
				</section>
				<section id="labteam" className="relative snap-start h-screen flex items-center justify-center">
					<LabTeam />
				</section>
				<section id="footer" className="relative snap-start h-screen flex items-center justify-center">
					<Footer />
				</section>
			</div>
		</div>
	);
}

export default Home;
