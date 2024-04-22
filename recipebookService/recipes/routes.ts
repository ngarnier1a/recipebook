import { updateSessionUser } from "../users/routes.js";
import * as dao from "./dao.js";
import * as userDao from "../users/dao.js";
import { Application, Request, Response } from "express";


export default function RecipeRoutes(app: Application) {

  const createRecipe = async (req: Request, res: Response) => {
    if (!req.session.user || req.session.user.type !== "CHEF") {
      res.sendStatus(401);
      return;
    }

    req.body.author = req.session.user._id;
    try {
      const recipe = await dao.createRecipe(req.session.user._id ?? 'Bad ID', req.body);
      console.error(`RECIPE CREATED: ${JSON.stringify(recipe)}`);
      const user = await updateSessionUser(req);
      res.send({recipe: recipe.toObject(), user: user});
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
      return;
    }
  };

  const getRecipeDetails = async (req: Request, res: Response) => {
    const { recipeId } = req.params;
    try {
      if (!recipeId) {
        res.sendStatus(400);
        return;
      }
      const recipe = await dao.findRecipeById(recipeId);
      if (!recipe) {
        res.sendStatus(404);
        return;
      }
      res.send(recipe.toObject());
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  };

  const updateRecipe = async (req: Request, res: Response) => {
    const { recipeId } = req.params;
    if (!req.session.user || req.session.user.type !== "CHEF") {
      res.sendStatus(401);
      return;
    }
    const recipe = await dao.findRecipeById(recipeId);
    if (!recipe) {
      res.sendStatus(404);
      return;
    }

    if (recipe.author?._id?.toString() !== req.session.user._id) {
      res.sendStatus(401);
      return;
    }

    try {
      const status = await dao.updateRecipe(recipeId, req.body);
      if (status.matchedCount === 0) {
        res.sendStatus(500);
        return;
      } else {
        const user = await updateSessionUser(req);
        res.send(user);
      }
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
      return;
    }
  };

  const deleteRecipe = async (req: Request, res: Response) => {
    const { recipeId } = req.params;
    if (!req.session.user || req.session.user.type !== "CHEF") {
      res.sendStatus(401);
      return;
    }
    const recipe = await dao.findRecipeById(recipeId);
    if (!recipe || recipe.author?._id?.toString() !== req.session.user._id) {
      console.error("Recipe not found or user not authorized to delete recipe")
      res.sendStatus(404);
      return;
    }
    const status = await dao.deleteRecipe(recipeId);
    if (status.deletedCount === 0) {
      console.error("Recipe not found")
      res.sendStatus(500);
      return;
    } else {
      const user = await updateSessionUser(req);
      res.send(user);
    }
  };

  const likeRecipe = async (req: Request, res: Response) => {
    const { recipeId } = req.params;
    if (!req.session.user || !req.session.user._id) {
      res.sendStatus(401);
      return;
    }

    const like = req.body.like;

    try {
      const recipe = await dao.findRecipeById(recipeId);
      if (!recipe) {
        res.sendStatus(404);
        return;
      }

      const { change, user } = await userDao.setLikedStatus(req.session.user._id, recipe, like);
      if (change !== 0) {
        recipe.likes = (recipe.likes || 0) + change;
        await recipe.save();
        req.session.user = user;
      }
      res.send(user);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  };

  app.post("/api/recipe", createRecipe);
  app.get("/api/recipe/:recipeId", getRecipeDetails);
  app.put("/api/recipe/:recipeId", updateRecipe);
  app.delete("/api/recipe/:recipeId", deleteRecipe);
  app.post("/api/recipe/:recipeId/like", likeRecipe);
}
