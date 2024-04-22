import * as dao from "./dao.js";
import { Application, Request, Response } from "express";
import * as bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export const updateSessionUser = async (req: Request): Promise<User|null> => {
  if (!req.session.user || !req.session.user._id) {
    return null;
  }
  try {
    const user = await dao.findUserByIdRich(req.session.user._id);
    req.session.user = (user ? user?.toObject() as User : null);
    if (user) {
      return user.toObject() as User;
    }
    return null;
  } catch (e) {
    console.error(`Error updating session user: ${e}`);
    return null;
  }
}

export default function UserRoutes(app: Application) {

  const updateUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    if (!req.session.user || req.session.user._id !== userId) {
      res.sendStatus(401);
      return;
    }
    delete req.body.password;
    try {
      const status = await dao.updateUser(userId, req.body);
      if (status.matchedCount === 0) {
        res.sendStatus(404);
        return;
      } else {
        const user = await updateSessionUser(req);
        res.send(user);
      }
    } catch (e) {
      console.error(`Error updating user: ${e}`);
      res.sendStatus(400);
    }
  };

  const signup = async (req: Request, res: Response) => {
    if (!req.body.username || !req.body.password) {
      res.status(400).json({ message: "Username and password are required" });
      return;
    }
    try {
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
    } catch (e) {
      console.error(`Error creating user: ${e}`);
      res.sendStatus(400);
    }
  };

  const signin = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) {
      res.sendStatus(400);
      return;
    }
    try {
      const existingUser = await dao.findUserByUsernameSecure(username);
      if (existingUser) {
        if (!existingUser.password) {
          res.sendStatus(500);
          return;
        } else if (await bcrypt.compare(password, existingUser.password)) {
          const richUser = await dao.findUserByIdRich(existingUser._id);
          if (!richUser) {
            res.sendStatus(500);
            return;
          }
          req.session.user = richUser;
          if (req.session.user.password) {
            console.error("Password in session");
            res.sendStatus(500);
          }
          res.send(req.session.user);
        }
      } else {
        res.sendStatus(401);
      }
    } catch (e) {
      console.error(`Error signing in: ${e}`);
      res.sendStatus(400);
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

  app.put("/api/auth/:userId", updateUser);
  app.post("/api/auth/signup", signup);
  app.post("/api/auth/signin", signin);
  app.post("/api/auth/signout", signout);
  app.get("/api/auth/profile", profile);
}
