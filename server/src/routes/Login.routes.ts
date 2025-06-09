import { Router, Request, Response } from "express";
import { loginAdmin, logoutAdmin } from "../controllers/Login.Controller";
import { jwtAuth } from "../middleware/jwtAuth.middleware";

const router: Router = Router();

router.post("/admin-login", (req: Request, res: Response) => {
    loginAdmin(req, res);
});

router.post("/admin-logout", jwtAuth, (req: Request, res: Response) => {
    logoutAdmin(req, res);
});

export default router;
