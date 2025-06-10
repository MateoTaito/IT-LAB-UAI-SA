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

router.get("/list-reasons", jwtAuth, (req: Request, res: Response) => {
    listReasons(req, res);
});

export default router;
