import model from "./model.js";
import callTrackModel from "./callTrack.js";

export const addCallKeyword = async (keyword: string): Promise<void> => {
  await callTrackModel.create({ keyword: keyword });
};

export const checkCallKeyword = async (keyword: string): Promise<boolean> => {
  const result = await callTrackModel.findOne({ keyword: keyword });
  return result !== null;
};

const formatText = (input: string): string => {
  if (!input) return "Unknown";
  return input
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const toIngredientNutrient = (nutrient: any): IngredientNutrient => {
  if (nutrient.nutrientId) {
    return {
      nutrientId: nutrient.nutrientId.toString(),
      name: nutrient.nutrientName,
      amount: nutrient.value,
      unitName: nutrient.unitName,
    };
  } else {
    return {
      nutrientId: nutrient.nutrient.id.toString(),
      name: nutrient.nutrient.name,
      amount: nutrient.amount,
      unitName: nutrient.nutrient.unitName,
    };
  }
};

export const toFDCFoodItem = (foodItem: any): FDCFoodItem => {
  return {
    fdcId: foodItem.fdcId.toString(),
    description: formatText(foodItem.description),
    foodCategory: foodItem.foodCategory
      ? formatText(foodItem.foodCategory)
      : formatText(foodItem.brandedFoodCategory),
    brandName: foodItem.brandName
      ? formatText(foodItem.brandName)
      : formatText(foodItem.brandOwner),
    nutrients: foodItem.foodNutrients
      .map(toIngredientNutrient)
      .filter((nutrient: any) => nutrient.amount > 0),
  };
};

export const addFDCData = async (data: any): Promise<FDCFoodItem[]> => {
  const newFoods = data.foods.map(toFDCFoodItem);
  try {
    const result = await model.create(newFoods, { aggregateErrors: true });
    return result.filter((food: any) => !(food instanceof Error));
  } catch (e) {
    console.error(`Errors adding foods: ${e}`);
    return [];
  }
};

export const getFoodDataByKeyword = async (
  keyword: string,
  limit: number,
): Promise<[boolean, FDCFoodItem[]]> => {
  const perfectMatchFoods = await model.find({ description: keyword });
  const imperfectMatchFoods = await model
    .find({ description: { $regex: keyword, $options: "i" } })
    .limit(limit);
  return [
    perfectMatchFoods.length >= limit,
    [...perfectMatchFoods, ...imperfectMatchFoods],
  ];
};

export const getFoodDataById = async (
  fdcId: string,
): Promise<FDCFoodItem | null> => await model.findOne({ fdcId });

export const addFDCFoodItem = async (foodItem: FDCFoodItem) => {
  await model.create(foodItem);
};
