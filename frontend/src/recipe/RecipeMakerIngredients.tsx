import { AddIcon, ChevronDownIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Input,
  NumberInput,
  NumberInputField,
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
  HStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import RecipeMakerFDCItem from "./RecipeMakerFDCItem";
import { useSelector } from "react-redux";
import { UserState } from "../store";

function RecipeMakerIngredients({
  recipe,
  setRecipe,
}: {
  recipe: Recipe;
  setRecipe: (recipe: Recipe) => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentIngredientIdx, setCurrentIngredientIdx] = useState<number>(0);
  const { currentUser } = useSelector((state: UserState) => state.users);

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
      ingredients: recipe.ingredients.map((i) =>
        i.ingredientID === ingredient.ingredientID ? ingredient : i,
      ),
    });
  };

  const deleteIngredient = (ingredient: RecipeIngredient) => {
    if (!recipe.ingredients) {
      throw new Error("Recipe must have ingredients to set");
    }
    setRecipe({
      ...recipe,
      ingredients: recipe.ingredients.filter(
        (i) => i.ingredientID !== ingredient.ingredientID,
      ),
    });
  };

  const ingredientFields = (ingredient: RecipeIngredient, idx: number) => (
    <>
      <Input
        value={ingredient.name}
        placeholder="Eggs"
        title="The name of the ingredient"
        onChange={(e) => {
          setIngredient({ ...ingredient, name: e.target.value });
        }}
      />
      <NumberInput
        value={ingredient.quantity.toString()}
        ml={0}
        min={0}
        width="100%"
        title="The quantity of the ingredient"
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
          pl={3}
          ml={0}
          as={Button}
          variant="outline"
          width="100%"
          textAlign="start"
          title="The unit associated with ingredient quantity"
          rightIcon={<ChevronDownIcon ml={7} boxSize={5} />}
        >
          <Text ml={1}>{ingredient.unit.toString()}</Text>
        </MenuButton>
        <MenuList>
          {units.map((unit, idx) => (
            <MenuItem
              key={idx}
              onClick={() => setIngredient({ ...ingredient, unit })}
            >
              {unit}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      <Menu>
        <MenuButton
          pl={3}
          ml={0}
          as={Button}
          variant="outline"
          width="100%"
          textAlign="start"
          title="What step is this ingredient for"
          rightIcon={<ChevronDownIcon ml={7} boxSize={5} />}
        >
          <Text ml={1}>
            {ingredient.stepNumber !== undefined
              ? "Step " + (ingredient.stepNumber + 1).toString()
              : "N/A"}
          </Text>
        </MenuButton>
        <MenuList>
          <>
            <MenuItem
              key={"fillerkey"}
              title="No specific step for this ingredient"
              onClick={() => {
                const { stepNumber, ...rest } = ingredient;
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
                  setIngredient({ ...ingredient, stepNumber: idx });
                }}
              >
                Step {idx + 1}
              </MenuItem>
            ))}
          </>
        </MenuList>
      </Menu>
      <Button
        ml={0}
        width="100%"
        variant={ingredient.fdcItem ? "outline" : "solid"}
        textAlign="start"
        title="A FDC food item for the ingredient, for nutrition lookup (OPTIONAL)"
        onClick={() => {
          setCurrentIngredientIdx(idx);
          onOpen();
        }}
        leftIcon={ingredient.fdcItem ? <></> : <Icon as={AddIcon} />}
        opacity={ingredient.fdcItem ? 1 : 0.6}
      >
        {currentUser &&
        currentUser.favoriteFoods?.some(
          (f) => f.fdcId === ingredient.fdcItem?.fdcId,
        )
          ? "⭐ "
          : ""}
        {ingredient.fdcItem?.description ?? "Food"}
      </Button>
      <IconButton
        ml={0}
        aria-label="Delete Ingredient"
        icon={<Icon as={DeleteIcon} />}
        onClick={() => deleteIngredient(ingredient)}
      />
    </>
  );

  const desktopIngredient = (ingredient: RecipeIngredient, idx: number) => (
    <HStack
      width="100%"
      key={ingredient.ingredientID}
      display={{ base: "none", lg: "flex" }}
      my={1}
    >
      {ingredientFields(ingredient, idx)}
    </HStack>
  );

  const mobileIngredient = (ingredient: RecipeIngredient, idx: number) => (
    <AccordionItem
      key={ingredient.ingredientID}
      display={{ lg: "none" }}
      my={1}
    >
      <AccordionButton width="90%" textAlign={{ base: "center" }}>
        {ingredient.name}
      </AccordionButton>
      <AccordionPanel>
        <VStack>{ingredientFields(ingredient, idx)}</VStack>
      </AccordionPanel>
    </AccordionItem>
  );

  return (
    <>
      {recipe.ingredients &&
        recipe.ingredients.length > currentIngredientIdx && (
          <RecipeMakerFDCItem
            ingredient={recipe.ingredients[currentIngredientIdx]}
            setIngredientFDCItem={(fdcItem: FDCFoodItem) => {
              const ingredient = (recipe.ingredients ?? [])[
                currentIngredientIdx
              ];
              setIngredient({ ...ingredient, fdcItem });
              onClose();
            }}
            isOpen={isOpen}
            onClose={onClose}
          />
        )}
      <Accordion allowToggle width="95%">
        {recipe.ingredients.map((ingredient, idx) =>
          desktopIngredient(ingredient, idx),
        )}
        {recipe.ingredients.map((ingredient, idx) =>
          mobileIngredient(ingredient, idx),
        )}
      </Accordion>
    </>
  );
}

export default RecipeMakerIngredients;
