import mongoose from "mongoose";
const userSchema = new mongoose.Schema<User>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    bio: String,
    firstName: String,
    lastName: String,
    email: String,
    type: {
      type: String,
      enum: ["CHEF", "FOODIE"],
      default: "FOODIE"
    },
    siteTheme: {
      type: String,
      enum: ["LIGHT", "DARK"],
      default: "LIGHT",
    },
    likedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "RecipeModel" }],
    followedChefs: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserModel" }],
    authoredRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "RecipeModel" }],
    numFollowers: { type: Number, default: 0, min: 0 },
  },
  { collection: "users" });
export default userSchema;