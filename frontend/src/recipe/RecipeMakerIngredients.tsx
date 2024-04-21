import { DeleteIcon } from "@chakra-ui/icons";
import {
  Flex,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  IconButton,
  Icon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  VStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputStepper,
} from "@chakra-ui/react";

function RecipeMakerIngredients({
  recipe,
  setRecipe,
}: {
  recipe: Recipe;
  setRecipe: (recipe: Recipe) => void;
}) {
  if (!recipe.ingredients) {
    throw new Error("Recipe must have ingredients to render");
  }

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

  const setIngredient = (ingredient: RecipeIngredient) => {
    if (!recipe.ingredients) {
      throw new Error("Recipe must have ingredients to set");
    }
    setRecipe({
      ...recipe,
      ingredients: recipe.ingredients
        .map(i => i.ingredientID === ingredient.ingredientID ? ingredient : i),
    });
  };

  const deleteIngredient = (ingredient: RecipeIngredient) => {
    if (!recipe.ingredients) {
      throw new Error("Recipe must have ingredients to set");
    }
    setRecipe({
      ...recipe,
      ingredients: recipe.ingredients
        .filter(i => i.ingredientID !== ingredient.ingredientID),
    });
  }

  const ingredientFields = (ingredient: RecipeIngredient) => (
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
          ml={1}
          title='The quantity of the ingredient'
          precision={2}
          onChange={(valueString) => {
              const value = parseFloat(valueString);
              setIngredient({ ...ingredient, quantity: value });
          }}
        >
          <NumberInputField minW="65px" />
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
            setIngredient({ ...ingredient, fdcID: e.target.value });
        }}
        />
        <IconButton
        ml={1}
        aria-label="Delete Ingredient"
        icon={<Icon as={DeleteIcon} />}
        onClick={() => deleteIngredient(ingredient)}
        />
    </>
  )

  const desktopIngredient = (ingredient: RecipeIngredient, idx: number) => (
    <Flex key={idx} display={{ base: "none", md: "flex" }} my={1}>
        {ingredientFields(ingredient)}
    </Flex>
  )

  const mobileIngredient = (ingredient: RecipeIngredient, idx: number) => (
    <AccordionItem key={idx} display={{ md: "none" }} my={1}>
        <AccordionButton
        width='90%'
        textAlign={{ base: "center" }}>
            {ingredient.name}
        </AccordionButton>
        <AccordionPanel>
            <VStack>
                {ingredientFields(ingredient)}
            </VStack>
        </AccordionPanel>
    </AccordionItem>
  )


  return (
    <Accordion allowToggle>
        {recipe.ingredients.map((ingredient, idx) => desktopIngredient(ingredient, idx))}
        {recipe.ingredients.map((ingredient, idx) => mobileIngredient(ingredient, idx))}
    </Accordion>
  );
}

export default RecipeMakerIngredients;
