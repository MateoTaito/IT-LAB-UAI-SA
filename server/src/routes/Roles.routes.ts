import { Router, Request, Response } from "express";
import { createRole, listRoles, listRolesForUsers, deleteRoleByName, updateRole } from "../controllers/Roles.Controller";
import { jwtAuth } from "../middleware/jwtAuth.middleware";

const router: Router = Router();

router.post("/create-role", jwtAuth, (req: Request, res: Response) => {
    createRole(req, res);
});

router.get("/list-roles", jwtAuth, (req: Request, res: Response) => {
    listRoles(req, res);
});

router.get("/list-roles-for-users", jwtAuth, (req: Request, res: Response) => {
    listRolesForUsers(req, res);
});

router.delete("/delete-role", jwtAuth, (req: Request, res: Response) => {
    deleteRoleByName(req, res);
});

router.put("/update-role", jwtAuth, (req: Request, res: Response) => {
    updateRole(req, res);
});

export default router;
