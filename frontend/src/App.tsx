import "./App.css";
import { HashRouter } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router";
import Home from "./home";
import Search from "./search";
import Profile from "./users/Profile";
import Recipe from "./recipe";
import Navigation from "./navigation";
import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import store from "./store";
import { Provider } from "react-redux";
import CurrentUser from "./users/CurrentUser";
import Nutrition from "./nutrition";
import RecipeMaker from "./recipe/RecipeMaker";
import UserRecipes from "./users/UserRecipes";
import ProfileEdit from "./users/ProfileEdit";
import Chefs from "./users/Chefs";
import Recipes from "./users/Recipes";

function App() {
  return (
    <ChakraProvider>
      <ColorModeProvider>
        <Provider store={store}>
          <CurrentUser>
            <HashRouter>
              <Navigation />
              <Routes>
                <Route path="/" element={<Navigate to="home" />} />
                <Route path="/home" element={<Home />} />
                <Route path="/user/profile" element={<Profile />} />
                <Route path="/user/profile/edit" element={<ProfileEdit />} />
                <Route path="/user/:userId/profile/" element={<Profile />} />
                <Route path="/user/recipes" element={<UserRecipes />} />
                <Route
                  path="/user/:userId/recipes"
                  element={<UserRecipes showLiked={false} />}
                />
                <Route path="/recipe/:recipeId" element={<Recipe />} />
                <Route path="/browse/chefs" element={<Chefs />} />
                <Route path="/browse/recipes" element={<Recipes />} />
                <Route path="/recipe/create" element={<RecipeMaker />} />
                <Route
                  path="/recipe/:recipeId/edit"
                  element={<RecipeMaker />}
                />
                <Route
                  path="/recipe/:recipeId/clone"
                  element={<RecipeMaker />}
                />
                <Route path="/nutrition" element={<Nutrition />} />
                <Route path="/nutrition/:fdcId" element={<Nutrition />} />
                <Route path="/nutrition/search" element={<Search />} />
              </Routes>
            </HashRouter>
          </CurrentUser>
        </Provider>
      </ColorModeProvider>
    </ChakraProvider>
  );
}

export default App;
