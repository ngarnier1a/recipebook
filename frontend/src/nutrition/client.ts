import axios from "axios";
const SERVICE_URL = process.env.REACT_APP_SERVICE_URL;

const api = axios.create({
   withCredentials: true
});

export const getFoodItem = async (fdcId: string): Promise<FDCFoodItem> => {
    const response = await api.get(`${SERVICE_URL}/nutrition/${fdcId}`);
    return response.data;
}