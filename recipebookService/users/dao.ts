import model from "./model.js";

export const createUser = async (user: User) => {
  delete user._id;
  return await model.create(user);
};

export const findAllUsers = async (populate: string[] = []) =>
  await model.find().populate(populate);

export const findUserById = async (userId: UserID, populate: string[] = []) =>
  await model.findById(userId).populate(populate);

export const findUserByUsername = async (username: string, populate: string[] = []) =>
  await model.findOne({ username: username }).populate(populate);

export const findUserByCredentials = async (username: string, password: string, populate: string[] = []) =>
  await model.findOne({ username, password }).populate(populate);

export const updateUser = async (userId: UserID, user: User) =>
  await model.updateOne({ _id: userId }, { $set: user });

export const deleteUser = async (userId: UserID) =>
  await model.deleteOne({ _id: userId });

export const setLikedStatus = async (userId: UserID, recipe: Recipe, setLikedStatus: boolean): Promise<boolean> => {
  const user = await findUserById(userId, ["likedRecipes"]);
  if (!user || user.likedRecipes === undefined) {
    throw new Error("User/liked recipes not found");
  }
  console.log(user.likedRecipes.map(r => r._id?.toString()));
  console.log(recipe._id?.toString());
  console.log(`setLikedStatus: ${setLikedStatus}, !setLikedStatus: ${!setLikedStatus}`);
  console.log(`!setLikedStatus: ${!setLikedStatus} && ${user.likedRecipes.findIndex(r => r._id?.toString() === recipe._id?.toString())} > -1`)
  if (setLikedStatus && user.likedRecipes.findIndex(r => r._id?.toString() === recipe._id?.toString()) === -1) {
    // user wants to like and has not liked
    user.likedRecipes.push(recipe);
  } else if (!setLikedStatus && user.likedRecipes.findIndex(r => r._id?.toString() === recipe._id?.toString()) > -1) {
    // user wants to unlike and has liked
    user.likedRecipes = user.likedRecipes.filter(r => r._id?.toString() !== recipe._id?.toString());
  } else {
    // no change
    console.error("No change BRANCH")
    return false;
  }
  await user.save();
  return true;
}

export const authorNewRecipe = async (userId: UserID, recipe: Recipe) => {
  const user = await findUserById(userId, ["authoredRecipes"]);
  if (!user || user.authoredRecipes === undefined) {
    throw new Error("User/recipes not found");
  }
  user.authoredRecipes.push(recipe);
  await user.save();
}