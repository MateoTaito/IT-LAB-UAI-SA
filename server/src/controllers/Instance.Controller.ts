import { Request, Response } from "express";
import Instance from "../models/Instance.model";

export interface CreateInstanceDTO {
  instanceId: string;
  name: string;
  description?: string;
  route: string;
}

export const createInstance = async (req: Request, res: Response) => {
  try {
    console.log("=== CREATE INSTANCE REQUEST ===");
    console.log("Headers:", req.headers);
    console.log("Body:", JSON.stringify(req.body, null, 2));
    console.log("Content-Type:", req.headers["content-type"]);

    const instanceData: CreateInstanceDTO = req.body;

    // Check if career with the same name already exists
    const existingInstance = await Instance.findOne({
      where: { InstanceId: instanceData.instanceId },
    });
    console.log(existingInstance);
    if (existingInstance) {
      return res
        .status(409)
        .json({ error: "Instance with this name already exists" });
    }

    const newInstance = await Instance.create({
      InstanceId: instanceData.instanceId,
      Name: instanceData.name,
      Description: instanceData.description,
      Route: instanceData.route,
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
