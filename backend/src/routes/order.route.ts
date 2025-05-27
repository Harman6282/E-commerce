import { Router } from "express"
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";
import { cancelOrder, changeStatus, createOrder, getOrderById, listAllOrders, listOrders, listUserOrders } from "../controllers/orders.controller";

  

const orderRoutes: Router = Router();

orderRoutes.post("/", [authMiddleware, adminMiddleware] , errorHandler(createOrder));
orderRoutes.get("/", [authMiddleware, adminMiddleware] , errorHandler(listOrders));
orderRoutes.put("/:id/cancel", [authMiddleware, adminMiddleware] , errorHandler(cancelOrder));
orderRoutes.get("/:id", [authMiddleware, adminMiddleware] , errorHandler(getOrderById));
orderRoutes.get('/index', [authMiddleware, adminMiddleware], errorHandler(listAllOrders))
orderRoutes.get('/users/:id', [authMiddleware, adminMiddleware], errorHandler (listUserOrders))
orderRoutes.put('/status', [authMiddleware, adminMiddleware], errorHandler(changeStatus))

export default orderRoutes;