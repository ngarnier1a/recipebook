import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Flex,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  IconButton,
  Icon,
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  VStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputStepper,
} from "@chakra-ui/react";
import recipe from ".";

function RecipeMakerIngredient({
  index,
  recipe,
  setRecipe,
}: {
  index: number;
  recipe: Recipe;
  setRecipe: (recipe: Recipe) => void;
}) {
  if (!recipe.ingredients) {
    throw new Error("Recipe must have ingredients to render");
  }

  const ingredient = recipe.ingredients[index];

  const units: RecipeUnit[] = [
    "unit",
    "tsp",
    "tbsp",
    "cup",
    "oz",
    "lb",
    "g",
    "kg",
    "ml",
    "l",
  ];

  const setIngredient = (ingredient?: RecipeIngredient) => {
    if (!recipe.ingredients) {
      throw new Error("Recipe must have ingredients to set");
    }
    if (!ingredient) {
      recipe.ingredients.splice(index, 1);
      setRecipe({ ...recipe, ingredients: recipe.ingredients });
      return;
    } else {
      recipe.ingredients[index] = ingredient;
      setRecipe({ ...recipe, ingredients: recipe.ingredients });
    }
  };

  const ingredientFields = (
    <>
        <Input
        value={ingredient.name}
        placeholder="Eggs"
        title='The name of the ingredient'
        onChange={(e) => {
            setIngredient({ ...ingredient, name: e.target.value });
        }}
        />
        <NumberInput
        value={ingredient.quantity.toString()}
        title='The quantity of the ingredient'
        ml={1}
        min={0}
        max={99}
        minW='70px'
        precision={2}
        onChange={(e) => {
            setIngredient({ ...ingredient, quantity: parseFloat(e) || 0 });
        }}
        >
        <NumberInputField />
        <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
        </NumberInputStepper>
        </NumberInput>
        <Select ml={1} title='The unit associated with ingredient quantity'>
        {units.map((unit, idx) => (
            <option key={idx} value={unit}>
            {unit}
            </option>
        ))}
        </Select>
        <Select ml={1} title='What step are these ingredients for'>
        {
            <>
            <option key={0} value={"no-step"} title='No specific step for this ingredient'>
                N/A
            </option>
            {recipe.steps?.map((step, idx) => (
                <option key={idx + 1} value={idx}>
                {idx + 1}
                </option>
            ))}
            </>
        }
        </Select>
        <Input
        value={ingredient.fdcID}
        ml={1}
        placeholder="18069"
        title='A FDC ID for the ingredient, for nutrition lookup (OPTIONAL)'
        onChange={(e) => {
            ingredient.fdcID = e.target.value;
            setIngredient({ ...ingredient, fdcID: e.target.value });
        }}
        />
        <IconButton
        ml={1}
        aria-label="Delete Ingredient"
        icon={<Icon as={DeleteIcon} />}
        onClick={() => setIngredient()}
        />
    </>
  )

  const desktopIngredient = (
    <Flex key={index} display={{ base: "none", md: "flex" }} my={1}>
        {ingredientFields}
    </Flex>
  )

  const mobileIngredient = (
    <AccordionItem display={{ md: "none" }} my={1}>
        <AccordionButton
        width='90%'
        textAlign={{ base: "center" }}>
            {ingredient.name}
        </AccordionButton>
        <AccordionPanel>
            <VStack>
                {ingredientFields}
            </VStack>
        </AccordionPanel>
    </AccordionItem>
  )

  return (
    <>
    {desktopIngredient}
    {mobileIngredient}
    </>
  );
}

export default RecipeMakerIngredient;
