import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("NutritionModel", schema);
export default model;