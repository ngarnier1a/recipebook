import "./App.css";
import React from "react";
import { HashRouter } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router";
import Home from "./home";
// import Search from "./search";
import Profile from "./users/Profile";
import Recipe from "./recipe";
import Navigation from "./navigation";
import Friends from "./friend";
import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import store from "./store";
import { Provider } from "react-redux";
import CurrentUser from "./users/CurrentUser";
import Nutrition from "./nutrition";
import RecipeMaker from "./recipe/RecipeMaker";
import RecipeViewer from "./recipe/RecipeViewer";

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
                <Route path="/user/:uid/profile/" element={<Profile />} />
                <Route path="/user/recipes" element={<Recipe />} />
                <Route path="/user/:uid/recipes" element={<Recipe />} />
                <Route path="/user/friends" element={<Friends />} />
                <Route path="/user/:uid/friends" element={<Friends />} />
                <Route path="/recipe/:rid" element={<Recipe />} />
                <Route path="/recipe/:rid/cook" element={<RecipeViewer />} />
                <Route path="/recipe/create" element={<RecipeMaker />} />
                <Route path="/recipe/:rid/edit" element={<RecipeMaker />} />
                <Route path="/nutrition" element={<Nutrition />} />
                <Route path="/nutrition/:iid" element={<Nutrition />} />
              </Routes>
            </HashRouter>
          </CurrentUser>
        </Provider>
      </ColorModeProvider>
    </ChakraProvider>
  );
}

export default App;
