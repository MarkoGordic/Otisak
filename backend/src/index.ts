import express, { Express, Request, Response } from "express";
import setupSwagger from "./utils/swaggerSetup";
const bodyParser = require("body-parser");
const cors = require("cors");
import path from "path";
import { createServer } from "http";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const swaggerApp: Express = express();
const port = process.env.PORT || 11000;
const swaggerPort = process.env.SWAGGER_PORT || 11002;

const httpServer = createServer(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const corsOptions = {
  origin: process.env.FRONTEND_URL || true,
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
};
app.use(cors(corsOptions));

const apiRouter = express.Router();

apiRouter.get("/", (req: Request, res: Response) => {
  res.send("Hello from OTISAK API!");
});

import authRouter from './routes/auth';
apiRouter.use('/auth', authRouter);
import userRouter from './routes/user';
apiRouter.use('/user', userRouter);

app.use('/api/v1', apiRouter);

swaggerApp.use("/", setupSwagger());

httpServer.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

swaggerApp.listen(swaggerPort, () => {
  console.log(`[Swagger]: Swagger docs available at http://localhost:${swaggerPort}/api-docs`);
});