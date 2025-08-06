import cron from "node-cron";
import Attendance from "../models/Attendance.model";
import { Op } from "sequelize";

// Set your timezone if needed, e.g., 'America/Santiago'
const DEADLINE_HOUR = 17; // 10pm

export async function forceAttendanceAutoCheckout() {
    const today = new Date();
    today.setHours(DEADLINE_HOUR, 30, 0, 0); // 22:27:00

    try {
        await Attendance.update(
            { CheckOut: today },
            {
                where: {
                    CheckOut: null,
                    CheckIn: { [Op.lte]: today },
                },
            },
        );
    } catch (error) {}
}

export function startAttendanceAutoCheckout() {
    // Runs every day at 22:27 (10:27pm)
    cron.schedule(
        "27 22 * * *",
        async () => {
            await forceAttendanceAutoCheckout();
        },
        {
            timezone: "America/Santiago", // Set your timezone
        },
    );
}
