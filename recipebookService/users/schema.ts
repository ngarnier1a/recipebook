import mongoose from "mongoose";
const userSchema = new mongoose.Schema<User>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
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
    likedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "recipes" }],
    followedChefs: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    authoredRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "recipes" }],
  },
  { collection: "users" });
export default userSchema;