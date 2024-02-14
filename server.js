process.on("uncaughtException", (err) => {
  console.log("error", err);
});

import express from "express";
import dotenv from "dotenv";

import { dbConnection } from "./databases/dbConnection.js";
import userRouter from "./src/modules/users/userRouters.js";
import { appError } from "./src/utils/appError.js";
import { globalError } from "./src/middlewares/globalErrorMiddleware.js";
import messsageRouter from "./src/modules/messages/messageRouters.js";

const app = express();
const port = 3000;

dotenv.config();
dbConnection();

app.use(express.json());
app.use(userRouter);
app.use(messsageRouter);

app.use("*", (req, res, next) => {
  next(new appError(`not found endPoint : ${req.originalUrl}`, 404));
});

app.use(globalError);

process.on("unhandledRejection", (err) => {
  console.log("error", err);
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
