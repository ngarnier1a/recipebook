import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { UserState } from "../store";
import * as userClient from "./client";
import {
  Center,
  Flex,
  HStack,
  Heading,
  IconButton,
  Select,
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
  const tabSize = useBreakpointValue({ base: "md", md: "md" });

  const [sortDir, setSortDir] = React.useState<string>("dsc");
  const [popularRecipes, setPopularRecipes] = React.useState<Recipe[] | null>(null);
  const [popularFollowedRecipes, setPopularFollowedRecipes] = React.useState<Recipe[] | null>(null);
  const [tabSelected, setTabSelected] = React.useState<string>("top");
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchPopularRecipes = async () => {
      const searchParams = new URLSearchParams(location.search);
      const sortDirParam = searchParams.get("dir") ?? "dsc";
      if (!searchParams.get("dir")) {
        navigate(`/browse/recipes?dir=${sortDirParam}`);
        return;
      }
      setSortDir(sortDirParam);
      try {
        const [followed, popular] = await Promise.all([
            userClient.popularFollowedRecipes(sortDirParam),
            userClient.popularRecipes(sortDirParam),
        ]);
        setPopularRecipes(popular);
        setPopularFollowedRecipes(followed);
      } catch (error) {
        console.error("Error fetching popular recipes", error);
        return;
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularRecipes();
  }, [location, navigate]);

  const headerText =
    tabSelected === "top" ? "Top Recipes" : "For You";

  const noPopularRecipesText = "Popular Recipes appear here";

  const noFollowedChefRecipesText = "Popular recipes from followed Chefs appear here";

  const changeSort = (
    <HStack mt={5} gap={0} justifyContent={tabLocation}>
        <Select
            mt={0}
            pt={0}
            mr={0}
            ml={tabMargin}
            width='200px'
            value={'likes'}
            isDisabled={isLoading}
            isReadOnly
        >
            <option value='likes'>Total Likes</option>
        </Select>
        <IconButton
            aria-label="Change sort direction"
            mt={0}
            pt={0}
            ml={0}
            variant='ghost'
            isLoading={isLoading}
            onClick={() => navigate(`/browse/recipes?dir=${sortDir === 'dsc' ? 'asc' : 'dsc'}`)}
            icon={sortDir === 'dsc' ? <ChevronDownIcon boxSize={6} /> : <ChevronUpIcon boxSize={6} />}
        />
    </HStack>
  )

  const popularRecipesElement = (
    <>
      <Center pt={5} px={5} pb={-10} mb={headerMargin}>
        <Heading>{headerText}</Heading>
      </Center>
      <Tabs variant="enclosed" size={tabSize} pt={0} mt={0}>
        <TabList justifyContent={tabLocation}>
          <Tab ml={tabMargin} onClick={() => setTabSelected("top")}>
            Top Recipes
          </Tab>
          {currentUser && <Tab onClick={() => setTabSelected("followed")}>Recipes For You</Tab>}
        </TabList>
        <TabPanels>
          <TabPanel>
            {changeSort}
            {(popularRecipes?.length ?? 0) > 0 ? (
              <Flex justifyContent={tabLocation} wrap="wrap" mt={5} ml={5} mb={10}>
                {popularRecipes?.map((recipe) => (
                  <RecipeCard recipe={recipe} key={recipe._id ?? "unknown"} />
                ))}
              </Flex>
            ) : (
              <Center mt={5}>
                {noPopularRecipesText}
              </Center>
            )}
          </TabPanel>
          {currentUser && (
            <TabPanel>
                {changeSort}
              {popularFollowedRecipes && popularFollowedRecipes.length > 0 ? (
                <Flex justifyContent={tabLocation} wrap="wrap" mt={5} ml={5} mb={10}>
                  {popularFollowedRecipes.map((recipe) => (
                    <RecipeCard recipe={recipe} key={recipe._id ?? "unknown"} />
                  ))}
                </Flex>
              ) : (
                <Center mt={5}>
                  {noFollowedChefRecipesText}
                </Center>
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
