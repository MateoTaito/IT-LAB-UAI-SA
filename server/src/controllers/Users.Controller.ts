import { Request, Response } from "express";
import User from "../models/User.model";
import Admin from "../models/Admin.model";
import Token from "../models/Token.model";
import Role from "../models/Role.model";
import UserRole from "../models/UserRole.model";
import Career from "../models/Career.model";
import UserCareer from "../models/UserCareer.model";

export interface CreateUserDTO {
    Rut: string;
    Email: string;
    Name: string;
    Lastname: string;
}

export interface DeleteUserDTO {
    Email: string;
}

export interface AssignRoleDTO {
    Email: string;
    Role: string;
}

export interface GetUserByRoleDTO {
    Role: string;
}

export interface DeleteUserRoleDTO {
    Email: string;
    Role: string;
}

export interface AssignCareerDTO {
    Email: string;
    Career: string;
}

export interface GetUserByCareerDTO {
    Career: string;
}

export interface DeleteUserCareerDTO {
    Email: string;
    Career: string;
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
        const users = await User.findAll({
            include: [
                {
                    model: Role,
                    through: { attributes: [] },
                    attributes: ["Name"]
                }
            ]
        });

        // Format the response to only include role names as an array
        const formattedUsers = users.map((user: any) => {
            const userObj = user.toJSON();
            return {
                ...userObj,
                Roles: userObj.Roles ? userObj.Roles.map((role: any) => role.Name) : []
            };
        });

        res.status(200).json(formattedUsers);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users", details: error });
    }
};

export const deleteUserByEmail = async (req: Request, res: Response) => {
    try {
        const userData: DeleteUserDTO = req.body;
        if (!userData.Email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const user = await User.findOne({ where: { Email: userData.Email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Unbind all roles from the user
        await UserRole.destroy({ where: { UserId: user.Id } });

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

export const assignRoleToUser = async (req: Request, res: Response) => {
    try {
        const { Email, Role: RoleName }: AssignRoleDTO = req.body;

        // Check if user exists
        const user = await User.findOne({ where: { Email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if role exists
        const roleObj = await Role.findOne({ where: { Name: RoleName } });
        if (!roleObj) {
            return res.status(404).json({ error: "Role not found" });
        }

        // Check if the user already has this role
        const existingUserRole = await UserRole.findOne({ where: { UserId: user.Id, RoleId: roleObj.Id } });
        if (existingUserRole) {
            return res.status(409).json({ error: "User already has this role" });
        }

        // Create the user-role association
        await UserRole.create({
            UserId: user.Id,
            RoleId: roleObj.Id
        });

        res.status(201).json({ message: "Role assigned to user successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to assign role to user", details: error });
    }
};

export const getUsersByRole = async (req: Request, res: Response) => {
    try {
        const roleData: GetUserByRoleDTO = req.body;
        if (!roleData.Role) {
            return res.status(400).json({ error: "Role Name is required" });
        }

        // Find the role by name
        const role = await Role.findOne({ where: { Name: roleData.Role } });
        if (!role) {
            return res.status(404).json({ error: "Role not found" });
        }

        // Get all users associated with this role, including only role names
        const users = await User.findAll({
            include: [
                {
                    model: Role,
                    where: { Id: role.Id },
                    through: { attributes: [] },
                    attributes: ["Name"]
                }
            ]
        });

        // Format the response to only include role names as an array
        const formattedUsers = users.map((user: any) => {
            const userObj = user.toJSON();
            return {
                ...userObj,
                Roles: userObj.Roles ? userObj.Roles.map((role: any) => role.Name) : []
            };
        });

        res.status(200).json(formattedUsers);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users by role", details: error });
    }
};

export const deleteUserRole = async (req: Request, res: Response) => {
    try {
        const { Email, Role: RoleName }: DeleteUserRoleDTO = req.body;

        // Check if user exists
        const user = await User.findOne({ where: { Email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if role exists
        const roleObj = await Role.findOne({ where: { Name: RoleName } });
        if (!roleObj) {
            return res.status(404).json({ error: "Role not found" });
        }

        // Find the user-role association
        const userRole = await UserRole.findOne({ where: { UserId: user.Id, RoleId: roleObj.Id } });
        if (!userRole) {
            return res.status(404).json({ error: "User does not have this role" });
        }

        // Delete the association
        await userRole.destroy();

        res.status(200).json({ message: "Role unbound from user successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to unbind role from user", details: error });
    }
};

export const assignCareerToUser = async (req: Request, res: Response) => {
    try {
        const { Email, Career: CareerName }: AssignCareerDTO = req.body;

        // Check if user exists
        const user = await User.findOne({ where: { Email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if career exists
        const careerObj = await Career.findOne({ where: { Name: CareerName } });
        if (!careerObj) {
            return res.status(404).json({ error: "Career not found" });
        }

        // Check if the user already has this career
        const existingUserCareer = await UserCareer.findOne({ where: { UserId: user.Id, CareerId: careerObj.Id } });
        if (existingUserCareer) {
            return res.status(409).json({ error: "User already has this career" });
        }

        // Create the user-career association
        await UserCareer.create({
            UserId: user.Id,
            CareerId: careerObj.Id
        });

        res.status(201).json({ message: "Career assigned to user successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to assign career to user", details: error });
    }
};

export const getUsersByCareer = async (req: Request, res: Response) => {
    try {
        const careerData: GetUserByCareerDTO = req.body;
        if (!careerData.Career) {
            return res.status(400).json({ error: "Career Name is required" });
        }

        // Find the career by name
        const career = await Career.findOne({ where: { Name: careerData.Career } });
        if (!career) {
            return res.status(404).json({ error: "Career not found" });
        }

        // Get all users associated with this career, including only career names
        const users = await User.findAll({
            include: [
                {
                    model: Career,
                    where: { Id: career.Id },
                    through: { attributes: [] },
                    attributes: ["Name"]
                }
            ]
        });

        // Format the response to only include career names as an array
        const formattedUsers = users.map((user: any) => {
            const userObj = user.toJSON();
            return {
                ...userObj,
                Careers: userObj.Careers ? userObj.Careers.map((career: any) => career.Name) : []
            };
        });

        res.status(200).json(formattedUsers);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users by career", details: error });
    }
};

export const deleteUserCareer = async (req: Request, res: Response) => {
    try {
        const { Email, Career: CareerName }: DeleteUserCareerDTO = req.body;

        // Check if user exists
        const user = await User.findOne({ where: { Email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if career exists
        const careerObj = await Career.findOne({ where: { Name: CareerName } });
        if (!careerObj) {
            return res.status(404).json({ error: "Career not found" });
        }

        // Find the user-career association
        const userCareer = await UserCareer.findOne({ where: { UserId: user.Id, CareerId: careerObj.Id } });
        if (!userCareer) {
            return res.status(404).json({ error: "User does not have this career" });
        }

        // Delete the association
        await userCareer.destroy();

        res.status(200).json({ message: "Career unbound from user successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to unbind career from user", details: error });
    }
};
