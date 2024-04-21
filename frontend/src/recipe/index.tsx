import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as recipeClient from "./client";
import { Center, VStack, Heading, Container, Grid, GridItem, Text, OrderedList, ListItem, Button, useColorModeValue, useBreakpointValue, Link, Icon, useToast } from "@chakra-ui/react";
import RecipeIngredients from "./RecipeIngredients";
import { useDispatch, useSelector } from "react-redux";
import { UserState } from "../store";
import { FaHeart } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa6";
import { setCurrentUser } from "../users/reducer";



function Recipe() {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = React.useState<Recipe | null>(null);
  const [isLiking, setIsLiking] = React.useState<boolean>(false);
  const { currentUser } = useSelector((state: UserState) => state.users);
  const gridColor = useColorModeValue("gray.100", "gray.700");
  const likeColor = useColorModeValue("red.400", "red.500");
  const gridWidth = useBreakpointValue({ base: "100%", md: "90%" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!recipeId) {
        return;
      }
      const recipe = await recipeClient.get(recipeId);
      setRecipe(recipe);
    };

    fetchRecipe();
  }, [recipeId]);

  const likeRecipe = async (setLikedStatus: boolean) => {
    setIsLiking(true);
    if (!recipeId || !currentUser || !recipe) {
      console.log(`Error liking recipe: recipeId: ${recipeId}, currentUser: ${currentUser}, recipe: ${recipe}`)
      setIsLiking(false);
      return;
    }

    try {
      const newLikedRecipes = await recipeClient.setLikedStatus(recipeId, setLikedStatus);
      dispatch(setCurrentUser(
        { ...currentUser, likedRecipes: newLikedRecipes }
      ));
      setRecipe({ ...recipe, likes: setLikedStatus ? (recipe.likes ?? 0) + 1 : (recipe.likes ?? 0) - 1 });
    } catch (error) {
      toast({
        title: "Error liking recipe",
        description: "Please try again",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Error liking recipe", error);
    }
    setIsLiking(false);
  };

  const recipeLiked = (currentUser?.likedRecipes?.findIndex((likedRecipe) => likedRecipe._id === recipeId) ?? -1) > -1;

  return ( recipe &&
    <Center>
      <VStack width="100%">
        <Heading
          size='lg'
          pt={5}
          mx={5}
          onClick={() =>
            navigate(recipe.author?._id === currentUser?._id
              ? '/user/profile'
              : `/user/${recipe.author?._id}/profile`
            )
          }
        >
          <Link>
            {recipe.author?._id === currentUser?._id ? 'Your' : `${recipe.author?.username}'s`}
          </Link>
        </Heading>
        <Heading size='xl' pb={1} mx={5}>
          {recipe.name}
        </Heading>
        <Container maxW={gridWidth} px={2}>
          <Grid
            templateAreas={`"name name"
                          "ingredients steps"
                          "notes steps"
                          "buttons buttons"`}
            gridTemplateColumns={"50% 50%"}
            gap="2"
            rounded="lg"
          >
            <GridItem p="2" bg={gridColor} area={"name"}>
              <Text textAlign='left' fontSize='md'>
                {recipe.description}
              </Text>
            </GridItem>
            <GridItem p="2" pb="6" bg={gridColor} area={"ingredients"}>
              <VStack>
                <Heading size="md">
                  Ingredients
                </Heading>
                <RecipeIngredients recipe={recipe} />
              </VStack>
            </GridItem>
            <GridItem p="2" bg={gridColor} area={"steps"}>
              <VStack>
                <Heading size="md">
                  Steps
                </Heading>
                <OrderedList width="90%">
                  {recipe.steps?.map((step, index) => (
                    <ListItem key={index} mt={4}>
                      <Text fontWeight='bold'>
                        {step.stepTitle}
                      </Text>
                      <Text>
                        {step.stepDescription}
                      </Text>
                    </ListItem>
                  ))}
                </OrderedList>
              </VStack>
            </GridItem>
            <GridItem p="2" pb="6" bg={gridColor} area={"notes"}>
              <VStack>
                <Heading size="md">
                  Notes
                </Heading>
                <OrderedList width="90%">
                  {recipe.notes?.map((note, index) => (
                    <ListItem key={index} mt={2}>
                      {note.noteText}
                    </ListItem>
                  ))}
                </OrderedList>
              </VStack>
            </GridItem>
            <GridItem p="2" area={"buttons"} textAlign="end">
              {currentUser?.type === "CHEF" && currentUser._id === recipe.author?._id &&
                <Button onClick={() => navigate(`/recipe/${recipe._id}/edit`)} size="lg" mr={2}>
                  Edit
                </Button>
              }
              {currentUser?.type === "CHEF" && 
                <Button onClick={() => navigate(`/recipe/${recipe._id}/clone`)} size="lg" mr={2}>
                  Clone
                </Button>
              }
              {
                currentUser && 
                <Button
                  bg={recipeLiked ? likeColor : gridColor }
                  size="lg"
                  variant={recipeLiked ? "solid" : "ghost"}
                  isDisabled={isLiking}
                  p={5}
                  minW={20}
                  color={recipeLiked ? "white" : "black"}
                  onClick={() => likeRecipe(!recipeLiked)}
                >
                  {recipe.likes}
                  <Icon as={recipeLiked ? FaHeart : FaRegHeart } ml={2} />
                </Button>
              }
              { !currentUser &&
                <>Sign In To Like</>
              }
            </GridItem>
          </Grid>
        </Container>
      </VStack>
    </Center>
  );
}

export default Recipe;