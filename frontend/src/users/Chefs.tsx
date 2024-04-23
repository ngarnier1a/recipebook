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
import ChefCard from "./ChefCard";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

function Chefs() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: UserState) => state.users);
  const headerMargin = useBreakpointValue({ base: 4, md: -5 });
  const tabLocation = useBreakpointValue({ base: "center", md: "start" });
  const tabMargin = useBreakpointValue({ base: 0, md: 5 });
  const tabSize = useBreakpointValue({ base: "md", md: "lg" });

  // likes | followers | recipes
  const [sortBy, setSortBy] = React.useState<string>("followers");
  const [sortDir, setSortDir] = React.useState<string>("dsc");
  const [popularChefs, setPopularChefs] = React.useState<User[] | null>(null);
  const [tabSelected, setTabSelected] = React.useState<string>("popular");
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchPopularChefs = async () => {
      const searchParams = new URLSearchParams(location.search);
      const sortByParam = searchParams.get("by") ?? "followers";
      const sortDirParam = searchParams.get("dir") ?? "dsc";
      if (!searchParams.get("by") || !searchParams.get("dir")) {
        console.log(`navigating to /browse/chefs?by=${sortByParam}&dir=${sortDirParam}`);
        navigate(`/browse/chefs?by=${sortByParam}&dir=${sortDirParam}`);
        return;
      }
      setSortDir(sortDirParam);
      setSortBy(sortByParam);
      const popularChefs = await userClient.popularChefs(sortByParam, sortDirParam);
      setPopularChefs(popularChefs);
      setIsLoading(false);
    };

    fetchPopularChefs();
  }, [location, navigate]);

  const sortFunctions: Record<string, (a: User, b: User) => number> = {
    likes: (a, b) => {
      const aLikes =
        a.authoredRecipes?.reduce(
          (acc, recipe) => acc + (recipe.likes ?? 0),
          0
        ) ?? -1;
      const bLikes =
        b.authoredRecipes?.reduce(
          (acc, recipe) => acc + (recipe.likes ?? 0),
          0
        ) ?? -1;
      return (sortDir === "dsc" ? 1 : -1) * (bLikes - aLikes);
    },
    followers: (a, b) => {
      return (
        (sortDir === "dsc" ? 1 : -1) *
        ((b.numFollowers ?? -1) - (a.numFollowers ?? -1))
      );
    },
    recipes: (a, b) => {
      return (
        (sortDir === "dsc" ? 1 : -1) *
        ((b.authoredRecipes?.length ?? -1) - (a.authoredRecipes?.length ?? -1))
      );
    },
  };

  const headerText =
    tabSelected === "popular" ? "Popular Chefs" : "Followed Chefs";

  const sortedFollowedChefs = [...(currentUser?.followedChefs ?? [])].sort(
    sortFunctions[sortBy]
  );

  const noPopularChefsText = "Popular Chefs appear here";

  const noFollowedChefsText = "Followed Chefs appear here";

  const changeSort = (
    <HStack mt={5} gap={0} justifyContent={tabLocation}>
        <Select
            mt={0}
            pt={0}
            mr={0}
            ml={tabMargin}
            width='200px'
            value={sortBy ?? 'followers'}
            isDisabled={isLoading}
            onChange={(e) => navigate(`/browse/chefs?by=${e.target.value}&dir=${sortDir}`)}
        >
            <option value='followers'>Followers</option>
            <option value='recipes'>Total Recipes</option>
            <option value='likes'>Total Likes</option>
        </Select>
        <IconButton
            aria-label="Change sort direction"
            mt={0}
            pt={0}
            ml={0}
            variant='ghost'
            isLoading={isLoading}
            onClick={() => navigate(`/browse/chefs?by=${sortBy}&dir=${sortDir === 'dsc' ? 'asc' : 'dsc'}`)}
            icon={sortDir === 'dsc' ? <ChevronDownIcon boxSize={6} /> : <ChevronUpIcon boxSize={6} />}
        />
    </HStack>
  )

  const userFollowedChefs = (
    <>
      <Center pt={5} px={5} pb={-10} mb={headerMargin}>
        <Heading>{headerText}</Heading>
      </Center>
      <Tabs variant="enclosed" size={tabSize} pt={0} mt={0}>
        <TabList justifyContent={tabLocation}>
          <Tab ml={tabMargin} onClick={() => setTabSelected("popular")}>
            Popular
          </Tab>
          {currentUser && <Tab onClick={() => setTabSelected("following")}>Followed</Tab>}
        </TabList>
        <TabPanels>
          <TabPanel>
            {changeSort}
            {(popularChefs?.length ?? 0) > 0 ? (
              <Flex justifyContent={tabLocation} wrap="wrap" mt={5} ml={5} mb={10}>
                {popularChefs?.map((chef) => (
                  <ChefCard chef={chef} key={chef._id ?? "unknown"} />
                ))}
              </Flex>
            ) : (
              <Center mt={5}>
                {noPopularChefsText}
              </Center>
            )}
          </TabPanel>
          {currentUser && (
            <TabPanel>
                {changeSort}
              {sortedFollowedChefs.length > 0 ? (
                <Flex justifyContent={tabLocation} wrap="wrap" mt={5} ml={5} mb={10}>
                  {sortedFollowedChefs.map((chef) => (
                    <ChefCard chef={chef} key={chef._id ?? "unknown"} />
                  ))}
                </Flex>
              ) : (
                <Center mt={5}>
                  {noFollowedChefsText}
                </Center>
              )}
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </>
  );

  return userFollowedChefs;
}

export default Chefs;
