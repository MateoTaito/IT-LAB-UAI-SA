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

export const getTopUsers = async (req: Request, res: Response) => {
    try {
        // Get all completed attendance records (with CheckOut)
        const completedAttendances = await Attendance.findAll({
            where: { 
                CheckOut: { 
                    [require("sequelize").Op.not]: null 
                } 
            },
            include: [{ model: User }, { model: ReasonModel }]
        });

        // Calculate total time for each user
        const userStats = new Map();
        
        completedAttendances.forEach((attendance: any) => {
            const userId = attendance.UserId;
            const checkIn = new Date(attendance.CheckIn);
            const checkOut = new Date(attendance.CheckOut);
            const duration = checkOut.getTime() - checkIn.getTime(); // milliseconds
            
            if (!userStats.has(userId)) {
                userStats.set(userId, {
                    userId: userId,
                    email: attendance.User?.Email,
                    name: attendance.User?.Name,
                    lastName: attendance.User?.LastName,
                    totalTime: 0,
                    sessionCount: 0
                });
            }
            
            const user = userStats.get(userId);
            user.totalTime += duration;
            user.sessionCount += 1;
        });

        // Convert to array and sort by total time
        const sortedUsers = Array.from(userStats.values())
            .sort((a, b) => b.totalTime - a.totalTime)
            .slice(0, 5) // Top 5
            .map(user => ({
                ...user,
                totalTimeHours: Math.round((user.totalTime / (1000 * 60 * 60)) * 100) / 100, // Convert to hours with 2 decimals
                averageSessionHours: Math.round((user.totalTime / user.sessionCount / (1000 * 60 * 60)) * 100) / 100
            }));

        return res.status(200).json(sortedUsers);
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
