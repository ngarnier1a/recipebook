import model from "./model.js";
import { setLikedStatus as setUserLikedStatus, authorNewRecipe } from "../users/dao.js";
export const createRecipe = async (userId: UserID, recipe: Recipe) => {
  delete recipe._id;
  const newRecipe = await model.create(recipe);
  await authorNewRecipe(userId, newRecipe);
  return newRecipe;
};
export const findAllRecipes = async () =>
  await model.find().populate({
    path: "author",
    select: "_id username",
  });
export const findRecipeById = async (recipeId: RecipeID) =>
  await model.findById(recipeId).populate({
    path: "author",
    select: "_id username",
  });
export const findRecipeByRecipeName = async (recipeName: string) =>
  await model.findOne({ name: recipeName }).populate({
    path: "author",
    select: "_id username",
  });
export const findRecipesByChefId = async (chefId: UserID) =>
  await model.find({ author: chefId }).populate({
    path: "author",
    select: "_id username",
  });
export const updateRecipe = async (recipeId: RecipeID, recipe: Recipe) => await model.updateOne({ _id: recipeId }, { $set: recipe });
export const deleteRecipe = async (recipeId: RecipeID) => await model.deleteOne({ _id: recipeId });
export const setLikedStatus = async (recipeId: RecipeID, userId: UserID, setLikedStatus: boolean): Promise<boolean> => {
  const recipe = await model.findById(recipeId);
  if (!recipe || recipe.likes === undefined) {
    throw new Error("Recipe/recipe likes not found");
  }

  const userChanged = await setUserLikedStatus(userId, recipe, setLikedStatus);
  console.log(`userside: ${userChanged}`);
  if (setLikedStatus && userChanged) {
    // user wants to like and has not liked
    recipe.likes++;
  } else if (!setLikedStatus && userChanged){
    // user wants to unlike and has liked
    recipe.likes = Math.max(recipe.likes - 1, 0);
  } else {
    // no change
    return false;
  }
  await recipe.save();
  return true;
}