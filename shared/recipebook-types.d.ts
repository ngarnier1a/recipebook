type UserType = "CHEF" | "FOODIE";

type User = {
    _id?: UserID;                       // optional: not passed from frontend on signup
    username: string;
    type: UserType;
    bio?: string;                       // optional: not passed for non-chefs and if not set
    password?: string;                  // optional: not passed to frontend
    email?: string;                     // optional: not passed when request for other user
    firstName?: string;                 // optional: not passed when request for other user
    lastName?: string;                  // optional: not passed when request for other user
    siteTheme?: SiteTheme;              // optional: not passed when request for other user
    likedRecipes?: Recipe[];            // optional: not passed if user has not liked any recipes or if not requesting user profile
    followedChefs?: User[];             // optional: not passed if user has not followed any chefs or if not requesting user profile
    authoredRecipes?: Recipe[];         // optional: not passed if user has not authored any recipes, is not a chef, or if not requesting user profile
    numFollowers?: number;              // optional: not passed if not a chef
    favoriteFoods?: FDCFoodItem[];      // optional: not passed if user has not favorited any foods
}

type Recipe = {
    _id?: RecipeID;                     // optional: not passed when creating a recipe
    name: string;
    description: string;
    ingredients?: RecipeIngredient[];   // optional: not passed if no ingredients or if not requesting recipe details
    author?: User;                      // optional: not passed when creating a recipe
    steps?: RecipeStep[];               // optional: not passed if no steps or if not requesting recipe details
    notes?: RecipeNote[];               // optional: not passed if no notes or if not requesting recipe details
    likes?: number;                     // optional: not passed if not requesting recipe details
}

type RecipeStep = {
    _id?: string;                       // the database id
    stepTitle: string;
    stepDescription: string;
}

type RecipeIngredient = {
    _id?: string;                       // the database id
    name: string;
    quantity: Number;
    unit: RecipeUnit;
    fdcItem?: FDCFoodItem;               // optional: not passed if not an FDC ingredient
    stepNumber?: number;                 // optional: not passed if not associated with a step
}

type IngredientNutrient = {
    nutrientId: string;
    name: string;
    amount: number;
    unitName: string;
}

type FDCFoodItem = {
    _id?: string;                          // the database id
    fdcId: string;                        // the FDC ID
    description: string;
    foodCategory: string;
    brandName?: string;
    nutrients: IngredientNutrient[];
}

type RecipeUnit = "tsp" | "tbsp" | "cup" | "oz" | "lb" | "g" | "kg" | "ml" | "l" | "unit";

type RecipeNote = {
    _id?: string;                      // the database id
    noteText: string;
};

type UserID = string;

type RecipeID = string;

type SiteTheme = "LIGHT" | "DARK";

type SearchType = "RECIPE" | "CHEF" | "INGREDIENT";