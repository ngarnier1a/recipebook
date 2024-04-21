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
    ingredientID: { type: String },
    name: { type: String, required: true },
    quantity: { type: Number, default: 0},
    unit: { type: String, enum: units, required: true },
    fdcID: { type: String },
    stepNumber: { type: Number },
});

const stepSchema = new mongoose.Schema<RecipeStep>({
    stepID: { type: String },
    stepTitle: { type: String },
    stepDescription: { type: String },
});

const noteSchema = new mongoose.Schema<RecipeNote>({
    noteID: { type: String },
    noteText: { type: String },
});

const recipeSchema = new mongoose.Schema<Recipe>({
    name: { type: String, required: true },
    description: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true },
    ingredients: [ ingredientSchema ],
    steps: [ stepSchema ],
    notes: [ noteSchema ],
    likes: { type: Number, default: 0 },
  },
  { collection: "recipes" });

export default recipeSchema;