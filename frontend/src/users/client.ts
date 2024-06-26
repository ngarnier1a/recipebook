import axios from "axios";
const SERVICE_URL = process.env.REACT_APP_SERVICE_URL;
const SECURITY_API = `${SERVICE_URL}/auth`;

const api = axios.create({
  withCredentials: true,
});

export const signup = async (
  username: string,
  password: string,
  type: UserType,
  siteTheme: SiteTheme,
): Promise<User> => {
  const response = await api.post(`${SECURITY_API}/signup`, {
    username,
    password,
    type,
    siteTheme,
  });
  return response.data;
};

export const signin = async (
  username: string,
  password: string,
): Promise<User> => {
  const response = await api.post(`${SECURITY_API}/signin`, {
    username,
    password,
  });
  return response.data;
};

export const signout = async (): Promise<void> => {
  await api.post(`${SECURITY_API}/signout`);
};

export const profile = async (): Promise<User> => {
  const response = await api.get(`${SECURITY_API}/profile`);
  return response.data;
};

export const otherProfile = async (uid: UserID): Promise<User> => {
  const response = await api.get(`${SECURITY_API}/profile/${uid}`);
  return response.data;
};

export const updateProfile = async (user: User): Promise<User> => {
  const response = await api.put(`${SECURITY_API}/${user._id}`, user);
  return response.data;
};

export const setFollowUser = async (
  uid: UserID,
  follow: boolean,
): Promise<User> => {
  const response = await api.put(`${SECURITY_API}/follow/${uid}`, { follow });
  return response.data;
};

export const popularChefs = async (
  sortBy: string,
  sortDir: string,
): Promise<User[]> => {
  const response = await api.post(`${SERVICE_URL}/chefs`, null, {
    params: { sortBy, sortDir },
  });
  return response.data;
};

export const popularFollowedRecipes = async (
  sortDir: string,
): Promise<Recipe[]> => {
  const response = await api.post(`${SERVICE_URL}/recipes/followed`, null, {
    params: { sortDir },
  });
  return response.data;
};

export const favoriteFood = async (
  fdcId: string,
  toFavorite: boolean,
): Promise<User> => {
  const response = await api.put(`${SECURITY_API}/favorite/${fdcId}`, {
    toFavorite,
  });
  return response.data;
};
