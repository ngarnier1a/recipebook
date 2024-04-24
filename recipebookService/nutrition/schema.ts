import mongoose from "mongoose";

const nutrientSchema = new mongoose.Schema<IngredientNutrient>({
    nutrientId: { type: String },
    name: { type: String, required: true },
    amount: { type: Number, default: 0},
    unitName: { type: String, required: true },
  }, { _id: false }
);

const nutritionSchema = new mongoose.Schema<FDCFoodItem>({
    fdcId: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    foodCategory: { type: String, required: true },
    brandName: { type: String },
    nutrients: [ nutrientSchema ],
  },
  { collection: "fdc_foods" }
);

export default nutritionSchema;