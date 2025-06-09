import { Router, Request, Response } from "express";
import { createUser, listUsers, deleteUserByEmail } from "../controllers/Users.Controller";
import { jwtAuth } from "../middleware/jwtAuth.middleware";

const router: Router = Router();

router.post("/create-user", jwtAuth, (req: Request, res: Response) => {
    createUser(req, res);
});

router.get("/list-users", jwtAuth, (req: Request, res: Response) => {
    listUsers(req, res);
});

router.delete("/delete-user", jwtAuth, (req: Request, res: Response) => {
    deleteUserByEmail(req, res);
});

export default router;
