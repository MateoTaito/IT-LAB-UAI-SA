import { Router, Request, Response } from "express";
import { checkIn, listActiveUsers, listInactiveUsers, listAllUsersAttendance, checkOut } from "../controllers/Attendance.controller";
import { jwtAuth } from "../middleware/jwtAuth.middleware";

const router: Router = Router();

router.post("/check-in-user", jwtAuth, (req: Request, res: Response) => {
    checkIn(req, res);
});

router.post("/check-out-user", jwtAuth, (req: Request, res: Response) => {
    checkOut(req, res);
});

router.get("/list-active-users", jwtAuth, (req: Request, res: Response) => {
    listActiveUsers(req, res);
});

router.get("/list-inactive-users", jwtAuth, (req: Request, res: Response) => {
    listInactiveUsers(req, res);
});

router.get("/list-all-users", jwtAuth, (req: Request, res: Response) => {
    listAllUsersAttendance(req, res);
});

export default router;
