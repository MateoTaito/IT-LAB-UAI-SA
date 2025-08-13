import { Request, Response } from "express";
import Career from "../models/Career.model";

export interface CreateCareerDTO {
    Name: string;
    Description?: string;
}

export interface DeleteCareerDTO {
    Name: string;
}

export const createCareer = async (req: Request, res: Response) => {
    try {
        const careerData: CreateCareerDTO = req.body;

        // Check if career with the same name already exists
        const existingCareer = await Career.findOne({
            where: { Name: careerData.Name },
        });
        if (existingCareer) {
            return res
                .status(409)
                .json({ error: "Career with this name already exists" });
        }

        const newCareer = await Career.create({
            Name: careerData.Name,
            Description: careerData.Description,
        });

        res.status(201).json(newCareer);
    } catch (error) {
        res.status(400).json({
            error: "Failed to create career",
            details: error,
        });
    }
};

export const listCareers = async (req: Request, res: Response) => {
    try {
        const careers = await Career.findAll();
        res.status(200).json(careers);
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch careers",
            details: error,
        });
    }
};

export const deleteCareerByName = async (req: Request, res: Response) => {
    try {
        const careerData: DeleteCareerDTO = req.body;
        if (!careerData.Name) {
            return res.status(400).json({ error: "Career Name is required" });
        }

        const career = await Career.findOne({
            where: { Name: careerData.Name },
        });
        if (!career) {
            return res.status(404).json({ error: "Career not found" });
        }

        await career.destroy();
        res.status(200).json({ message: "Career deleted successfully" });
    } catch (error) {
        res.status(500).json({
            error: "Failed to delete career",
            details: error,
        });
    }
};
