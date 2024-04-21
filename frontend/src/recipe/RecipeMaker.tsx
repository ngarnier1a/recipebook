import React from "react";
import { useSelector } from "react-redux";
import { UserState } from "../store";
import {
  Button,
  Center,
  Container,
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
import { useNavigate } from "react-router-dom";
import * as recipeClient from "./client";
import RecipeMakerIngredients from "./RecipeMakerIngredients";
import { nanoid } from "@reduxjs/toolkit";

const PLACEHOLDER_INGREDIENT: RecipeIngredient = {
  ingredientID: 'placeholder_id',
  name: "Ingredient",
  quantity: 1,
  unit: "unit",
};

const PLACEHOLDER_STEP: RecipeStep = {
  stepID: 'placeholder_id',
  stepTitle: "Prepare the ingredients",
  stepDescription: "Get all the ingredients ready to go",
};

const PLACEHOLDER_NOTE: RecipeNote = {
  noteID: 'placeholder_id',
  noteText: "Make sure to be careful with the knife!",
}

function RecipeMaker() {
  const { currentUser } = useSelector((state: UserState) => state.users);
  const gridColor = useColorModeValue("gray.100", "gray.700");
  const [isPublishing, setIsPublishing] = React.useState<boolean>(false);
  const toast = useToast();
  const navigate = useNavigate();
  const gridWidth = useBreakpointValue({ base: "100%", md: "90%" });
  const [recipe, setRecipe] = React.useState<Recipe>({
    name: "Recipe Name",
    description: "Recipe Description",
    ingredients: [PLACEHOLDER_INGREDIENT],
    steps: [PLACEHOLDER_STEP],
    notes: [PLACEHOLDER_NOTE],
  });

  const publishRecipe = async () => {
    setIsPublishing(true);
    try {
      const createdRecipe: Recipe = await recipeClient.create(recipe);
      toast({
        title: "Recipe Published",
        description: "Your recipe has been published",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate(`/recipe/${createdRecipe._id}`);
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
          Create Recipe
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
            <GridItem p="2" pb="6" bg={gridColor} area={"ingredients"}>
              <VStack>
                <Heading size="md">
                  Ingredients
                  <IconButton
                    variant="ghost"
                    onClick={() => {
                      const newIngredients = [...(recipe.ingredients ?? [])];;
                      newIngredients.push({...PLACEHOLDER_INGREDIENT, ingredientID: nanoid()});
                      setRecipe({
                        ...recipe,
                        ingredients: newIngredients
                      });
                    }}
                    aria-label="Add Ingredient"
                    icon={<AddIcon />}
                  />
                </Heading>
                <RecipeMakerIngredients recipe={recipe} setRecipe={setRecipe} />
              </VStack>
            </GridItem>
            <GridItem p="2" bg={gridColor} area={"steps"}>
              <VStack>
                <Heading size="md">
                  Steps
                  <IconButton
                    variant="ghost"
                    onClick={() => {
                      const newSteps = [...(recipe.steps ?? [])];
                      newSteps.push({...PLACEHOLDER_STEP, stepID: nanoid()});
                      setRecipe({
                        ...recipe,
                        steps: newSteps,
                      });
                    }}
                    aria-label="Add Step"
                    icon={<AddIcon />}
                  />
                </Heading>
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
                              steps: newSteps
                                .map(s => s.stepID === step.stepID ? {...s, stepTitle: e.target.value} : s)
                            });
                          }}
                        />
                        <IconButton
                          onClick={() => {
                            const newSteps = [...(recipe.steps ?? [])];
                            setRecipe({
                              ...recipe,
                              steps: newSteps
                                .filter(s => s.stepID !== step.stepID)
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
                        onChange={(e) => {
                          const newSteps = [...(recipe.steps ?? [])];
                          setRecipe({
                            ...recipe,
                            steps: newSteps
                              .map(s => s.stepID === step.stepID ? {...s, stepDescription: e.target.value} : s)
                          });
                        }}
                      />
                    </ListItem>
                  ))}
                </OrderedList>
              </VStack>
            </GridItem>
            <GridItem p="2" pb="6" bg={gridColor} area={"notes"}>
              <VStack>
                <Heading size="md">
                  Notes
                  <IconButton
                    variant="ghost"
                    onClick={() => {
                      const newNotes = [...(recipe.notes ?? [])];
                      newNotes.push({...PLACEHOLDER_NOTE, noteID: nanoid()});
                      setRecipe({
                        ...recipe,
                        notes: newNotes,
                      });
                    }}
                    aria-label="Add Step"
                    icon={<AddIcon />}
                  />
                </Heading>
                <OrderedList width="90%">
                  {recipe.notes?.map((note, index) => (
                    <ListItem key={index} mt={4}>
                      <HStack>
                        <Textarea
                          value={note.noteText}
                          placeholder="Make sure to use fresh ingredients"
                          minH={"40px"}
                          onChange={(e) => {
                            setRecipe({
                              ...recipe,
                              notes: [...(recipe.notes ?? [])]
                                .map(n => n.noteID === note.noteID ? {...n, noteText: e.target.value} : n)
                            });
                          }}
                        />
                        <IconButton
                          onClick={() => {
                            setRecipe({
                              ...recipe,
                              notes: [...(recipe.notes ?? [])]
                                .filter(n => n.noteID !== note.noteID),
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
              <Button
                isLoading={isPublishing}
                bg="blue.500"
                size="lg"
                loadingText="Publishing..."
                onClick={publishRecipe}
              >
                Publish Recipe
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
