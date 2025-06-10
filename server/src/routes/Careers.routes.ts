import { Router, Request, Response } from "express";
import { createCareer, listCareers, deleteCareerByName } from "../controllers/Careers.Controller";
import { jwtAuth } from "../middleware/jwtAuth.middleware";

const router: Router = Router();

router.post("/create-career", jwtAuth, (req: Request, res: Response) => {
    createCareer(req, res);
});

router.get("/list-careers", jwtAuth, (req: Request, res: Response) => {
    listCareers(req, res);
});

router.delete("/delete-career", jwtAuth, (req: Request, res: Response) => {
    deleteCareerByName(req, res);
});

export default router;
