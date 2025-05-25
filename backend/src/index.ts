import express, { Express, Request, Response } from "express";
import { PORT } from "./secrets";
import rootRouter from "./routes";
import { PrismaClient } from "./generated/prisma/client";
import { errorMiddlware } from "./middlewares/errors";
import { SignUpSchema } from "./schema/users";

const app: Express = express();

app.use(express.json());

app.use("/api", rootRouter);

export const prismaClient = new PrismaClient({
  log: ["query"],
})

app.use(errorMiddlware);

app.listen(PORT, () => {
  console.log(`server started running on port ${PORT}`);
});
