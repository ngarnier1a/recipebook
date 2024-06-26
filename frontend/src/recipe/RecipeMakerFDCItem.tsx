import {
  AddIcon,
  CloseIcon,
  DeleteIcon,
  ExternalLinkIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  HStack,
  IconButton,
  DrawerBody,
  InputGroup,
  InputLeftElement,
  Spinner,
  Text,
  Input,
  Divider,
  DrawerFooter,
  Box,
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Button,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import * as searchClient from "../search/client";
import * as nutritionClient from "../nutrition/client";
import { useSelector } from "react-redux";
import { UserState } from "../store";

function RecipeMakerFDCItem({
  ingredient,
  setIngredientFDCItem,
  isOpen,
  onClose,
}: {
  ingredient: RecipeIngredient;
  setIngredientFDCItem: (fdcItem?: FDCFoodItem) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fdcItems, setFDCItems] = useState<FDCFoodItem[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const searchBarRef = useRef<HTMLInputElement>(null);
  const { currentUser } = useSelector((state: UserState) => state.users);

  useEffect(() => {
    if (ingredient.fdcItem && ingredient.fdcItem.fdcId) {
      setSearchQuery(ingredient.fdcItem.fdcId.toString());
      setFDCItems([ingredient.fdcItem]);
    } else if (!ingredient.fdcItem && ingredient.name !== "Ingredient") {
      setSearchQuery(ingredient.name);
      setFDCItems([]);
    } else {
      setSearchQuery("");
      setFDCItems([]);
    }
  }, [ingredient]);

  const sortFavoritedFoodFirst = (foods: FDCFoodItem[]) => {
    if (!currentUser || !currentUser.favoriteFoods) {
      return foods;
    }
    const favoritedFoods = foods.sort((a, b) => {
      const aFavorited = currentUser.favoriteFoods?.some(
        (f) => f.fdcId === a.fdcId,
      );
      const bFavorited = currentUser.favoriteFoods?.some(
        (f) => f.fdcId === b.fdcId,
      );
      return aFavorited && !bFavorited ? -1 : !aFavorited && bFavorited ? 1 : 0;
    });
    return favoritedFoods;
  };

  const searchFDCItems = async () => {
    setIsLoading(true);
    try {
      let items: FDCFoodItem[] = [];
      if (parseInt(searchQuery)) {
        const item = await nutritionClient.getFoodItem(searchQuery);
        if (item) {
          items = [item];
        }
      } else {
        items = await searchClient.searchFoods(searchQuery);
        items = sortFavoritedFoodFirst(items);
      }
      if (items.length === 0) {
        setSearchError(`No results for ${searchQuery}`);
      }
      setFDCItems(items);
    } catch (error) {
      setSearchError(`Error searching ${searchQuery}`);
    } finally {
      setIsLoading(false);
    }
  };

  const accordion = fdcItems.map((food) => (
    <AccordionItem key={food.fdcId} width="full">
      <AccordionButton>
        <Box key={food._id} flex="1" textAlign="left" rounded="lg" p={2}>
          <strong>
            {currentUser &&
            currentUser.favoriteFoods?.some((f) => f.fdcId === food.fdcId)
              ? "⭐ "
              : ""}
            {food.description}{" "}
          </strong>
          <Text as="span" color="blue.500">
            {`${food.fdcId}`}
          </Text>
          {food.foodCategory && (
            <Text color="gray.500">{food.foodCategory}</Text>
          )}
          {food.brandName && <Text color="gray.500">{food.brandName}</Text>}
        </Box>
      </AccordionButton>
      <AccordionPanel>
        <HStack justify="space-between">
          <Button
            mb={3}
            ml={2}
            leftIcon={
              food.fdcId === ingredient.fdcItem?.fdcId ? (
                <DeleteIcon />
              ) : (
                <AddIcon />
              )
            }
            onClick={() => {
              if (food.fdcId === ingredient.fdcItem?.fdcId) {
                setIngredientFDCItem();
              } else {
                setIngredientFDCItem(food);
              }
              onClose();
            }}
          >
            {food.fdcId === ingredient.fdcItem?.fdcId ? "Remove" : "Add"}
          </Button>
          <Button
            mb={3}
            onClick={() =>
              window.open(`${window.location.origin}/#/nutrition/${food.fdcId}`)
            }
            rightIcon={<ExternalLinkIcon />}
          >
            Details
          </Button>
        </HStack>
        {food.nutrients && food.nutrients.length > 0 ? (
          <Table>
            <Thead>
              <Tr>
                <Th>Nutrient</Th>
                <Th>Amount</Th>
              </Tr>
            </Thead>
            <Tbody>
              {food.nutrients.map((nutrient) => (
                <Tr key={nutrient.nutrientId}>
                  <Td>{nutrient.name}</Td>
                  <Td>
                    {nutrient.amount} {nutrient.unitName}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : (
          <Text>No nutritional information available</Text>
        )}
      </AccordionPanel>
    </AccordionItem>
  ));

  const loadingBody = (
    <>
      <Divider mb={1} />
      <Text textAlign="center" color="gray.500" mt={4}>
        Loading...
      </Text>
    </>
  );

  const errorBody = (
    <>
      <Divider mb={1} />
      <Text textAlign="center" color="red.500" mt={4}>
        {searchError}
      </Text>
    </>
  );

  const emptyBody = (
    <>
      <Divider mb={1} />
      <Text textAlign="center" color="gray.500" mt={4}>
        Enter a search query
      </Text>
    </>
  );

  const drawerBody = isLoading
    ? loadingBody
    : searchError
      ? errorBody
      : fdcItems.length === 0
        ? emptyBody
        : accordion;

  const drawer = (
    <Drawer
      placement="right"
      onClose={onClose}
      isOpen={isOpen}
      initialFocusRef={searchBarRef}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">
          <HStack justify="space-between">
            <Text>Add FDC Food</Text>
            <IconButton
              onClick={onClose}
              variant="ghost"
              size="sm"
              icon={<CloseIcon />}
              aria-label={"close fdc item drawer"}
            />
          </HStack>
        </DrawerHeader>
        <DrawerBody px={5}>
          <InputGroup
            width={"100%"}
            textAlign={"center"}
            size="md"
            mt={3}
            mb={5}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.length > 0) {
                setSearchError(null);
                searchFDCItems();
              }
            }}
          >
            <InputLeftElement
              _hover={{ cursor: "pointer" }}
              onClick={() => {
                if (searchQuery.length > 0) {
                  setSearchError(null);
                  searchFDCItems();
                }
              }}
              children={isLoading ? <Spinner size="md" /> : <SearchIcon />}
            />
            <Input
              placeholder="Search keywords or FDC IDs"
              ref={searchBarRef}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
            />
          </InputGroup>
          <Accordion allowToggle width="100%">
            {drawerBody}
          </Accordion>
        </DrawerBody>
        <DrawerFooter>
          <Text fontSize="small">
            FDC food items have nutrient information that can be used to view
            the nutrition of your recipe.
          </Text>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );

  return <>{drawer}</>;
}

export default RecipeMakerFDCItem;
