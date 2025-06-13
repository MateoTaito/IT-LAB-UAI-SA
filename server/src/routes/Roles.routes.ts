import { Router, Request, Response } from "express";
import { createRole, listRoles, deleteRoleByName, updateRole } from "../controllers/Roles.Controller";
import { jwtAuth } from "../middleware/jwtAuth.middleware";

const router: Router = Router();

router.post("/create-role", jwtAuth, (req: Request, res: Response) => {
    createRole(req, res);
});

router.get("/list-roles", jwtAuth, (req: Request, res: Response) => {
    listRoles(req, res);
});

router.delete("/delete-role", jwtAuth, (req: Request, res: Response) => {
    deleteRoleByName(req, res);
});

router.put("/update-role", jwtAuth, (req: Request, res: Response) => {
    updateRole(req, res);
});

export default router;
