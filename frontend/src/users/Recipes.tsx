import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { UserState } from "../store";
import * as userClient from "./client";
import {
  Center,
  Divider,
  Flex,
  Heading,
  useBreakpointValue,
} from "@chakra-ui/react";
import RecipeCard from "../recipe/RecipeCard";
import { nanoid } from "@reduxjs/toolkit";

function Recipes({showLiked = true} : {showLiked?: boolean}) {
  const { userId } = useParams();
  const { currentUser } = useSelector((state: UserState) => state.users);
  const [userData, setUserData] = React.useState<User | null>(null);
  const justifyVal = useBreakpointValue({ base: "center", md: "start" });

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

  const sortRecipesByLikes = (a: Recipe, b: Recipe) => {
    if (!a.likes) {
        if (!b.likes) return 0;
        return 1;
    }
    if (!b.likes) {
        if (!a.likes) return 0;
        return -1;
    }
    return b.likes - a.likes;
  }

  const sortedAuthoredRecipes = [...(userData?.authoredRecipes ?? [])].sort(sortRecipesByLikes);
  const sortedLikedRecipes = [...(userData?.likedRecipes ?? [])].sort(sortRecipesByLikes);

  const userAuthoredRecipes = (
    <>
        <Center p={5}>
            <Heading>Recipes</Heading>
        </Center>
        <Divider mb={5}/>
        <Flex justifyContent={justifyVal} wrap='wrap' ml={3} mr={3}>
            {sortedAuthoredRecipes.map((recipe) => (
                <RecipeCard recipe={recipe} key={recipe._id ?? nanoid()} />
            ))}
        </Flex>
        <Divider mt={5}/>
    </>
  )

  const userLikedRecipes = (
    <>
    <Flex justifyContent={'start'} wrap='wrap' ml={5} mb={10}>
        {sortedLikedRecipes.map((recipe) => (
            <RecipeCard recipe={recipe} key={recipe._id ?? nanoid()} />
        ))}
    </Flex>
    </> 
  )

  return (
    userData && (
      <>
        {(userData.authoredRecipes?.length ?? 0) > 0 && userAuthoredRecipes}
        {(!showLiked && (userData.authoredRecipes?.length ?? 0) === 0) &&
            <>
            <Center>
                <Heading p={5} >Recipes</Heading>
            </Center>

            <Divider mb={10} />
            <Center>
                {userData.username} has not published any recipes
            </Center>
            </>
        }
        {showLiked &&
            <>
            <Center p={5}>
                <Heading>Liked Recipes</Heading>
            </Center>
            <Divider mb={5}/>
            {(userData.likedRecipes?.length ?? 0) > 0 
                ? userLikedRecipes
                : <Center mb={10}>{userData.username} has not liked any recipes yet</Center>}
            </>
        }

      </>
    )
  );
}

export default Recipes;
