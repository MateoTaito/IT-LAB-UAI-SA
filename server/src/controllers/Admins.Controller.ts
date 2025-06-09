import { Request, Response } from "express";
import Admin from "../models/Admin.model";
import User from "../models/User.model";
import { hashString } from "../utils/hash.util";

export interface CreateAdminDTO {
    Email: string;
    Password: string;
}

export interface DeleteAdminDTO {
    Email: string;
}

export const createAdmin = async (req: Request, res: Response) => {
    try {
        const adminData: CreateAdminDTO = req.body;

        // Retrieve the user by email
        const user = await User.findOne({ where: { Email: adminData.Email } });
        if (!user) {
            return res.status(404).json({ error: "User not found with the provided email" });
        }

        // Check if an admin with the same UserId already exists
        const existingAdmin = await Admin.findOne({ where: { UserId: user.Id } });
        if (existingAdmin) {
            return res.status(409).json({ error: "Admin for this user already exists" });
        }

        const newAdmin = new Admin();
        newAdmin.UserId = user.Id;
        newAdmin.Password = await hashString(adminData.Password);

        const [saveResult] = await Promise.allSettled([newAdmin.save()]);

        if (saveResult.status === "fulfilled") {
            res.status(201).json(saveResult.value);
        } else {
            res.status(400).json({ error: "Failed to create admin", details: saveResult.reason });
        }
    } catch (error) {
        res.status(400).json({ error: "Failed to create admin", details: error });
    }
};

export const listAdmins = async (req: Request, res: Response) => {
    try {
        const admins = await Admin.findAll({
            include: [
                {
                    model: User,
                    attributes: ["Rut", "Email", "Name", "LastName"]
                }
            ]
        });

        // Flatten the response to merge admin and user fields
        const formattedAdmins = admins.map((admin: any) => {
            const user = admin.UserFK?.dataValues || {};
            return {
                Id: admin.Id,
                UserId: admin.UserId,
                Password: admin.Password,
                createdAt: admin.createdAt,
                updatedAt: admin.updatedAt,
                ...user
            };
        });

        res.status(200).json(formattedAdmins);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch admins", details: error });
    }
};

export const deleteAdminByEmail = async (req: Request, res: Response) => {
    try {
        const adminData: DeleteAdminDTO = req.body;
        if (!adminData.Email) {
            return res.status(400).json({ error: "Email is required" });
        }

        // Find the user by Email
        const user = await User.findOne({ where: { Email: adminData.Email } });
        if (!user) {
            return res.status(404).json({ error: "User not found with the provided Email" });
        }

        // Find the admin by UserId
        const admin = await Admin.findOne({ where: { UserId: user.Id } });
        if (!admin) {
            return res.status(404).json({ error: "Admin not found for this user" });
        }

        await admin.destroy();
        res.status(200).json({ message: "Admin deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete admin", details: error });
    }
};
