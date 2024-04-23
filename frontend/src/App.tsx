import "./App.css";
import React from "react";
import { HashRouter } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router";
import Home from "./home";
// import Search from "./search";
import Profile from "./users/Profile";
import Recipe from "./recipe";
import Navigation from "./navigation";
import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import store from "./store";
import { Provider } from "react-redux";
import CurrentUser from "./users/CurrentUser";
import Nutrition from "./nutrition";
import RecipeMaker from "./recipe/RecipeMaker";
import Recipes from "./users/Recipes";
import ProfileEdit from "./users/ProfileEdit";
import Chefs from "./users/Chefs";

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
                {/* <Route path="/search" element={<Search />} /> */}
                {/* <Route path="/search/:searchType/:searchQuery" element={<Search />} /> */}
                <Route path="/user/profile" element={<Profile />} />
                <Route path="/user/profile/edit" element={<ProfileEdit />} />
                <Route path="/user/:userId/profile/" element={<Profile />} />
                <Route path="/user/recipes" element={<Recipes />} />
                <Route path="/user/:userId/recipes" element={<Recipes showLiked={false} />} />
                <Route path="/recipe/:recipeId" element={<Recipe />} />
                <Route path="/browse/chefs" element={<Chefs />} />
                {/* <Route path="/recipe/:recipeId/cook" element={<RecipeViewer />} /> */}
                <Route path="/recipe/create" element={<RecipeMaker />} />
                <Route path="/recipe/:recipeId/edit" element={<RecipeMaker />} />
                <Route path="/recipe/:recipeId/clone" element={<RecipeMaker />} />
                <Route path="/nutrition" element={<Nutrition />} />
                <Route path="/nutrition/:ingredientId" element={<Nutrition />} />
              </Routes>
            </HashRouter>
          </CurrentUser>
        </Provider>
      </ColorModeProvider>
    </ChakraProvider>
  );
}

export default App;
