import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Token from "../models/Token.model";

// Toggle this flag to enable/disable JWT authentication
const JWT_AUTH_ENABLED = process.env.JWT_AUTH_ENABLED === "true";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const jwtAuth = async (req: Request, res: Response, next: NextFunction) => {
    if (!JWT_AUTH_ENABLED) {
        // Skip authentication in development mode
        return next();
    }
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ error: "No token provided" });
            return;
        }

        const token = authHeader.split(" ")[1];

        // Verify JWT signature and expiration
        let decoded: any;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            res.status(401).json({ error: "Invalid or expired token" });
            return;
        }

        // Check if token exists in DB
        const tokenRecord = await Token.findOne({ where: { Token: token } });
        if (!tokenRecord) {
            res.status(401).json({ error: "Token not found or revoked" });
            return;
        }

        (req as any).user = decoded;

        next();
    } catch (error) {
        res.status(401).json({ error: "Unauthorized", details: error });
    }
};
