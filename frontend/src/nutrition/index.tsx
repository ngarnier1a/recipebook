import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Center,
  Divider,
  Flex,
  HStack,
  Heading,
  IconButton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import * as client from "./client";
import * as userClient from "../users/client";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import RecipeCard from "../recipe/RecipeCard";
import { GoStarFill } from "react-icons/go";
import { GoStar } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { UserState } from "../store";
import { setCurrentUser } from "../users/reducer";

function Nutrition() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: UserState) => state.users);
  const { fdcId } = useParams();
  const [food, setFood] = useState<FDCFoodItem | null>(null);
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [isFavoriting, setIsFavoriting] = useState<boolean>(false);
  const toast = useToast();
  const dispatch = useDispatch();
  const tabLocation = useBreakpointValue({ base: "center", md: "start" });

  useEffect(() => {
    setIsLoading(true);
    if (!fdcId) {
      navigate("/nutrition/search");
      return;
    }

    const fetchFood = async () => {
      try {
        const [food, recipes] = await Promise.all([
          client.getFoodItem(fdcId),
          client.getRecipesWithFDCId(fdcId),
        ]);
        setFood(food);
        setRecipes(recipes);
      } catch (error) {
        console.error("Error fetching food item / food item recipes", error);
        toast({
          title: "Error displaying food item",
          description: "Returning to previous page",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        navigate(-1);
      }
    };

    fetchFood();
    setIsLoading(false);
  }, [fdcId, toast, navigate]);

  useEffect(() => {
    if (!currentUser || !currentUser.favoriteFoods || !food) {
      return;
    }
    const newFavoriteState = currentUser.favoriteFoods.some(
      (favorite) => favorite._id === food._id,
    );

    if (newFavoriteState !== isFavorited) {
      setIsFavorited(newFavoriteState);
      setIsFavoriting(false);
    }
  }, [currentUser, food, isFavorited]);

  if (isLoading || !food) {
    return <></>;
  }

  const handleFavorite = async () => {
    if (!currentUser || !food || !food._id || isFavoriting) {
      return;
    }
    setIsFavoriting(true);
    try {
      const updatedUser = await userClient.favoriteFood(food._id, !isFavorited);
      setIsFavorited(!isFavorited);
      dispatch(setCurrentUser(updatedUser));
      toast({
        title: `Food ${isFavorited ? "unf" : "f"}avorited`,
        status: "success",
        duration: 3000,
        isClosable: false,
      });
    } catch (error) {
      console.error("Error favoriting food item", error);
      toast({
        title: "Error favoriting food item",
        description: "Please try again",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsFavoriting(false);
    }
  };

  const headerInfo = (
    <>
      <Center>
        <Heading size="xl" mt={5}>
          Nutrition
        </Heading>
      </Center>
      <Divider my={5} />
      <Heading pos="relative" size="xl" ml={10} mt={5}>
        <HStack verticalAlign="top">
          {currentUser && (
            <IconButton
              pos="absolute"
              top="5px"
              aria-label="favorite food"
              variant="ghost"
              _hover={{}}
              _active={{}}
              opacity={isFavoriting ? 0.5 : 1}
              title={`${isFavorited ? "Unf" : "F"}avorite this food item`}
              onClick={handleFavorite}
              icon={
                isFavorited ? (
                  <GoStarFill size={35} fill="rgb(255, 193, 0)" />
                ) : (
                  <GoStar size={35} fill="rgb(255, 193, 0)" />
                )
              }
            />
          )}
          <Text
            ps={currentUser ? "45px" : "0px"}
          >{`${food.description} `}</Text>
        </HStack>
        <Text
          pt={5}
          fontSize="large"
          color="blue.500"
          title="The USDA Food Data Central ID for this food item"
        >
          FDC ID - {food.fdcId}
        </Text>
        {food.foodCategory && (
          <Text mt={3} fontSize="large" color="gray.500">
            In '{food.foodCategory}'
          </Text>
        )}
        {food.brandName && (
          <Text mt={3} fontSize="large" color="gray.500">
            By {food.brandName}
          </Text>
        )}
        <Button
          mt={5}
          mb={2}
          onClick={() =>
            window.open(
              `https://fdc.nal.usda.gov/fdc-app.html#/food-details/${food.fdcId}`,
            )
          }
          rightIcon={<ExternalLinkIcon />}
        >
          USDA
        </Button>
      </Heading>
    </>
  );

  const nutritionInfo = (
    <AccordionItem>
      <AccordionButton>
        <AccordionIcon ml={5} boxSize={8} />
        <Heading size="md" ml={4} my={5}>
          Nutritional Information
        </Heading>
      </AccordionButton>
      {food.nutrients && food.nutrients.length > 0 ? (
        <AccordionPanel>
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
        </AccordionPanel>
      ) : (
        <AccordionPanel>
          <Text ml={5} mb={3}>
            No nutritional information available for this food item
          </Text>
        </AccordionPanel>
      )}
    </AccordionItem>
  );

  const recipeInfo = (
    <AccordionItem>
      <AccordionButton>
        <AccordionIcon ml={5} boxSize={8} />
        <Heading size="md" ml={4} my={5}>
          Used In
        </Heading>
      </AccordionButton>
      <AccordionPanel>
        {recipes && recipes.length > 0 ? (
          <Flex justify={tabLocation} wrap="wrap">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </Flex>
        ) : (
          <Text ml={5} mb={3}>
            This food item is not used in any recipes
          </Text>
        )}
      </AccordionPanel>
    </AccordionItem>
  );

  return (
    <>
      {headerInfo}
      <Accordion width="100%" mt={5} allowToggle defaultIndex={0}>
        {nutritionInfo}
        {recipeInfo}
      </Accordion>
    </>
  );
}

export default Nutrition;
