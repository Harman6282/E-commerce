import { Router } from "express";
import authRoutes from "./auth.route";
import productRoutes from "./products.route";
import userRoutes from "./user.route";
import cartRoutes from "./cart.route";
import orderRoutes from "./order.route";

const rootRouter: Router = Router();

rootRouter.use('/auth', authRoutes);
rootRouter.use('/products', productRoutes);
rootRouter.use('/users', userRoutes);
rootRouter.use('/cart', cartRoutes);
rootRouter.use("/orders", orderRoutes)

export default rootRouter;

/* 1. user management
a. list users I
c. get user by id
b. change user role
2. order management
a. list all orders (fliter on status)
b. change order status
3. products
a. search api for products (for both users and admins) -> full text search
*/