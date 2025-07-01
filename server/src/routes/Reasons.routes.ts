import { Router, Request, Response } from "express";
import { createReason, deleteReasonByName, listReasons } from "../controllers/Reasons.Controller";
import { jwtAuth } from "../middleware/jwtAuth.middleware";

const router: Router = Router();

router.post("/create-reason", jwtAuth, (req: Request, res: Response) => {
    createReason(req, res);
});

router.delete("/delete-reason", jwtAuth, (req: Request, res: Response) => {
    deleteReasonByName(req, res);
});

// Public endpoint for verification (no auth required)
router.get("/public-list-reasons", (req: Request, res: Response) => {
    listReasons(req, res);
});

router.get("/list-reasons", jwtAuth, (req: Request, res: Response) => {
    listReasons(req, res);
});

export default router;
