/// <reference types="react-scripts" />

type UserType = "CHEF" | "FOODIE";

type User = {
    _id?: UserID;                       // optional: not passed to server on signup
    username: string;
    type: UserType;
    password?: string;                  // optional: not passed from server
    email?: string;                     // optional: not passed when request for other user
    firstName?: string;                 // optional: not passed when request for other user
    lastName?: string;                  // optional: not passed when request for other user
    siteTheme?: SiteTheme;              // optional: not passed when request for other user
    likedRecipes?: Recipe[];            // optional: not passed if user has not liked any recipes or if not requesting user profile
    followedChefs?: User[];             // optional: not passed if user has not followed any chefs or if not requesting user profile
    authoredRecipes?: Recipe[];         // optional: not passed if user has not authored any recipes, is not a chef, or if not requesting user profile
}

type Recipe = {
    _id: RecipeID;
    name: string;
    author: User;
    steps?: RecipeStep[];               // optional: not passed if no steps or if not requesting recipe details
    notes?: RecipeNote[];               // optional: not passed if no notes or if not requesting recipe details
    likes?: number;                     // optional: not passed if not requesting recipe details
}

type RecipeStep = {
    stepText: string;
    ingredients?: RecipeIngredient[];   // optional: not passed if no ingredients for this step
    history?: RecipeStep[];
}

type RecipeIngredient = {
    name: string;
    quantity: number;
    unit: RecipeUnit;
    notes?: RecipeNote[];               // optional: not passed if no notes
    editHistory?: RecipeIngredient[];   // optional: not passed if no change history
    ftc_id?: string;                    // optional: not passed if not an FTC ingredient
}

type IngredientNutrient = {
    _id: number;
    number: string;
    name: string;
    rank: number;
    unitName: string;
}

type FTCFoodItem = {
    ftc_id: string;
    name: string;
    nutrients: IngredientNutrient[];
}

type RecipeUnit = "tsp" | "tbsp" | "cup" | "oz" | "lb" | "g" | "kg" | "ml" | "l" | "unit";

type RecipeNote = string;

type UserID = string;

type RecipeID = string;

type SiteTheme = "LIGHT" | "DARK";

type SearchType = "RECIPE" | "CHEF" | "INGREDIENT";
