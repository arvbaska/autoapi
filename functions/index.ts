import * as functions from "firebase-functions";
import * as express from "express";

export const helloWorld = functions.https.onRequest((req, res) => {
  res.send("Hello from AutoAPI!");
});


const app = express();

app.get("/", (req, res) => {
  res.send("AutoAPI backend");
});

export const appFunc = functions.https.onRequest(app);
