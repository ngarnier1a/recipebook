import {
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  Td,
  Link,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function RecipeIngredients({
  recipe,
}: {
  recipe: Recipe;
}) {
  const navigate = useNavigate();
  if (!recipe.ingredients) {
    throw new Error("Recipe must have ingredients to render");
  }

  const sortedIngredients = recipe.ingredients.sort((a, b) => {
    if (a.stepNumber === b.stepNumber) {
      if (a.name === b.name) {
        return a.ingredientID.localeCompare(b.ingredientID);
      } else {
        return a.name.localeCompare(b.name);
      }
    }
    return (a.stepNumber ?? -1) - (b.stepNumber ?? -1);
  });

  const desktopIngredient = (ingredient: RecipeIngredient) => (
    <Tr key={ingredient.ingredientID}>
      <Td pr={0}>{ingredient.name}</Td>
      <Td px={0}>{ingredient.quantity.toString()}</Td>
      <Td px={0}>{ingredient.unit}</Td>
      {<Td px={0}>{ingredient.stepNumber !== undefined ? ingredient.stepNumber + 1 : ''}</Td>}
      {ingredient.fdcItem?.fdcId &&
        <Td pl={0}>
          <Link onClick={() => navigate(`/nutrition/${ingredient.fdcItem?.fdcId}`)}>
              {ingredient.fdcItem.fdcId}
          </Link>
        </Td>
      }
    </Tr>
  )

  const mobileIngredient = (ingredient: RecipeIngredient) => (
    <AccordionItem
      key={ingredient.ingredientID}
      display={{ md: "none" }}
      my={1}
      >
        <AccordionButton
          width='90%'
          textAlign={{ base: "center" }}>
            {ingredient.quantity.toString()} {ingredient.unit} {ingredient.name}
        </AccordionButton>
        <AccordionPanel>
          {ingredient.stepNumber && (
            <Text>
              Step: {ingredient.stepNumber}
            </Text>
          )}
          {ingredient.fdcItem?.fdcId && (
            <Link onClick={() => navigate(`/nutrition/${ingredient.fdcItem?.fdcId}`)}>
              FDC ID: {ingredient.fdcItem.fdcId}
            </Link>
          )}
        </AccordionPanel>
    </AccordionItem>
  )


  return (
    <>
      <TableContainer width='100%' display={{ base: "none", md: "flex" }}>
        <Table width='100%' size='sm'>
          <Thead>
            <Tr>
              <Th pr={0}>Name</Th>
              <Th px={0}>QTY</Th>
              <Th px={0}>Unit</Th>
              <Th px={0}>Step</Th>
              <Th pl={0}>FDC ID</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedIngredients.map((ingredient) => desktopIngredient(ingredient))}
          </Tbody>
        </Table>
      </TableContainer>
      <Accordion allowToggle width='100%' display={{ md: "none" }}>
        {sortedIngredients.map((ingredient) => mobileIngredient(ingredient))}
      </Accordion>
    </>
  );
}

export default RecipeIngredients;
