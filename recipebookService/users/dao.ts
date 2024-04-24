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

export const findUserByIdRich = async (userId: UserID) =>
  await model.findById(userId).populate({
      path: "likedRecipes",
      select: "_id name author likes description",
      populate: {
        path: "author",
        select: "_id username",
      },
    }).populate({
      path: "authoredRecipes",
      select: "_id name author likes description",
      populate: {
        path: "author",
        select: "_id username",
      },
    }).populate({
      path: "followedChefs",
      select: "_id username authoredRecipes numFollowers",
      populate: {
        path: "authoredRecipes",
        select: "_id name likes",
      },
    });

export const findPublicUserByIdRich = async (userId: UserID) => {
  return await model
    .findById(userId)
    .select('-email -siteTheme -firstName -lastName')
    .populate({
      path: "likedRecipes",
      populate: {
        path: "author",
        select: "_id username",
      },
    }).populate({
      path: "authoredRecipes",
      populate: {
        path: "author",
        select: "_id username",
      },
    });
}

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
  let result;
  let change = 0;
  if (setLikedStatus) {
    result = await model.findById(userId).updateOne({ $addToSet: { likedRecipes: recipe._id } });
  } else {
    result = await model.findById(userId).updateOne({ $pull: { likedRecipes: recipe._id } });
  }

  if (result.modifiedCount === 1) {
    change = setLikedStatus ? 1 : -1;
  }

  const user = await findUserByIdRich(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return { change, user: user.toObject() as User };
}

export const authorNewRecipe = async (userId: UserID, recipe: Recipe) => {
  const user = await findUserById(userId, ["authoredRecipes"]);
  if (!user || user.authoredRecipes === undefined) {
    throw new Error("User/recipes not found");
  }
  user.authoredRecipes.push(recipe);
  await user.save();
}

export const updateFollowUser = async (userId: UserID, followUserId: UserID, toFollow: boolean): Promise<User> => {
  let result;
  if (toFollow) {
    result = await model.findById(userId).updateOne({ $addToSet: { followedChefs: followUserId } });
  } else {
    result = await model.findById(userId).updateOne({ $pull: { followedChefs: followUserId } });
  }

  if (result.modifiedCount === 1) {
    await model.findByIdAndUpdate(followUserId, { $inc: { numFollowers: (toFollow ? 1 : -1) } });
  }

  const user = await findUserByIdRich(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user.toObject() as User;
}

export const findChefs = async (sortBy: string, dir: string) => {
  const sortConditions = {
    likes: { $sort: { "totalLikes": dir === "dsc" ? -1 : 1 } },
    followers: { $sort: { "numFollowers": dir === "dsc" ? -1 : 1 } },
    recipes: { $sort: { "totalRecipes": dir === "dsc" ? -1 : 1 } },
  }

  const pipeline: any[] = [
    { $match: { type: "CHEF" } },
    { $project: { username: 1, authoredRecipes: 1, numFollowers: 1, bio: 1 } }
  ]

  if (sortBy === "likes") {
    const likeAggregateSteps = [
      {
        $lookup: {
          from: 'recipes',
          localField: 'authoredRecipes',
          foreignField: '_id',
          as: 'recipeDetails',
          pipeline: [{ $project: { likes: 1 } }],
        }
      },
      {
        $unwind: {
          path: '$recipeDetails',
          preserveNullAndEmptyArrays: true,
        }
      },
      {
        $group: {
          _id: '$_id',
          username: { $first: '$username' },
          bio: { $first: '$bio' },
          authoredRecipes: { $first: '$authoredRecipes' },
          numFollowers: { $first: '$numFollowers' },
          totalLikes: { $sum: '$recipeDetails.likes' },
        }
      },
    ]
    pipeline.push(...likeAggregateSteps);
  } else if (sortBy === "recipes") {
    const recipeAggregateStep =
      { $addFields: { totalRecipes: { $size: { $ifNull: [ '$authoredRecipes', [] ] } } } }
    pipeline.push(recipeAggregateStep);
  }

  pipeline.push(sortConditions[sortBy as keyof typeof sortConditions]);

  try {
    const chefs = await model.aggregate(pipeline);
    return chefs;
  } catch (e) {
    console.error(`Error getting chefs: ${e}`);
    throw e;
  }
}