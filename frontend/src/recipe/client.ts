import axios from "axios";
const SERVICE_URL = process.env.REACT_APP_SERVICE_URL;

const api = axios.create({
    withCredentials: true
});

export const create = async (recipe: Recipe): Promise<{recipe: Recipe, user: User}> => {
    const response = await api.post(`${SERVICE_URL}/recipe`, recipe);
    return response.data;
}

export const get = async (rid: RecipeID): Promise<Recipe> => {
    const response = await api.get(`${SERVICE_URL}/recipe/${rid}`);
    return response.data;
}

export const update = async (rid: RecipeID, recipe: Recipe): Promise<User> => {
    const response = await api.put(`${SERVICE_URL}/recipe/${rid}`, recipe);
    return response.data;
}

export const deleteRecipe = async (rid: RecipeID): Promise<User> => {
    const response = await api.delete(`${SERVICE_URL}/recipe/${rid}`);
    return response.data;
}   

export const setLikedStatus = async (rid: RecipeID, like: boolean): Promise<User> => {
    const response = await api.post(`${SERVICE_URL}/recipe/${rid}/like`, { like });
    return response.data;
}