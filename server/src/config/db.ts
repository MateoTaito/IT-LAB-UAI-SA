import { Sequelize } from "sequelize-typescript";
import { config as dotenvConfig } from "dotenv";
import { existsSync } from "node:fs";

if (existsSync(".env")) dotenvConfig();

import UserRole from "../models/UserRole.model";
import UserCareer from "../models/UserCareer.model";
import Token from "../models/Token.model";
import Instance from "../models/Instance.model";

import User from "../models/User.model";
import Admin from "../models/Admin.model";
import Role from "../models/Role.model";
import Career from "../models/Career.model";
import Reason from "../models/Reason.model";
import Attendance from "../models/Attendance.model";

const db = new Sequelize(process.env.DATABASE_URL!, {
  models: [
    UserRole,
    UserCareer,
    Token,
    User,
    Admin,
    Role,
    Career,
    Reason,
    Attendance,
    Instance,
  ],
  logging: false,
});

console.log(`[DB] Registered models: ${Object.keys(db.models).join(", ")}`);
export default db;
