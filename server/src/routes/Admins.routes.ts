import { Router, Request, Response } from "express";
import { createAdmin, listAdmins, deleteAdminByEmail } from "../controllers/Admins.Controller";
import { jwtAuth } from "../middleware/jwtAuth.middleware";

const router: Router = Router();

router.post("/create-admin", jwtAuth, (req: Request, res: Response) => {
    createAdmin(req, res);
});

router.get("/list-admins", jwtAuth, (req: Request, res: Response) => {
    listAdmins(req, res);
});

router.delete("/delete-admin", jwtAuth, (req: Request, res: Response) => {
    deleteAdminByEmail(req, res);
});

export default router;
