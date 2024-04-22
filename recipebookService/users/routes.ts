import * as dao from "./dao.js";
import { Application, Request, Response } from "express";
import * as bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export const updateSessionUser = async (req: Request): Promise<User|null> => {
  if (!req.session.user || !req.session.user._id) {
    return null;
  }
  const user = await dao.findUserById(req.session.user._id, ['likedRecipes', 'followedChefs', 'authoredRecipes']);
  req.session.user = (user ? user?.toObject() as User : null);
  if (user) {
    return user.toObject() as User;
  }
  return null;
}

export default function UserRoutes(app: Application) {

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
      const user = await updateSessionUser(req);
      res.send(user);
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
    req.session.user = currentUser.toObject();
    res.send(currentUser);
  };
  const signin = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) {
      res.sendStatus(400);
      return;
    }
    const existingUser = await dao.findUserByUsernameSecure(username, ['likedRecipes', 'followedChefs', 'authoredRecipes']);
    if (existingUser) {
      if (!existingUser.password) {
        res.sendStatus(500);
        return;
      } else if (await bcrypt.compare(password, existingUser.password)) {
        const userForSession = existingUser.toObject() as User;
        delete userForSession.password;
        req.session.user = userForSession;
        if (req.session.user.password) {
          console.error("Password in session");
          res.sendStatus(500);
        }
        res.send(req.session.user);
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
    const user = await updateSessionUser(req);
    res.send(user);
  };

  const otherProfile = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const user = await dao.findUserById(userId, ['likedRecipes', 'followedChefs', 'authoredRecipes']);
    if (!user) {
      res.sendStatus(404);
      return;
    }
    res.send(user);
  }

  app.put("/api/auth/:userId", updateUser);
  app.post("/api/auth/signup", signup);
  app.post("/api/auth/signin", signin);
  app.post("/api/auth/signout", signout);
  app.get("/api/auth/profile", profile);
  app.get("/api/auth/profile/:userId", otherProfile);
}
