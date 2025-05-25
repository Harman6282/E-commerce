import express, {Express, Request, Response } from "express";

const app: Express = express();
const port = 3000;

app.get('/' , (req: Request, res: Response) => {
     res.json({message: "working fine"})
})

app.listen(port, () => {
  console.log(`server started running on port ${port}`);
});
