import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import { errorHandler } from "../error-handler";
import { addItemCart, changeQuantity, deleteItemFromCart, getCart } from "../controllers/cart.controller";



const cartRoutes: Router = Router();

cartRoutes.post("/", [authMiddleware] , errorHandler(addItemCart))
cartRoutes.get("/", [authMiddleware] , errorHandler(getCart))
cartRoutes.delete("/:id", [authMiddleware] , errorHandler(deleteItemFromCart))
cartRoutes.put("/:id", [authMiddleware] , errorHandler(changeQuantity))

export default cartRoutes;