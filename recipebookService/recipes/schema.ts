import mongoose from "mongoose";

const units: RecipeUnit[] = [
    "unit",
    "tsp",
    "tbsp",
    "cup",
    "oz",
    "lb",
    "g",
    "kg",
    "ml",
    "l",
];

const ingredientSchema = new mongoose.Schema<RecipeIngredient>({
    name: { type: String, required: true },
    quantity: { type: Number, default: 0},
    unit: { type: String, enum: units, required: true },
    fdcID: { type: String },
    stepNumber: { type: Number },
});

const stepSchema = new mongoose.Schema<RecipeStep>({
    stepTitle: { type: String },
    stepDescription: { type: String },
});

const recipeSchema = new mongoose.Schema<Recipe>({
    name: { type: String, required: true },
    description: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    ingredients: [ ingredientSchema ],
    steps: [ stepSchema ],
    notes: [ {type: String} ],
    likes: { type: Number, default: 0 },
  },
  { collection: "recipes" });

export default recipeSchema;