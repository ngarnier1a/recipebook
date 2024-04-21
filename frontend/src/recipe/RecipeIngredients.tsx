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

function RecipeMakerIngredients({
  recipe,
}: {
  recipe: Recipe;
}) {
  const navigate = useNavigate();
  if (!recipe.ingredients) {
    throw new Error("Recipe must have ingredients to render");
  }

  const desktopIngredient = (ingredient: RecipeIngredient, index: number) => (
    <Tr key={index}>
      <Td pr={0}>{ingredient.name}</Td>
      <Td px={0}>{ingredient.quantity.toString()}</Td>
      <Td px={0}>{ingredient.unit}</Td>
      {<Td px={0}>{ingredient.stepNumber && ingredient.stepNumber}</Td>}
      {ingredient.fdcID &&
        <Td pl={0}>
          <Link onClick={() => navigate(`/nutrition/${ingredient.fdcID}`)}>
              {ingredient.fdcID}
          </Link>
        </Td>
      }
    </Tr>
  );

  const mobileIngredient = (ingredient: RecipeIngredient, index: number) => (
    <AccordionItem display={{ md: "none" }} my={1}>
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
          {ingredient.fdcID && (
            <Link onClick={() => navigate(`/nutrition/${ingredient.fdcID}`)}>
              FDC ID: {ingredient.fdcID}
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
            {recipe.ingredients.map((ingredient, index) => desktopIngredient(ingredient, index))}
          </Tbody>
        </Table>
      </TableContainer>
      <Accordion allowToggle width='100%' display={{ md: "none" }}>
        {recipe.ingredients.map((ingredient, index) => mobileIngredient(ingredient, index))}
      </Accordion>
    </>
  );
}

export default RecipeMakerIngredients;
