import { ChevronDownIcon, DeleteIcon } from "@chakra-ui/icons";
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
  Menu,
  Button,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  HStack
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
          min={0}
          width='100%'
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

        <Menu>
          <MenuButton
            ml={1}
            as={Button}
            variant='outline'
            width='100%'
            textAlign='start'
            title='The unit associated with ingredient quantity'
            rightIcon={<ChevronDownIcon ml={7} boxSize={5}/>} 
          >
            <Text ml={1}>
              {ingredient.unit.toString()}
            </Text>
          </MenuButton>
          <MenuList>
            {units.map((unit, idx) => (
              <MenuItem key={idx} onClick={() => setIngredient({ ...ingredient, unit })}>
                {unit}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton
            ml={1}
            as={Button}
            variant='outline'
            width='100%'
            textAlign='start'
            title='What step is this ingredient for'
            rightIcon={<ChevronDownIcon ml={7} boxSize={5}/>} 
          >
            <Text ml={1}>
              {ingredient.stepNumber !== undefined ? (ingredient.stepNumber + 1).toString() : 'N/A'}
            </Text>
          </MenuButton>
          <MenuList>
            <>
              <MenuItem
                key={'fillerkey'}
                title='No specific step for this ingredient'
                onClick={() => {
                  const { stepNumber, ...rest } = ingredient;
                  console.log('removing step number: ' + JSON.stringify(rest));
                  setIngredient(rest);
                }}
              >
                N/A
              </MenuItem>
              {recipe.steps?.map((step, idx) => (
                <MenuItem
                  key={step.stepID}
                  title={`This ingredient is used on step ${idx + 1}`}
                  onClick={() => {
                    console.log('setting step number: ' + idx);
                    setIngredient({ ...ingredient, stepNumber: idx})
                  }}
                >
                  {idx + 1}
                </MenuItem>
              ))}
            </>
          </MenuList>
        </Menu>
        <Input
        value={ingredient.fdcID || ""}
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

  const desktopIngredient = (ingredient: RecipeIngredient) => (
    <HStack width='100%' key={ingredient.ingredientID} display={{ base: "none", lg: "flex" }} my={1}>
        {ingredientFields(ingredient)}
    </HStack>
  )

  const mobileIngredient = (ingredient: RecipeIngredient) => (
    <AccordionItem key={ingredient.ingredientID} display={{ lg: "none" }} my={1}>
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
    <Accordion allowToggle width='100%'>
        {recipe.ingredients.map((ingredient) => desktopIngredient(ingredient))}
        {recipe.ingredients.map((ingredient) => mobileIngredient(ingredient))}
    </Accordion>
  );
}

export default RecipeMakerIngredients;
