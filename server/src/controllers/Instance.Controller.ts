import { Request, Response } from "express";
import Instance from "../models/Instance.model";

export interface CreateInstanceDTO {
    instanceId: string;
    name: string;
    description?: string;
    port: number;
}

export const createInstance = async (req: Request, res: Response) => {
    try {
        const instanceData: CreateInstanceDTO = req.body;

        // Check if career with the same name already exists
        const existingInstance = await Instance.findOne({
            where: { InstanceId: instanceData.instanceId },
        });
        if (existingInstance) {
            return res
                .status(409)
                .json({ error: "Instance with this name already exists" });
        }

        const newInstance = await Instance.create({
            InstanceId: instanceData.instanceId,
            Name: instanceData.name,
            Description: instanceData.description,
            Port: instanceData.port,
        });

        res.status(201).json(newInstance);
    } catch (error) {
        res.status(400).json({
            error: "Failed to create instance",
            details: error,
        });
    }
};

export const listInstances = async (req: Request, res: Response) => {
    try {
        const instances = await Instance.findAll({
            order: [["Id", "ASC"]],
        });

        res.status(200).json(instances);
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch instances",
            details: error,
        });
    }
};
