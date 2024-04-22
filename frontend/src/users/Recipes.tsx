import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { UserState } from "../store";
import * as userClient from "./client";
import {
  Center,
  Divider,
  Flex,
  Heading,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import RecipeCard from "../recipe/RecipeCard";

function Recipes() {
  const { userId } = useParams();
  const { currentUser } = useSelector((state: UserState) => state.users);
  const [userData, setUserData] = React.useState<User | null>(null);
  const maxW = useBreakpointValue({ base: "100%", md: "90%" });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setUserData(currentUser);
      } else {
        const userData = await userClient.otherProfile(userId);
        setUserData(userData);
      }
    };

    fetchUserData();
  }, [userId, currentUser]);

  return (
    userData && (
      <>
        <Center p={5}>
          <Heading>{userData.username}'s Recipes</Heading>
        </Center>
        <Divider mb={5}/>
        <Flex justifyContent={'start'} wrap='wrap' ml={5}>
          {userData.authoredRecipes &&
            userData.authoredRecipes.map((recipe) => (
              <RecipeCard recipe={recipe} />
            ))}
        </Flex>
        <Divider mt={5}/>
        <Center p={5}>
          <Heading>{userData.username}'s Liked Recipes</Heading>
        </Center>
        <Divider mb={5}/>
        <Flex justifyContent={'start'} wrap='wrap' ml={5}>
          {userData.likedRecipes &&
            userData.likedRecipes.map((recipe) => (
              <RecipeCard recipe={recipe} />
            ))}
        </Flex>
      </>
    )
  );
}

export default Recipes;
