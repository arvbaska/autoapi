import * as functions from "firebase-functions";
import express, {Request, Response} from "express";

export const helloWorld = functions.https.onRequest(
  (req: Request, res: Response) => {
    res.send("Hello from AutoAPI!");
  }
);


const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("AutoAPI backend");
});

export const appFunc = functions.https.onRequest(app);
