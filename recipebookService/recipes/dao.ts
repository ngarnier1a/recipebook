import model from "./model.js";
export const createRecipe = async (recipe: Recipe) => {
  delete recipe._id;
  return await model.create(recipe);
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