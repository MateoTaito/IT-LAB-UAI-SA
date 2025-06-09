import { Request, Response } from "express";
import Admin from "../models/Admin.model";
import User from "../models/User.model";
import Token from "../models/Token.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface LoginDTO {
    Email: string;
    Password: string;
}

export interface LogoutDTO {
    Email: string;
}

// Replace with your JWT secret and token expiration as needed
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const TOKEN_EXPIRATION = "1h";

export const loginAdmin = async (req: Request, res: Response) => {
    try {
        const loginData: LoginDTO = req.body;

        // Find the user by email
        const user = await User.findOne({ where: { Email: loginData.Email } });
        if (!user) {
            return res.status(404).json({ error: "User not found with the provided email" });
        }

        // Find the admin by UserId
        const admin = await Admin.findOne({ where: { UserId: user.Id } });
        if (!admin) {
            return res.status(404).json({ error: "Admin not found for this user" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(loginData.Password, admin.Password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid password" });
        }

        // Destroy any existing tokens for this admin
        await Token.destroy({ where: { AdminId: admin.Id } });

        // Generate a new JWT token
        const tokenValue = jwt.sign(
            { adminId: admin.Id, userId: user.Id, email: user.Email },
            JWT_SECRET,
            { expiresIn: TOKEN_EXPIRATION }
        );

        // Calculate expiration date
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Store the new token in the database
        await Token.create({
            AdminId: admin.Id,
            Token: tokenValue,
            ExpiresAt: expiresAt
        });

        // Return the token in the response
        res.status(200).json({
            message: "Login successful",
            adminId: admin.Id,
            userId: user.Id,
            token: tokenValue
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to log in", details: error });
    }
};

export const logoutAdmin = async (req: Request, res: Response) => {
    try {
        const logoutData: LogoutDTO = req.body;
        if (!logoutData.Email) {
            return res.status(400).json({ error: "Email is required" });
        }

        // Find the user by email
        const user = await User.findOne({ where: { Email: logoutData.Email } });
        if (!user) {
            return res.status(404).json({ error: "User not found with the provided email" });
        }

        // Find the admin by UserId
        const admin = await Admin.findOne({ where: { UserId: user.Id } });
        if (!admin) {
            return res.status(404).json({ error: "Admin not found for this user" });
        }

        // Delete the token associated with this admin
        const deleted = await Token.destroy({ where: { AdminId: admin.Id } });

        if (deleted === 0) {
            return res.status(404).json({ error: "Token not found" });
        }

        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ error: "Failed to log out", details: error });
    }
};
