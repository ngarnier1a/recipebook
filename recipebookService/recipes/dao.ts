import model from "./model.js";
export const createUser = async (user: User) => {
  delete user._id;
  return await model.create(user);
};
export const findAllUsers = async () => await model.find();
export const findUserById = async (userId: UserID) => await model.findById(userId);
export const findUserByUsername = async (username: string) => await model.findOne({ username: username });
export const findUserByCredentials = async (username: string, password: string) => await model.findOne({ username, password });
export const updateUser = async (userId: UserID, user: User) => await model.updateOne({ _id: userId }, { $set: user });
export const deleteUser = async (userId: UserID) => await model.deleteOne({ _id: userId });