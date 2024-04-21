import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import * as recipeClient from "./client";
import { Center, VStack, Heading, Container, Grid, GridItem, Text, OrderedList, ListItem, Button, useColorModeValue, useBreakpointValue } from "@chakra-ui/react";
import RecipeIngredients from "./RecipeIngredients";



function Recipe() {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = React.useState<Recipe | null>(null);
  const gridColor = useColorModeValue("gray.100", "gray.700");
  const gridWidth = useBreakpointValue({ base: "100%", md: "90%" });

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

  return ( recipe &&
    <Center>
      <VStack width="100%">
        <Heading as="h1" py={5} mx={5}>
          {`${recipe.author?.username}'s ${recipe.name}`}
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
                      {note}
                    </ListItem>
                  ))}
                </OrderedList>
              </VStack>
            </GridItem>
            <GridItem p="2" area={"buttons"} textAlign="end">
              <Button
                bg="red.500"
                size="lg"
                loadingText="Liking..."
              >
                Like
              </Button>
            </GridItem>
          </Grid>
        </Container>
      </VStack>
    </Center>
  );
}

export default Recipe;