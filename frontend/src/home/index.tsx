import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { UserState } from "../store";
import * as userClient from "../users/client";
import * as recipeClient from "../recipe/client";
import {
  Center,
  Divider,
  Flex,
  Heading,
  Spinner,
  Text,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import ChefCard from "../users/ChefCard";
import RecipeCard from "../recipe/RecipeCard";

function Home() {
  const { currentUser } = useSelector((state: UserState) => state.users);

  const [newRecipes, setNewRecipes] = React.useState<Recipe[]>([]);
  const [popularRecipes, setPopularRecipes] = React.useState<Recipe[]>([]);
  const [chefs, setChefs] = React.useState<User[]>([]);
  const textLocation = useBreakpointValue({
    base: "center" as "center",
    lg: "start" as "start",
  });
  const itemShowCount = useBreakpointValue({
    base: 4,
    sm: 6,
    md: 6,
    xl: 8,
  }) as number;
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        let recipes, chefs, newRecipes;

        if (currentUser) {
          [newRecipes, recipes] = await Promise.all([
            recipeClient.newRecipes("dsc"),
            userClient.popularFollowedRecipes("dsc"),
          ]);
          chefs = currentUser.followedChefs ?? [];
        } else {
          [newRecipes, recipes, chefs] = await Promise.all([
            recipeClient.newRecipes("dsc"),
            recipeClient.popularRecipes("dsc"),
            userClient.popularChefs("followers", "dsc"),
          ]);
        }

        setNewRecipes(newRecipes);
        setPopularRecipes(recipes);
        setChefs(chefs);
      } catch (error) {
        console.error("Error fetching recipes", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const headerSection = (
    <VStack>
      <Heading size="xl" mt={5}>
        RecipeBook
      </Heading>
      <Text fontSize="large" textAlign="center" mx={5}>
        {currentUser
          ? `Welcome back, ${currentUser.firstName ?? currentUser.username}`
          : "Discover, share, and create your favorite culinary masterpieces"}
      </Text>
    </VStack>
  );

  const newRecipesSection = (
    <>
      <Divider my={5} />
      <Heading ms={5} size="lg" textAlign={textLocation}>
        New Recipes
      </Heading>
      <Text textAlign={textLocation} ms={7} mt={1} fontSize="medium">
        Find a fresh addition to your recipe collection!
      </Text>
      <Divider my={5} />
      {newRecipes.length === 0 && !isLoading && (
        <Center mt={5}>No new recipes found</Center>
      )}
      <Flex wrap="wrap" mt={5} ml={5} mb={5} justify={textLocation}>
        {newRecipes
          .map((recipe) => <RecipeCard recipe={recipe} key={recipe._id} />)
          .splice(0, itemShowCount)}
      </Flex>
      {isLoading && (
        <Center>
          <Spinner mb={5} size="xl" />
        </Center>
      )}
    </>
  );

  const popularRecipesSection = (
    <>
      <Divider my={5} />
      <Heading ms={5} size="lg" textAlign={textLocation}>
        Popular Recipes{currentUser ? " For You" : ""}
      </Heading>
      <Text textAlign={textLocation} ms={7} mt={1} fontSize="medium">
        {currentUser
          ? "Popular dishes from creators you love"
          : "Dishes celebrated for their proven excellence"}
      </Text>
      <Divider my={5} />
      {popularRecipes.length === 0 && !isLoading && (
        <Center mt={5}>
          {currentUser
            ? "Followed chef dishes appear here"
            : "No popular recipes found"}
        </Center>
      )}
      <Flex wrap="wrap" mt={5} ml={5} mb={5} justify={textLocation}>
        {popularRecipes
          .map((recipe) => <RecipeCard recipe={recipe} key={recipe._id} />)
          .splice(0, itemShowCount)}
      </Flex>
      {isLoading && (
        <Center>
          <Spinner mb={5} size="xl" />
        </Center>
      )}
    </>
  );

  const popularChefsSection = (
    <>
      <Divider my={5} />
      <Heading ms={5} size="lg" textAlign={textLocation}>
        {currentUser ? "Popular Followed" : "Popular"} Chefs
      </Heading>
      <Text textAlign={textLocation} ms={7} mt={1}>
        A spotlight on{currentUser ? " your " : " "}top gastronomic artisans
      </Text>
      <Divider my={5} />
      {chefs.length === 0 && !isLoading && (
        <Center mt={5}>
          {currentUser
            ? "You haven't followed any chefs yet"
            : "No popular chefs found"}
        </Center>
      )}
      <Flex wrap="wrap" mt={5} ml={5} mb={5} justify={textLocation}>
        {chefs
          .map((chef) => <ChefCard chef={chef} key={chef._id} />)
          .splice(0, itemShowCount)}
      </Flex>
      {isLoading && (
        <Center>
          <Spinner mb={5} size="xl" />
        </Center>
      )}
    </>
  );

  return (
    <div>
      {headerSection}
      {newRecipesSection}
      {popularRecipesSection}
      {popularChefsSection}
    </div>
  );
}

export default Home;
