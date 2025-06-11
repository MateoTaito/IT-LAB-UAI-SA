import React from "react";
import Navbar from "../page_components/Navbar/Navbar";
import Hero from "../page_components/Home/Hero";
import OngoingProjects from "../page_components/Home/OngoingProjects";
import LabTeam from "../page_components/Home/LabTeam";
import Footer from "../page_components/Home/Footer";

function Home() {
	return (
		<div className="min-h-screen w-full bg-[linear-gradient(135deg,_#1e3a8a_0%,_#4f378b_60%,_#6d28d9_100%)]">
			<Navbar />
			<Hero />
			<OngoingProjects />
			<LabTeam />
			<Footer />
		</div>
	);
}

export default Home;
