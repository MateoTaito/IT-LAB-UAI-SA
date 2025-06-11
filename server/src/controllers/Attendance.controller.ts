import { Request, Response } from "express";
import User from "../models/User.model";
import Attendance from "../models/Attendance.model";
import ReasonModel from "../models/Reason.model"; // Alias to avoid shadowing

// DTOs
export interface UserCheckInDTO {
    email: string;
    checkIn: string | Date;
    Reason: string;
}

export interface UserCheckOutDTO {
    email: string;
    checkOut: string | Date;
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

        // Prevent multiple open check-ins
        const openAttendance = await Attendance.findOne({
            where: { UserId: user.Id, CheckOut: null }
        });
        if (openAttendance) {
            return res.status(400).json({ message: "User already has an open check-in. Please check out first." });
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

function formatAttendanceFlat(attendance: any) {
    return {
        Id: attendance.Id,
        UserId: attendance.UserId,
        ReasonId: attendance.ReasonId,
        CheckIn: attendance.CheckIn,
        CheckOut: attendance.CheckOut,
        Email: attendance.User?.Email,
        Name: attendance.User?.Name,
        LastName: attendance.User?.LastName,
        Rut: attendance.User?.Rut,
        Reason: attendance.Reason?.Name
    };
}

export const listActiveUsers = async (req: Request, res: Response) => {
    try {
        const activeAttendances = await Attendance.findAll({
            where: { CheckOut: null },
            include: [{ model: User }, { model: ReasonModel }]
        });
        const formatted = activeAttendances.map(a => formatAttendanceFlat(a));
        return res.status(200).json(formatted);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error.", error });
    }
};

export const listInactiveUsers = async (req: Request, res: Response) => {
    try {
        const inactiveAttendances = await Attendance.findAll({
            where: { CheckOut: { [require("sequelize").Op.not]: null } },
            include: [{ model: User }, { model: ReasonModel }]
        });
        const formatted = inactiveAttendances.map(a => formatAttendanceFlat(a));
        return res.status(200).json(formatted);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error.", error });
    }
};

export const listAllUsersAttendance = async (req: Request, res: Response) => {
    try {
        const allAttendances = await Attendance.findAll({
            include: [{ model: User }, { model: ReasonModel }]
        });
        const formatted = allAttendances.map(a => formatAttendanceFlat(a));
        return res.status(200).json(formatted);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error.", error });
    }
};

export const checkOut = async (req: Request<{}, {}, UserCheckOutDTO>, res: Response) => {
    const { email, checkOut } = req.body;

    if (!email || !checkOut) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    try {
        const user = await User.findOne({ where: { Email: email } });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Find the open attendance record
        const openAttendance = await Attendance.findOne({
            where: { UserId: user.Id, CheckOut: null }
        });

        if (!openAttendance) {
            return res.status(400).json({ message: "No open check-in found for this user." });
        }

        openAttendance.CheckOut = new Date(checkOut);
        await openAttendance.save();

        return res.status(200).json({ message: "Checked out successfully." });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error.", error });
    }
};
