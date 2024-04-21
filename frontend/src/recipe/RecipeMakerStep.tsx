import React from "react";
import { useSelector } from "react-redux";
import { UserState } from "../store";
import { Button, Flex, Heading, Input, VStack } from "@chakra-ui/react";



function RecipeMakerStep() {
  const { currentUser } = useSelector((state: UserState) => state.users);
  const [recipe, setRecipe] = React.useState<Recipe>({
    name: "My Recipe",
    description: "Recipe Description",
    steps: [],
    notes: [],
  })

  const publishRecipe = () => {
    // POST request to /api/recipe
  }

  return (
    <VStack>
      <Heading as="h1">Create a Recipe</Heading>
      <Input
        value={recipe.name}
        onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
      />
      <Heading as="h2">Ingredients</Heading>
      {/* Add Ingredient Component Here */}
      <Heading as="h2">Steps</Heading>
      {/* Add Step Component Here */}
      <Heading as="h2">Notes</Heading>
      {/* Add Note Component Here */}
      <Button>Add Ingredient</Button>
      <Button>Add Step</Button>
      <Button>Add Note</Button>
      <Button onClick={publishRecipe}>Publish Recipe</Button>
    </VStack>
  );
}

export default RecipeMakerStep;