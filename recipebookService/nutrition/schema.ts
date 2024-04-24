import mongoose from "mongoose";

const nutrientSchema = new mongoose.Schema<IngredientNutrient>({
    nutrientId: { type: String },
    name: { type: String, required: true },
    amount: { type: Number, default: 0},
    unitName: { type: String, required: true },
  }, { _id: false }
);

const nutritionSchema = new mongoose.Schema<FDCFoodItem>({
    description: { type: String, required: true },
    foodCategory: { type: String, required: true },
    nutrients: [ nutrientSchema ],
  },
  { collection: "fdc_foods" }
);

export default nutritionSchema;