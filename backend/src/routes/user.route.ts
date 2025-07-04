import { Router } from "express"
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";
import { addAddress, changeUserRole, deleteAddress, getUserById, listAddress, listUsers, updateUser } from "../controllers/user.controller";

  

const userRoutes: Router = Router();

userRoutes.post("/address", [authMiddleware], errorHandler(addAddress));
userRoutes.delete("/address/:id", [authMiddleware], errorHandler(deleteAddress));
userRoutes.get("/address", [authMiddleware], errorHandler(listAddress));
userRoutes.put("/", [authMiddleware], errorHandler(updateUser));
userRoutes.put("/:id/role", [authMiddleware, adminMiddleware], errorHandler(changeUserRole));
userRoutes.put("/", [authMiddleware, adminMiddleware], errorHandler(listUsers));
userRoutes.put("/:id", [authMiddleware, adminMiddleware], errorHandler(getUserById));

export default userRoutes;