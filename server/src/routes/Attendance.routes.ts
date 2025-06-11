import { Router, Request, Response } from "express";
import { checkIn } from "../controllers/Attendance.controller";
import { jwtAuth } from "../middleware/jwtAuth.middleware";

const router: Router = Router();

router.post("/check-in", jwtAuth, (req: Request, res: Response) => {
    checkIn(req, res);
});

export default router;
