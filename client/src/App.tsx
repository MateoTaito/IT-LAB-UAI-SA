import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
//import Home from "./components/pages/Home";
//import CreateAccount from "./components/pages/CreateAccount";
//import ActiveUsers from "./components/pages/ActiveUsers";
//import LoginAdminPage from "./components/pages/LoginAdmin";
//import About from "./components/pages/About";
//import Login from "./components/pages/Login";
import Home from "./components/page_templates/Home";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
