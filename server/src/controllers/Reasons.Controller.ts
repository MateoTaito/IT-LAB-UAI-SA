import { Request, Response } from "express";
import Reason from "../models/Reason.model";

export interface CreateReasonDTO {
    Name: string;
    Description?: string;
}

export interface DeleteReasonDTO {
    Name: string;
}

export const createReason = async (req: Request, res: Response) => {
    try {
        const reasonData: CreateReasonDTO = req.body;

        // Check if reason with the same name already exists
        const existingReason = await Reason.findOne({ where: { Name: reasonData.Name } });
        if (existingReason) {
            return res.status(409).json({ error: "Reason with this name already exists" });
        }

        const newReason = await Reason.create({
            Name: reasonData.Name,
            Description: reasonData.Description,
        });

        res.status(201).json(newReason);
    } catch (error) {
        res.status(400).json({ error: "Failed to create reason", details: error });
    }
};

export const deleteReasonByName = async (req: Request, res: Response) => {
    try {
        const reasonData: DeleteReasonDTO = req.body;
        if (!reasonData.Name) {
            return res.status(400).json({ error: "Reason Name is required" });
        }

        const reason = await Reason.findOne({ where: { Name: reasonData.Name } });
        if (!reason) {
            return res.status(404).json({ error: "Reason not found" });
        }

        await reason.destroy();
        res.status(200).json({ message: "Reason deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete reason", details: error });
    }
};

export const listReasons = async (req: Request, res: Response) => {
    try {
        const reasons = await Reason.findAll();
        res.status(200).json(reasons);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch reasons", details: error });
    }
};
