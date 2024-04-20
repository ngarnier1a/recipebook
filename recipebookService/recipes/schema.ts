import mongoose from "mongoose";
const recipeSchema = new mongoose.Schema<Recipe>({
    name: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    steps: [{type: String}],
    notes: [{type: String}],
    likes: { type: Number, default: 0 },
  },
  { collection: "users" });
export default recipeSchema;