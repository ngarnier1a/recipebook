import express from "express";
import cors from "cors";
import "dotenv/config";
import assert from "assert";
import session, { SessionOptions } from "express-session";
import mongoose from "mongoose";
import UserRoutes from "./users/routes.js";
import bodyParser from "body-parser";

assert(process.env.DB_CONNECTION_STRING, "DB_CONNECTION_STRING is not set");
assert(process.env.SESSION_SECRET, "SESSION_SECRET is not set");
assert(process.env.FRONTEND_URL, "FRONTEND_URL is not set");

mongoose.connect(process.env.DB_CONNECTION_STRING);
const app = express();
const port = process.env.PORT || 4000;
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);

const sessionOptions: SessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
};
if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
  };
}
app.use(session(sessionOptions));
app.use(express.json()); 
app.get("/api/health", (req, res) => {
  res.sendStatus(200);
});

UserRoutes(app);

app.listen(port, () => console.log(`recipebookService running on port ${port}`));
