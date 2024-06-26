import model from "./model.js";
import { authorNewRecipe } from "../users/dao.js";
import mongoose from "mongoose";
export const createRecipe = async (userId: UserID, recipe: Recipe) => {
  delete recipe._id;
  const newRecipe = await model.create(recipe);
  await authorNewRecipe(userId, newRecipe);
  return newRecipe;
};
export const findAllRecipes = async () =>
  await model.find().populate([
    {
      path: "author",
      select: "_id username",
    },
    {
      path: "ingredients.fdcItem",
      select: "_id fdcId description foodCategory brandName",
    },
  ]);
export const findRecipeById = async (recipeId: RecipeID) =>
  await model.findById(recipeId).populate([
    {
      path: "author",
      select: "_id username",
    },
    {
      path: "ingredients.fdcItem",
      select: "_id fdcId description foodCategory brandName",
    },
  ]);
export const findRecipeByRecipeName = async (recipeName: string) =>
  await model.findOne({ name: recipeName }).populate([
    {
      path: "author",
      select: "_id username",
    },
    {
      path: "ingredients.fdcItem",
      select: "_id fdcId description foodCategory brandName",
    },
  ]);
export const findRecipesByChefId = async (chefId: UserID) =>
  await model.find({ author: chefId }).populate([
    {
      path: "author",
      select: "_id username",
    },
    {
      path: "ingredients.fdcItem",
      select: "_id fdcId description foodCategory brandName",
    },
  ]);
export const updateRecipe = async (recipeId: RecipeID, recipe: Recipe) =>
  await model.updateOne({ _id: recipeId }, { $set: recipe });
export const deleteRecipe = async (recipeId: RecipeID) =>
  await model.deleteOne({ _id: recipeId });

export const getPopularRecipes = async (sortDir: string) => {
  const recipes = await model
    .find()
    .sort({ likes: sortDir === "dsc" ? -1 : 1 })
    .populate([
      {
        path: "author",
        select: "_id username",
      },
      {
        path: "ingredients.fdcItem",
        select: "_id fdcId description foodCategory brandName",
      },
    ])
    .select("_id name likes description")
    .exec();
  return recipes;
};

export const getPopularFollowedRecipes = async (
  user: User,
  sortDir: string,
) => {
  const recipes = await model
    .find({
      author: {
        $in: (user.followedChefs ?? []).map(
          (chef) => new mongoose.Types.ObjectId(chef._id),
        ),
      },
    })
    .sort({ likes: sortDir === "dsc" ? -1 : 1 })
    .populate({
      path: "author",
      select: "_id username",
    })
    .select("_id name likes description")
    .exec();

  return recipes;
};

export const getRecipesWithFDCId = async (fdcId: string) => {
  const recipes = await model.aggregate([
    {
      $lookup: {
        from: "fdc_foods",
        localField: "ingredients.fdcItem",
        foreignField: "_id",
        as: "nutritionDetails",
      },
    },
    {
      $match: {
        "nutritionDetails.fdcId": fdcId,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "authorDetails",
      },
    },
    {
      $unwind: "$authorDetails",
    },
    {
      $project: {
        name: 1,
        description: 1,
        author: {
          _id: "$author",
          username: "$authorDetails.username",
        },
        likes: 1,
      },
    },
  ]);
  return recipes;
};

export const getNewRecipes = async () => {
  const recipes = await model
    .find()
    .sort({ _id: -1 })
    .populate({
      path: "author",
      select: "_id username",
    })
    .select("_id name likes description")
    .exec();
  return recipes;
};
