import { Router, Request, Response } from "express";
import { createAdmin, listAdmins, deleteAdminByEmail, deleteAdminById } from "../controllers/Admins.Controller";
import { jwtAuth } from "../middleware/jwtAuth.middleware";

const router: Router = Router();

router.post("/create-admin", jwtAuth, (req: Request, res: Response) => {
    createAdmin(req, res);
});

router.get("/get-all-admins", jwtAuth, (req: Request, res: Response) => {
    listAdmins(req, res);
});

router.delete("/delete-admin", jwtAuth, (req: Request, res: Response) => {
    deleteAdminByEmail(req, res);
});

router.delete("/delete-admin/:id", jwtAuth, (req: Request, res: Response) => {
    deleteAdminById(req, res);
});

export default router;
