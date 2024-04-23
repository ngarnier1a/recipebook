import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { UserState } from "../store";
import * as userClient from "./client";
import {
  Center,
  Divider,
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useBreakpointValue,
} from "@chakra-ui/react";
import ChefCard from "./ChefCard";
import { tab } from "@testing-library/user-event/dist/tab";

function Chefs() {
  const location = useLocation();
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

  useEffect(() => {
    const fetchPopularChefs = async () => {
      const searchParams = new URLSearchParams(location.search);
      const sortByParam = searchParams.get("by") ?? "followers";
      const sortDir = searchParams.get("dir") ?? "dsc";
      setSortDir(sortDir);
      setSortBy(sortByParam);
      const popularChefs = await userClient.popularChefs(sortByParam);
      if (sortDir === "asc") {
        // default sort is dsc
        popularChefs.reverse();
      }
      setPopularChefs(popularChefs);
    };

    fetchPopularChefs();
  }, [location]);

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

  const noFollowedChefsText = "Follow Chefs to see them here";

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
            {(popularChefs?.length ?? 0) > 0 ? (
              <Flex justifyContent="center" wrap="wrap" ml={5} mb={10}>
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
              {sortedFollowedChefs.length > 0 ? (
                <Flex justifyContent="center" wrap="wrap" ml={5} mb={10}>
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
