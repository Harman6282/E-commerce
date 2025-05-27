import { Router } from "express"
import { errorHandler } from "../error-handler";
import { createProduct, deleteProduct, getProductById, listProduct, updateProduct } from "../controllers/product.controller";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";

  

const productRoutes: Router = Router();

productRoutes.post("/", [authMiddleware, adminMiddleware] , errorHandler(createProduct));
productRoutes.put("/:id", [authMiddleware, adminMiddleware] , errorHandler(updateProduct));
productRoutes.delete("/:id", [authMiddleware, adminMiddleware] , errorHandler(deleteProduct));
productRoutes.get("/:id", [authMiddleware, adminMiddleware] , errorHandler(getProductById));
productRoutes.get("/", [authMiddleware, adminMiddleware] , errorHandler(listProduct));

export default productRoutes;