import { Request, Response } from "express";
import Role from "../models/Role.model";
import User from "../models/User.model";
import { col, fn, Op } from "sequelize";

export interface CreateRoleDTO {
    Name: string;
    Description?: string;
}

export interface DeleteRoleDTO {
    Name: string;
}

export interface UpdateRoleDTO {
    CurrentName: string;
    NewName?: string;
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
        const roles = await Role.findAll({
            include: [
                {
                    model: User,
                    attributes: [],
                    through: { attributes: [] }
                }
            ],
            attributes: [
                'Id',
                'Name',
                'Description',
                'createdAt',
                'updatedAt',
                [fn('COUNT', col('Users.Id')), 'UserCount']
            ],
            group: ['Role.Id'],
            raw: true
        });

        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch roles", details: error });
    }
};

export const listRolesForUsers = async (req: Request, res: Response) => {
    try {
        const roles = await Role.findAll({
            where: {
                Name: {
                    [Op.not]: 'Administrator'
                }
            },
            include: [
                {
                    model: User,
                    attributes: [],
                    through: { attributes: [] }
                }
            ],
            attributes: [
                'Id',
                'Name',
                'Description',
                'createdAt',
                'updatedAt',
                [fn('COUNT', col('Users.Id')), 'UserCount']
            ],
            group: ['Role.Id'],
            raw: true
        });

        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch roles for users", details: error });
    }
};

export const deleteRoleByName = async (req: Request, res: Response) => {
    try {
        const roleData: DeleteRoleDTO = req.body;
        if (!roleData.Name) {
            return res.status(400).json({ error: "Role Name is required" });
        }

        const role = await Role.findOne({ where: { Name: roleData.Name } });
        if (!role) {
            return res.status(404).json({ error: "Role not found" });
        }

        await role.destroy();
        res.status(200).json({ message: "Role deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete role", details: error });
    }
};

export const updateRole = async (req: Request, res: Response) => {
    try {
        const roleData: UpdateRoleDTO = req.body;
        if (!roleData.CurrentName) {
            return res.status(400).json({ error: "Current Role Name is required" });
        }

        // Check if role exists
        const role = await Role.findOne({ where: { Name: roleData.CurrentName } });
        if (!role) {
            return res.status(404).json({ error: "Role not found" });
        }

        // Check if new name already exists (if name is being updated)
        if (roleData.NewName && roleData.NewName !== roleData.CurrentName) {
            const existingRole = await Role.findOne({ where: { Name: roleData.NewName } });
            if (existingRole) {
                return res.status(409).json({ error: "Role with this name already exists" });
            }
            role.Name = roleData.NewName;
        }

        // Update description if provided
        if (roleData.Description !== undefined) {
            role.Description = roleData.Description;
        }

        await role.save();
        res.status(200).json({ message: "Role updated successfully", role });
    } catch (error) {
        res.status(500).json({ error: "Failed to update role", details: error });
    }
};
