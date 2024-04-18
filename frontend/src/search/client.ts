import axios from "axios";
const SERVICE_URL = process.env.REACT_APP_SERVICE_URL;

const api = axios.create({
   withCredentials: true
});

const search = async (query: string): Promise<SearchType> => {
    const response = await api.get(`${SERVICE_URL}/search?q=${query}`);
    return response.data;
}