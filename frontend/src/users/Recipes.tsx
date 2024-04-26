import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { UserState } from "../store";
import * as userClient from "./client";
import * as recipeClient from "../recipe/client";
import {
  Button,
  Center,
  Flex,
  HStack,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import RecipeCard from "../recipe/RecipeCard";

function Recipes() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: UserState) => state.users);
  const headerMargin = useBreakpointValue({ base: 4, md: -5 });
  const tabLocation = useBreakpointValue({ base: "center", md: "start" });
  const tabMargin = useBreakpointValue({ base: 0, md: 5 });

  const [popularRecipes, setPopularRecipes] = React.useState<Recipe[] | null>(
    null,
  );
  const [popularFollowedRecipes, setPopularFollowedRecipes] = React.useState<
    Recipe[] | null
  >(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const [searchParams, setSearchParams] = React.useState<{
    type: string;
    dir: string;
  }>({ type: "top", dir: "dsc" });

  useEffect(() => {
    setIsLoading(true);
    const fetchPopularRecipes = async () => {
      const locationSearchParams = new URLSearchParams(location.search);

      const searchParams = {
        type: locationSearchParams.get("type") ?? "top",
        dir: locationSearchParams.get("dir") ?? "dsc",
      };
      if (
        !locationSearchParams.get("dir") ||
        !locationSearchParams.get("type")
      ) {
        navigate(
          `/browse/recipes?type=${searchParams.type}&dir=${searchParams.dir}`,
        );
        return;
      }
      setSearchParams(searchParams);
      try {
        if (currentUser && searchParams.type === "followed") {
          const followed = await userClient.popularFollowedRecipes(
            searchParams.dir,
          );
          setPopularFollowedRecipes(followed);
        } else if (searchParams.type === "top") {
          const popular = await recipeClient.popularRecipes(searchParams.dir);
          setPopularRecipes(popular);
        }
      } catch (error) {
        console.error("Error fetching popular recipes", error);
        return;
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularRecipes();
  }, [location, currentUser, navigate]);

  const searchNav = (params: { type: string; dir: string }) => {
    navigate(`/browse/recipes?type=${params.type}&dir=${params.dir}`);
  };

  const headerText = searchParams.type === "top" ? "Top Recipes" : "For You";

  const noPopularRecipesText = "Popular Recipes appear here";

  const noFollowedChefRecipesText =
    "Popular recipes from followed Chefs appear here";

  const changeSort = (
    <HStack mt={5} gap={0} justifyContent={tabLocation}>
      <Menu>
        <MenuButton
          as={Button}
          mt={0}
          pt={0}
          mr={0}
          ml={tabMargin}
          width="200px"
          isDisabled={isLoading}
          textAlign={"start"}
          rightIcon={<ChevronDownIcon boxSize={6} />}
          variant="outline"
        >
          Total Likes
        </MenuButton>
        <MenuList>
          <MenuItem>Total Likes</MenuItem>
        </MenuList>
      </Menu>
      <IconButton
        aria-label="Change sort direction"
        mt={0}
        pt={0}
        ml={0}
        variant="ghost"
        isLoading={isLoading}
        onClick={() =>
          searchNav({
            ...searchParams,
            dir: searchParams.dir === "dsc" ? "asc" : "dsc",
          })
        }
        icon={
          searchParams.dir === "dsc" ? (
            <ChevronDownIcon boxSize={6} />
          ) : (
            <ChevronUpIcon boxSize={6} />
          )
        }
      />
    </HStack>
  );

  const popularRecipesElement = (
    <>
      <Center pt={5} px={5} pb={-10} mb={headerMargin}>
        <Heading>{headerText}</Heading>
      </Center>
      <Tabs
        variant="enclosed"
        size="md"
        pt={0}
        mt={0}
        index={searchParams.type === "top" ? 0 : 1}
      >
        <TabList justifyContent={tabLocation}>
          <Tab
            ml={tabMargin}
            onClick={() => searchNav({ ...searchParams, type: "top" })}
          >
            Top Recipes
          </Tab>
          {currentUser && (
            <Tab
              onClick={() => searchNav({ ...searchParams, type: "followed" })}
            >
              Recipes For You
            </Tab>
          )}
        </TabList>
        <TabPanels>
          <TabPanel>
            {changeSort}
            {(popularRecipes?.length ?? 0) > 0 ? (
              <Flex
                justifyContent={tabLocation}
                wrap="wrap"
                mt={5}
                ml={5}
                mb={10}
              >
                {popularRecipes?.map((recipe) => (
                  <RecipeCard recipe={recipe} key={recipe._id ?? "unknown"} />
                ))}
              </Flex>
            ) : (
              <Center mt={5}>{noPopularRecipesText}</Center>
            )}
          </TabPanel>
          {currentUser && (
            <TabPanel>
              {changeSort}
              {popularFollowedRecipes && popularFollowedRecipes.length > 0 ? (
                <Flex
                  justifyContent={tabLocation}
                  wrap="wrap"
                  mt={5}
                  ml={5}
                  mb={10}
                >
                  {popularFollowedRecipes.map((recipe) => (
                    <RecipeCard recipe={recipe} key={recipe._id ?? "unknown"} />
                  ))}
                </Flex>
              ) : (
                <Center mt={5}>{noFollowedChefRecipesText}</Center>
              )}
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </>
  );

  return popularRecipesElement;
}

export default Recipes;
