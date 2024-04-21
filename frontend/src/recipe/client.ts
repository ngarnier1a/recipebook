import axios from "axios";
const SERVICE_URL = process.env.REACT_APP_SERVICE_URL;

const api = axios.create({
    withCredentials: true
});

export const create = async (recipe: Recipe): Promise<Recipe> => {
    const response = await api.post(`${SERVICE_URL}/recipe`, recipe);
    return response.data;
}

export const get = async (rid: RecipeID): Promise<Recipe> => {
    const response = await api.get(`${SERVICE_URL}/recipe/${rid}`);
    return response.data;
}

export const update = async (rid: RecipeID, recipe: Recipe): Promise<void> => {
    await api.put(`${SERVICE_URL}/recipe/${rid}`, recipe);
}

export const setLikedStatus = async (rid: RecipeID, like: boolean): Promise<Recipe[]> => {
    const response = await api.post(`${SERVICE_URL}/recipe/${rid}/like`, { like });
    return response.data;
}