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
      const recipe = await dao.createRecipe(
        req.session.user._id ?? "Bad ID",
        req.body,
      );
      const user = await updateSessionUser(req);
      res.send({ recipe: recipe.toObject(), user: user });
    } catch (e) {
      console.error(`Error creating recipe: ${e}`);
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
      console.error(`Error getting recipe details: ${e}`);
      res.sendStatus(404);
    }
  };

  const updateRecipe = async (req: Request, res: Response) => {
    const { recipeId } = req.params;
    if (!req.session.user || req.session.user.type !== "CHEF") {
      res.sendStatus(401);
      return;
    }
    try {
      const recipe = await dao.findRecipeById(recipeId);
      if (!recipe) {
        res.sendStatus(404);
        return;
      }

      if (recipe.author?._id?.toString() !== req.session.user._id) {
        res.sendStatus(401);
        return;
      }

      const status = await dao.updateRecipe(recipeId, req.body);
      if (status.matchedCount === 0) {
        res.sendStatus(500);
        return;
      } else {
        const user = await updateSessionUser(req);
        res.send(user);
      }
    } catch (e) {
      console.error(`Error updating recipe: ${e}`);
      res.sendStatus(404);
      return;
    }
  };

  const deleteRecipe = async (req: Request, res: Response) => {
    const { recipeId } = req.params;
    if (!req.session.user || req.session.user.type !== "CHEF") {
      res.sendStatus(401);
      return;
    }

    try {
      const recipe = await dao.findRecipeById(recipeId);
      if (!recipe || recipe.author?._id?.toString() !== req.session.user._id) {
        console.error(
          "Recipe not found or user not authorized to delete recipe",
        );
        res.sendStatus(404);
        return;
      }
      const status = await dao.deleteRecipe(recipeId);
      if (status.deletedCount === 0) {
        console.error("Recipe not found");
        res.sendStatus(500);
        return;
      } else {
        const user = await updateSessionUser(req);
        res.send(user);
      }
    } catch (e) {
      console.error(`Error deleting recipe: ${e}`);
      res.sendStatus(401);
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

      const { change, user } = await userDao.setLikedStatus(
        req.session.user._id,
        recipe,
        like,
      );

      if (change === 0) {
        res.sendStatus(400);
        return;
      }

      const modifiableRecipe = recipe.toObject();
      await dao.updateRecipe(recipeId, {
        ...modifiableRecipe,
        likes: Math.max(0, (modifiableRecipe.likes ?? 0) + change),
      });

      res.send(user);
    } catch (e) {
      console.error(`Error liking recipe: ${e}`);
      res.sendStatus(500);
    }
  };

  const popularRecipes = async (req: Request, res: Response) => {
    const { sortBy, sortDir } = req.query;
    try {
      let recipes: Recipe[] = [];
      if (sortBy === "popular") {
        recipes = await dao.getPopularRecipes(sortDir as string);
      } else if (sortBy === "new") {
        recipes = await dao.getNewRecipes();
      }
      res.send(recipes);
    } catch (e) {
      console.error(`Error getting popular recipes: ${e}`);
      res.sendStatus(500);
    }
  };

  const popularFollowedRecipes = async (req: Request, res: Response) => {
    const { sortDir } = req.query;
    if (!req.session.user || !req.session.user._id) {
      res.sendStatus(401);
      return;
    }

    try {
      const recipes = await dao.getPopularFollowedRecipes(
        req.session.user,
        sortDir as string,
      );
      res.send(recipes);
    } catch (e) {
      console.error(`Error getting popular followed recipes: ${e}`);
      res.sendStatus(500);
    }
  };

  app.post("/api/recipe", createRecipe);
  app.get("/api/recipe/:recipeId", getRecipeDetails);
  app.put("/api/recipe/:recipeId", updateRecipe);
  app.delete("/api/recipe/:recipeId", deleteRecipe);
  app.put("/api/recipe/:recipeId/like", likeRecipe);
  app.post("/api/recipes", popularRecipes);
  app.post("/api/recipes/followed", popularFollowedRecipes);
}
