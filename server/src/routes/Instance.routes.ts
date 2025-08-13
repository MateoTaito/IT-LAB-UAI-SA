import { Router, Request, Response } from "express";
import {
    createInstance,
    listInstances,
} from "../controllers/Instance.Controller";
import { jwtAuth } from "../middleware/jwtAuth.middleware";

const router: Router = Router();

router.post("/create-instance", jwtAuth, (req: Request, res: Response) => {
    createInstance(req, res);
});

router.get("/list-instances", jwtAuth, (req: Request, res: Response) => {
    listInstances(req, res);
});

export default router;
