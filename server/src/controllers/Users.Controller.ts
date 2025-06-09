import { Request, Response } from "express";
import User from "../models/User.model";
import Admin from "../models/Admin.model";
import Token from "../models/Token.model";

export interface CreateUserDTO {
    Rut: string;
    Email: string;
    Name: string;
    Lastname: string;
}

export interface DeleteUserDTO {
    email: string;
}

export const createUser = async (req: Request, res: Response) => {
    try {
        const userData: CreateUserDTO = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ where: { Email: userData.Email } });
        if (existingUser) {
            return res.status(409).json({ error: "Email is already in use" });
        }

        const newUser = new User();

        // Map attributes
        newUser.Rut = userData.Rut;
        newUser.Email = userData.Email;
        newUser.Name = userData.Name;
        newUser.LastName = userData.Lastname;

        // Save user (wrapped in Promise.allSettled for future extensibility)
        const [saveResult] = await Promise.allSettled([newUser.save()]);

        if (saveResult.status === "fulfilled") {
            res.status(201).json(saveResult.value);
        } else {
            res.status(400).json({ error: "Failed to create user", details: saveResult.reason });
        }
    } catch (error) {
        res.status(400).json({ error: "Failed to create user", details: error });
    }
};

export const listUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users", details: error });
    }
};


export const deleteUserByEmail = async (req: Request, res: Response) => {
    try {
        const userData: DeleteUserDTO = req.body;
        if (!userData.email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const user = await User.findOne({ where: { Email: userData.email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if user is an admin
        const admin = await Admin.findOne({ where: { UserId: user.Id } });
        if (admin) {
            // Delete tokens for this admin
            await Token.destroy({ where: { AdminId: admin.Id } });
            // Delete the admin
            await admin.destroy();
        }

        // Delete the user
        await user.destroy();
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user", details: error });
    }
};
