import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserState } from "../store";
import {
  Button,
  Center,
  Container,
  Divider,
  Grid,
  GridItem,
  HStack,
  Heading,
  IconButton,
  Input,
  InputGroup,
  ListItem,
  OrderedList,
  Textarea,
  VStack,
  useBreakpointValue,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as recipeClient from "./client";
import RecipeMakerIngredients from "./RecipeMakerIngredients";
import { nanoid } from "@reduxjs/toolkit";
import { setCurrentUser } from "../users/reducer";

const PLACEHOLDER_INGREDIENT: RecipeIngredient = {
  _id: nanoid(),
  name: "Ingredient",
  quantity: 1,
  unit: "unit",
};

const PLACEHOLDER_STEP: RecipeStep = {
  _id: nanoid(),
  stepTitle: "Prepare the ingredients",
  stepDescription: "Get all the ingredients ready to go",
};

const PLACEHOLDER_NOTE: RecipeNote = {
  _id: nanoid(),
  noteText: "Make sure to be careful with the knife!",
};

function RecipeMaker() {
  const location = useLocation();
  const { recipeId } = useParams();
  const { currentUser } = useSelector((state: UserState) => state.users);
  const gridColor = useColorModeValue("gray.100", "gray.700");
  const deleteColor = useColorModeValue("red.400", "red.500");
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const gridWidth = useBreakpointValue({ base: "100%", md: "90%" });
  const [recipe, setRecipe] = useState<Recipe>({
    name: "Recipe Name",
    description: "Recipe description",
    ingredients: [PLACEHOLDER_INGREDIENT],
    steps: [PLACEHOLDER_STEP],
    notes: [PLACEHOLDER_NOTE],
  });

  const isEditing =
    recipeId &&
    recipe.author?._id === currentUser?._id &&
    location.pathname.includes("edit");

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!recipeId) {
        return;
      }
      const recipe = await recipeClient.get(recipeId);
      if (location.pathname.includes("clone")) {
        recipe.name = `Copy of ${recipe.name}`;
      }
      setRecipe(recipe);
    };

    fetchRecipe();
  }, [recipeId, location]);

  const publishRecipe = async () => {
    setIsPublishing(true);
    try {
      if (isEditing) {
        const newUser = await recipeClient.update(recipeId, recipe);
        toast({
          title: "Recipe Updated",
          description: "Your changes has been published",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        dispatch(setCurrentUser(newUser));
        navigate(`/recipe/${recipeId}`);
      } else {
        const serverData = await recipeClient.create(recipe);
        toast({
          title: "Recipe Published",
          description: "Your recipe has been published",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        dispatch(setCurrentUser(serverData.user));
        navigate(`/recipe/${serverData.recipe._id}`);
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "There was an error publishing your recipe",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setIsPublishing(false);
  };

  const deleteRecipe = async () => {
    if (!isEditing) {
      return;
    }

    try {
      if (!recipe || !recipe._id) {
        throw new Error("No recipe found");
      }
      const newUser = await recipeClient.deleteRecipe(recipe._id);
      toast({
        title: "Recipe Deleted",
        description: "Your recipe has been deleted",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      dispatch(setCurrentUser(newUser));
      navigate(-1);
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "There was an error deleting your recipe",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const notChefPage = (
    <Center>
      <Heading mt={5} size="lg">
        Please login as a Chef to acess this page
      </Heading>
    </Center>
  );

  const chefPage = (
    <Center>
      <VStack width="100%">
        <Heading as="h1" py={5} mx={5}>
          {isEditing ? "Edit" : "Create"} Recipe
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
            <GridItem p="2" bg={gridColor} area={"name"} rounded="md">
              <VStack>
                <InputGroup size="lg" width="100%">
                  <Input
                    value={recipe.name}
                    placeholder="Delicious French Toast"
                    title="The name of the recipe"
                    onChange={(e) =>
                      setRecipe({ ...recipe, name: e.target.value })
                    }
                  />
                </InputGroup>
                description
                <Textarea
                  overflow="hidden"
                  resize="vertical"
                  value={recipe.description}
                  size="sm"
                  title="A text description of the recipe"
                  placeholder="A delicious breakfast treat for the whole family!"
                  onChange={(e) =>
                    setRecipe({ ...recipe, description: e.target.value })
                  }
                />
              </VStack>
            </GridItem>
            <GridItem
              p="2"
              pb="6"
              bg={gridColor}
              area={"ingredients"}
              rounded="md"
            >
              <VStack>
                <Heading size="md">
                  Ingredients
                  <IconButton
                    variant="ghost"
                    onClick={() => {
                      const newIngredients = [...(recipe.ingredients ?? [])];
                      newIngredients.push({
                        ...PLACEHOLDER_INGREDIENT,
                        _id: nanoid(),
                      });
                      setRecipe({
                        ...recipe,
                        ingredients: newIngredients,
                      });
                    }}
                    aria-label="Add Ingredient"
                    icon={<AddIcon />}
                  />
                </Heading>
                <Divider />
                <RecipeMakerIngredients recipe={recipe} setRecipe={setRecipe} />
              </VStack>
            </GridItem>
            <GridItem p="2" pb="6" bg={gridColor} area={"steps"} rounded="md">
              <VStack>
                <Heading size="md">
                  Steps
                  <IconButton
                    variant="ghost"
                    onClick={() => {
                      const newSteps = [...(recipe.steps ?? [])];
                      newSteps.push({ ...PLACEHOLDER_STEP, _id: nanoid() });
                      setRecipe({
                        ...recipe,
                        steps: newSteps,
                      });
                    }}
                    aria-label="Add Step"
                    icon={<AddIcon />}
                  />
                </Heading>
                <Divider />
                <OrderedList width="90%">
                  {recipe.steps?.map((step, idx) => (
                    <ListItem key={idx} mt={4}>
                      <HStack>
                        <Input
                          value={step.stepTitle}
                          placeholder="Gather and prepare ingredients"
                          onChange={(e) => {
                            const newSteps = [...(recipe.steps ?? [])];
                            setRecipe({
                              ...recipe,
                              steps: newSteps.map((s) =>
                                s._id === step._id
                                  ? { ...s, stepTitle: e.target.value }
                                  : s,
                              ),
                            });
                          }}
                        />
                        <IconButton
                          onClick={() => {
                            const newSteps = [...(recipe.steps ?? [])];
                            setRecipe({
                              ...recipe,
                              steps: newSteps.filter(
                                (s) => s._id !== step._id,
                              ),
                            });
                          }}
                          aria-label="Remove Step"
                          icon={<DeleteIcon />}
                        />
                      </HStack>
                      <Textarea
                        mt={1}
                        value={step.stepDescription}
                        placeholder="Cut vegetables, measure qunatities, etc."
                        resize="vertical"
                        overflow="hidden"
                        onChange={(e) => {
                          const newSteps = [...(recipe.steps ?? [])];
                          setRecipe({
                            ...recipe,
                            steps: newSteps.map((s) =>
                              s._id === step._id
                                ? { ...s, stepDescription: e.target.value }
                                : s,
                            ),
                          });
                        }}
                      />
                    </ListItem>
                  ))}
                </OrderedList>
              </VStack>
            </GridItem>
            <GridItem p="2" pb="6" bg={gridColor} area={"notes"} rounded="md">
              <VStack>
                <Heading size="md">
                  Notes
                  <IconButton
                    variant="ghost"
                    onClick={() => {
                      const newNotes = [...(recipe.notes ?? [])];
                      newNotes.push({ ...PLACEHOLDER_NOTE, _id: nanoid() });
                      setRecipe({
                        ...recipe,
                        notes: newNotes,
                      });
                    }}
                    aria-label="Add Step"
                    icon={<AddIcon />}
                  />
                </Heading>
                <Divider />
                <OrderedList width="90%">
                  {recipe.notes?.map((note, index) => (
                    <ListItem key={index} mt={4}>
                      <HStack align="flex-start">
                        <Textarea
                          overflow="hidden"
                          value={note.noteText}
                          placeholder="Make sure to use fresh ingredients"
                          minH={"40px"}
                          onChange={(e) => {
                            setRecipe({
                              ...recipe,
                              notes: [...(recipe.notes ?? [])].map((n) =>
                                n._id === note._id
                                  ? { ...n, noteText: e.target.value }
                                  : n,
                              ),
                            });
                          }}
                        />
                        <IconButton
                          onClick={() => {
                            setRecipe({
                              ...recipe,
                              notes: [...(recipe.notes ?? [])].filter(
                                (n) => n._id !== note._id,
                              ),
                            });
                          }}
                          aria-label="Remove Step"
                          icon={<DeleteIcon />}
                        />
                      </HStack>
                    </ListItem>
                  ))}
                </OrderedList>
              </VStack>
            </GridItem>
            <GridItem p="2" area={"buttons"} textAlign="end">
              <Button onClick={() => navigate(-1)} mr={2} size="lg">
                Cancel
              </Button>
              {recipeId &&
                recipe.author?._id === currentUser?._id &&
                location.pathname.includes("edit") && (
                  <Button
                    onClick={deleteRecipe}
                    bg={deleteColor}
                    size="lg"
                    mr={2}
                  >
                    Delete
                  </Button>
                )}
              <Button
                isLoading={isPublishing}
                bg="blue.500"
                size="lg"
                loadingText="Publishing..."
                onClick={publishRecipe}
              >
                Publish {isEditing ? "Changes" : "Recipe"}
              </Button>
            </GridItem>
          </Grid>
        </Container>
      </VStack>
    </Center>
  );

  return <>{currentUser?.type === "CHEF" ? chefPage : notChefPage}</>;
}

export default RecipeMaker;
