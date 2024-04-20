import axios from "axios";
const SERVICE_URL = process.env.REACT_APP_SERVICE_URL;

export const create = async (recipe: Recipe): Promise<Recipe> => {
    const response = await axios.post(`${SERVICE_URL}/recipe`, recipe);
    return response.data;
}

export const get = async (rid: RecipeID): Promise<Recipe> => {
    const response = await axios.get(`${SERVICE_URL}/recipe/${rid}`);
    return response.data;
}