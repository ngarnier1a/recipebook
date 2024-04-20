import React from "react";
import { useSelector } from "react-redux";
import { UserState } from "../store";
import {
  Accordion,
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
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import RecipeMakerIngredient from "./RecipeMakerIngredient";
import { useNavigate } from "react-router-dom";
import * as recipeClient from "./client";

const PLACEHOLDER_INGREDIENT: RecipeIngredient = {
  name: "Ingredient",
  quantity: 1,
  unit: "unit",
};

const PLACEHOLDER_STEP: RecipeStep = {
  stepTitle: "Prepare the ingredients",
  stepDescription: "Get all the ingredients ready to go",
};

const PLACEHOLDER_NOTE: RecipeNote = "Make sure to be careful with the knife!";

function RecipeMaker() {
  const { currentUser } = useSelector((state: UserState) => state.users);
  const gridColor = useColorModeValue("gray.100", "gray.700");
  const [isPublishing, setIsPublishing] = React.useState<boolean>(false);
  const toast = useToast();
  const navigate = useNavigate();
  const [recipe, setRecipe] = React.useState<Recipe>({
    name: "Recipe Name",
    description: "Recipe Description",
    ingredients: [PLACEHOLDER_INGREDIENT],
    steps: [PLACEHOLDER_STEP],
    notes: ["The best recipe ever!"],
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
        <Heading as="h1" py={5}>
          Create Recipe
        </Heading>
        <Container maxW="90%">
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
                      setRecipe({
                        ...recipe,
                        ingredients: [
                          ...(recipe.ingredients || []),
                          PLACEHOLDER_INGREDIENT,
                        ],
                      });
                    }}
                    aria-label="Add Ingredient"
                    icon={<AddIcon />}
                  />
                </Heading>
                <Accordion allowToggle>
                  {recipe.ingredients?.map((ingredient, index) => (
                    <RecipeMakerIngredient
                      index={index}
                      recipe={recipe}
                      setRecipe={setRecipe}
                    />
                  ))}
                </Accordion>
              </VStack>
            </GridItem>
            <GridItem p="2" bg={gridColor} area={"steps"}>
              <VStack>
                <Heading size="md">
                  Steps
                  <IconButton
                    variant="ghost"
                    onClick={() => {
                      setRecipe({
                        ...recipe,
                        steps: [...(recipe.steps || []), PLACEHOLDER_STEP],
                      });
                    }}
                    aria-label="Add Step"
                    icon={<AddIcon />}
                  />
                </Heading>
                <OrderedList width="90%">
                  {recipe.steps?.map((step, index) => (
                    <ListItem key={index} mt={4}>
                      <HStack>
                        <Input
                          value={step.stepTitle}
                          placeholder="Gather and prepare ingredients"
                          onChange={(e) => {
                            const newSteps = [...(recipe.steps || [])];
                            newSteps[index].stepTitle = e.target.value;
                            setRecipe({ ...recipe, steps: newSteps });
                          }}
                        />
                        <IconButton
                          onClick={() => {
                            const newSteps = [...(recipe.steps || [])];
                            newSteps.splice(index, 1);
                            setRecipe({ ...recipe, steps: newSteps });
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
                          const newSteps = [...(recipe.steps || [])];
                          newSteps[index].stepDescription = e.target.value;
                          setRecipe({ ...recipe, steps: newSteps });
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
                      setRecipe({
                        ...recipe,
                        notes: [...(recipe.notes || []), PLACEHOLDER_NOTE],
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
                          value={note}
                          placeholder="Make sure to use fresh ingredients"
                          minH={"40px"}
                          onChange={(e) => {
                            const newNotes = [...(recipe.notes || [])];
                            newNotes[index] = e.target.value;
                            setRecipe({ ...recipe, notes: newNotes });
                          }}
                        />
                        <IconButton
                          onClick={() => {
                            const newNotes = [...(recipe.notes || [])];
                            newNotes.splice(index, 1);
                            setRecipe({ ...recipe, notes: newNotes });
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
