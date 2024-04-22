import model from "./model.js";

export const createUser = async (user: User) => {
  delete user._id;
  const newUser = await model.create(user);
  delete newUser.password;
  return newUser;
};

export const findAllUsers = async (populate: string[] = []) =>
  await model.find().populate(populate);

export const findUserById = async (userId: UserID, populate: string[] = []) =>
  await model.findById(userId).populate(populate);

export const findUserByUsername = async (username: string, populate: string[] = []) =>
  await model.findOne({ username: username }).populate(populate);

export const findUserByUsernameSecure = async (username: string, populate: string[] = []) => {
  return await model.findOne({ username: username }).select('+password').populate(populate);
}

export const updateUser = async (userId: UserID, user: User) =>
  await model.updateOne({ _id: userId }, { $set: user });

export const deleteUser = async (userId: UserID) =>
  await model.deleteOne({ _id: userId });

export const setLikedStatus = async (userId: UserID, recipe: Recipe, setLikedStatus: boolean): Promise<{ change: number, user: User }> => {
  const user = await findUserById(userId, ["likedRecipes", "authoredRecipes", "followedChefs"]);
  if (!user || user.likedRecipes === undefined) {
    throw new Error("User/liked recipes not found");
  }
  let change = 0;
  if (setLikedStatus && user.likedRecipes.findIndex(r => r._id?.toString() === recipe._id?.toString()) === -1) {
    // user wants to like and has not liked
    user.likedRecipes.push(recipe);
    change = 1;
  } else if (!setLikedStatus && user.likedRecipes.findIndex(r => r._id?.toString() === recipe._id?.toString()) > -1) {
    // user wants to unlike and has liked
    user.likedRecipes = user.likedRecipes.filter(r => r._id?.toString() !== recipe._id?.toString());
    change = -1;
  } else {
    // no change
    return {change, user}
  }
  await user.save();
  return {change, user: user.toObject() as User};
}

export const authorNewRecipe = async (userId: UserID, recipe: Recipe) => {
  const user = await findUserById(userId, ["authoredRecipes"]);
  if (!user || user.authoredRecipes === undefined) {
    throw new Error("User/recipes not found");
  }
  user.authoredRecipes.push(recipe);
  await user.save();
}