import { Router, Request, Response } from "express";
import {
    createUser,
    listUsers,
    deleteUserByEmail,
    assignRoleToUser,
    getUsersByRole,
    deleteUserRole,
    assignCareerToUser,
    getUsersByCareer,
    deleteUserCareer,
    getUserById,
    updateUserStatus,
    updateUserData
} from "../controllers/Users.Controller";
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

router.post("/assign-role", jwtAuth, (req: Request, res: Response) => {
    assignRoleToUser(req, res);
});

router.post("/get-users-by-role", jwtAuth, (req: Request, res: Response) => {
    getUsersByRole(req, res);
});

router.delete("/delete-user-role", jwtAuth, (req: Request, res: Response) => {
    deleteUserRole(req, res);
});

router.post("/assign-career", jwtAuth, (req: Request, res: Response) => {
    assignCareerToUser(req, res);
});

router.post("/get-users-by-career", jwtAuth, (req: Request, res: Response) => {
    getUsersByCareer(req, res);
});

router.delete("/delete-user-career", jwtAuth, (req: Request, res: Response) => {
    deleteUserCareer(req, res);
});

// Add the new route - this matches the frontend's /${userId} format
router.get("/:id", jwtAuth, (req: Request, res: Response) => {
    getUserById(req, res);
});

// Protected route for updating user status
router.put("/update-status", jwtAuth, (req: Request, res: Response) => {
    updateUserStatus(req, res);
});

// Public endpoint for verification (no auth required)
router.put("/public-update-status", (req: Request, res: Response) => {
    updateUserStatus(req, res);
});

router.put("/update-user-data", jwtAuth, (req: Request, res: Response) => {
    updateUserData(req, res);
});

export default router;
