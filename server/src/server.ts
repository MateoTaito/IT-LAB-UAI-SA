import express from "express";
import db from "./config/db";
import usersRouter from "./routes/Users.routes";
import adminsRouter from "./routes/Admins.routes";
import loginRouter from "./routes/Login.routes";
import rolesRouter from "./routes/Roles.routes";
import careersRouter from "./routes/Careers.routes";
import reasonsRouter from "./routes/Reasons.routes";
import attendanceRoutes from "./routes/Attendance.routes";
import { startAttendanceAutoCheckout } from "./scheduler/attendanceAutoCheckout";
import { seedDefaultAdmin, seedDefaultReasons } from "./utils/dbSeeder.util";

// Define Conection to the Data Base
async function connectDB() {
	try {
		await db.authenticate();
		await db.sync();

		// Seed default admin and reasons after DB sync
		await seedDefaultAdmin();
		await seedDefaultReasons();
		console.log("Database connected and initialized successfully");
	} catch (error) {
		console.log("Error while Trying to Connect to the Database", error);
	}
}

// Establishing Conection
connectDB();

// Start scheduled attendance auto-checkout
startAttendanceAutoCheckout();

// Setting Up the Server
const server = express();
const cors = require("cors");
server.use(cors());
server.use(express.json());
server.use("/api/users", usersRouter);
server.use("/api/admins", adminsRouter);
server.use("/api/login", loginRouter);
server.use("/api/roles", rolesRouter);
server.use("/api/careers", careersRouter);
server.use("/api/reasons", reasonsRouter);
server.use("/api/attendance", attendanceRoutes);

export default server;
