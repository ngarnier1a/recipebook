import * as dao from "./dao.js";
import { Application, Request, Response } from "express";
import * as bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export default function UserRoutes(app: Application) {
  /**
  const createUser = async (req: Request, res: Response) => {
    const user = await dao.createUser(req.body);
    res.json(user);
  };
  const deleteUser = async (req: Request, res: Response) => {
    const status = await dao.deleteUser(req.params.userId);
    res.json(status);
  };
  const findAllUsers = async (req: Request, res: Response) => {
    const users = await dao.findAllUsers();
    res.json(users);
  };
  const findUserById = async (req: Request, res: Response) => {};
  */
  const sendUser = (user: User, res: Response) => {
    delete user.password;
    res.json(user);
  }

  const updateUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    if (!req.session.user || req.session.user._id !== userId) {
      res.sendStatus(401);
      return;
    }
    delete req.body.password;
    const status = await dao.updateUser(userId, req.body);
    if (status.matchedCount === 0) {
      res.sendStatus(404);
      return;
    } else {
      req.session.user = req.body;
      res.sendStatus(200);
    }
  };
  const signup = async (req: Request, res: Response) => {
    if (!req.body.username || !req.body.password) {
      res.status(400).json({ message: "Username and password are required" });
      return;
    }
    const user = await dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }
    const userBody: User = {
      username: req.body.username,
      password: await bcrypt.hash(req.body.password, SALT_ROUNDS),
      type: req.body.type,
      siteTheme: req.body.siteTheme || "LIGHT",
    }

    const currentUser = await dao.createUser(userBody);
    req.session.user = currentUser;
    sendUser(currentUser, res);
  };
  const signin = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) {
      res.sendStatus(400);
      return;
    }
    const existingUser = await dao.findUserByUsername(username);
    if (existingUser) {
      if (!existingUser.password) {
        res.sendStatus(500);
        console.error(`User ${username} has no password in database.`);
        return;
      } else if (await bcrypt.compare(password, existingUser.password)) {
        req.session.user = existingUser;
        console.error(req.session);
        sendUser(existingUser, res);
      }
    } else {
      res.sendStatus(401);
    }
  };
  const signout = (req: Request, res: Response) => {
    req.session.destroy(() => res.sendStatus(200));
  };
  const profile = async (req: Request, res: Response) => {
    const currentUser = req.session.user;
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    console.error(req.session);
    sendUser(currentUser, res);
  };

  //app.post("/api/auth", createUser);
  //app.get("/api/auth", findAllUsers);
  //app.get("/api/auth/:userId", findUserById);
  app.put("/api/auth/:userId", updateUser);
  //app.delete("/api/auth/:userId", deleteUser);
  app.post("/api/auth/signup", signup);
  app.post("/api/auth/signin", signin);
  app.post("/api/auth/signout", signout);
  app.get("/api/auth/profile", profile);
}
