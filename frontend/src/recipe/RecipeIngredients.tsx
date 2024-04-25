import {
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
  useBreakpointValue,
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
      <Td px={0}>
        {ingredient.quantity.toString()} 
        {ingredient.unit !== 'unit' ? ` ${ingredient.unit}${ingredient.quantity !== 1 ? 's' : ''}` : ''} 
      </Td>
      {<Td px={0}>{ingredient.stepNumber !== undefined ? ingredient.stepNumber + 1 : ''}</Td>}
      {ingredient.fdcItem?.fdcId &&
        <Td pl={0}>
          <Link onClick={() => navigate(`/nutrition/${ingredient.fdcItem?.fdcId}`)}>
              {ingredient.fdcItem.description}
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
            {ingredient.quantity.toString()} 
            {ingredient.unit !== 'unit' ? ` ${ingredient.unit}${ingredient.quantity !== 1 ? 's ' : ' '}` : ' '}
            {ingredient.name}
        </AccordionButton>
        <AccordionPanel pb={0} pt={(ingredient.stepNumber?.toString() || ingredient.fdcItem) ? 2 : 0}>
          { (ingredient.stepNumber?.toString() || ingredient.fdcItem) &&
            <Table width='100%'>
              <Thead>
                <Tr>
                  <Th px={2} pt={0} textAlign='center'>Step</Th>
                  <Th px={2} pt={0} textAlign='center'>FDC Food</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr pt={0}>
                  <Td textAlign='center' pt={0}>
                    {ingredient.stepNumber?.toString() ? (
                      (ingredient.stepNumber + 1).toString()
                    ) : ''}
                  </Td>
                  <Td textAlign='center' pt={0}>
                    {ingredient.fdcItem?.fdcId && (
                      <Link onClick={() => navigate(`/nutrition/${ingredient.fdcItem?.fdcId}`)}>
                        {ingredient.fdcItem.description}
                      </Link>
                    )}
                  </Td>
                </Tr>
              </Tbody>
            </Table>

          }
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
              <Th px={0}>Amount</Th>
              <Th px={0}>Step</Th>
              <Th pl={0} pr={0}>FDC Food</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedIngredients.map((ingredient) => desktopIngredient(ingredient))}
          </Tbody>
        </Table>
      </TableContainer>
      <Accordion allowMultiple width='100%' display={{ md: "none" }}>
        {sortedIngredients.map((ingredient) => mobileIngredient(ingredient))}
      </Accordion>
    </>
  );
}

export default RecipeIngredients;
