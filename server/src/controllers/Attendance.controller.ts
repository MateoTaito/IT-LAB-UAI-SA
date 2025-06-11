import { Request, Response } from "express";
import User from "../models/User.model";
import Attendance from "../models/Attendance.model";
import ReasonModel from "../models/Reason.model"; // Alias to avoid shadowing

export interface UserCheckInDTO {
    email: string;
    checkIn: string | Date;
    Reason: string;
}

export const checkIn = async (req: Request<{}, {}, UserCheckInDTO>, res: Response) => {
    const { email, checkIn, Reason } = req.body;

    if (!email || !checkIn || !Reason) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    try {
        const user = await User.findOne({ where: { Email: email } });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const reason = await ReasonModel.findOne({ where: { Name: Reason } });
        if (!reason) {
            return res.status(404).json({ message: "Reason not found." });
        }

        const attendance = await Attendance.create({
            UserId: user.Id,
            ReasonId: reason.Id,
            CheckIn: new Date(checkIn),
            CheckOut: null,
        });

        return res.status(201).json(attendance);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error.", error });
    }
};
