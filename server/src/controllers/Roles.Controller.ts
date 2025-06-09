import { Request, Response } from "express";
import Role from "../models/Role.model";

export interface CreateRoleDTO {
    Name: string;
    Description?: string;
}

export const createRole = async (req: Request, res: Response) => {
    try {
        const roleData: CreateRoleDTO = req.body;

        // Check if role with the same name already exists
        const existingRole = await Role.findOne({ where: { Name: roleData.Name } });
        if (existingRole) {
            return res.status(409).json({ error: "Role with this name already exists" });
        }

        const newRole = await Role.create({
            Name: roleData.Name,
            Description: roleData.Description,
        });

        res.status(201).json(newRole);
    } catch (error) {
        res.status(400).json({ error: "Failed to create role", details: error });
    }
};

export const listRoles = async (req: Request, res: Response) => {
    try {
        const roles = await Role.findAll();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch roles", details: error });
    }
};

export const deleteRoleByName = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Role name is required" });
        }

        const role = await Role.findOne({ where: { Name: name } });
        if (!role) {
            return res.status(404).json({ error: "Role not found" });
        }

        await role.destroy();
        res.status(200).json({ message: "Role deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete role", details: error });
    }
};
