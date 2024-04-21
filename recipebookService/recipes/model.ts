import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("RecipeModel", schema);
export default model;