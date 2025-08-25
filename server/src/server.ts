import express from "express";
import db from "./config/db";
import usersRouter from "./routes/Users.routes";
import adminsRouter from "./routes/Admins.routes";
import loginRouter from "./routes/Login.routes";
import rolesRouter from "./routes/Roles.routes";
import careersRouter from "./routes/Careers.routes";
import reasonsRouter from "./routes/Reasons.routes";
import attendanceRoutes from "./routes/Attendance.routes";
import instanceRoutes from "./routes/Instance.routes";
import { startAttendanceAutoCheckout } from "./scheduler/attendanceAutoCheckout";
import { seedDefaultAdmin, seedDefaultReasons } from "./utils/dbSeeder.util";
import cors from "cors";

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

const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    // Permitir requests sin origin (como apps móviles, Postman, etc.)
    if (!origin) return callback(null, true);

    // En desarrollo, permitir cualquier origen
    if (process.env.NODE_ENV === "development") {
      return callback(null, true);
    }

    // En producción, puedes ser más específico
    // Por ejemplo, solo permitir IPs de tu red local
    const allowedOrigins = [
      /^http:\/\/localhost:\d+$/, // localhost con cualquier puerto
      /^http:\/\/127\.0\.0\.1:\d+$/, // 127.0.0.1 con cualquier puerto
      /^http:\/\/192\.168\.\d+\.\d+:\d+$/, // Red local 192.168.x.x
      /^http:\/\/10\.\d+\.\d+\.\d+:\d+$/, // Red local 10.x.x.x
      // Agrega aquí dominios específicos si los tienes
    ];

    const isAllowed = allowedOrigins.some((pattern) => pattern.test(origin));
    callback(null, isAllowed);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Authorization"],
};

// Establishing Conection
connectDB();

// Start scheduled attendance auto-checkout
startAttendanceAutoCheckout();

// Setting Up the Server
const server = express();
server.use(cors(corsOptions));
server.options("*", cors(corsOptions));
server.use(express.json());
server.use("/api/users", usersRouter);
server.use("/api/admins", adminsRouter);
server.use("/api/login", loginRouter);
server.use("/api/roles", rolesRouter);
server.use("/api/careers", careersRouter);
server.use("/api/reasons", reasonsRouter);
server.use("/api/attendance", attendanceRoutes);
server.use("/api/instance", instanceRoutes);

export default server;
