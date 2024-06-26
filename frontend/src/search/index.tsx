import { SearchIcon } from "@chakra-ui/icons";
import {
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as client from "./client";
import * as nutritionClient from "../nutrition/client";
import FoodItems from "../nutrition/FoodItems";
import { useSelector } from "react-redux";
import { UserState } from "../store";

function Search() {
  const { currentUser } = useSelector((state: UserState) => state.users);
  const location = useLocation();
  const navigate = useNavigate();
  const [foods, setFoods] = useState<FDCFoodItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError("");

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
        return aFavorited && !bFavorited
          ? -1
          : !aFavorited && bFavorited
            ? 1
            : 0;
      });
      return favoritedFoods;
    };

    const fetchFoods = async (query: string) => {
      setSearchQuery(query);
      try {
        let foods: FDCFoodItem[] = [];
        if (parseInt(query)) {
          const food = await nutritionClient.getFoodItem(query);
          if (food) {
            foods = [food];
          }
        } else {
          foods = await client.searchFoods(query);
          foods = sortFavoritedFoodFirst(foods);
        }
        if (foods.length === 0) {
          setError(`No results for ${query}`);
        }
        setFoods(foods);
      } catch (error) {
        console.error(error);
        setError(`Error searching ${query}`);
      } finally {
        setIsLoading(false);
      }
    };

    const query = new URLSearchParams(location.search).get("q") ?? "";
    if (!query) {
      setSearchQuery("");
      setError("");
      setFoods([]);
      setIsLoading(false);
      return;
    } else {
      fetchFoods(query);
    }
  }, [location, currentUser, navigate]);

  const resultsArea = error ? (
    <Text color="red.500">{error}</Text>
  ) : isLoading ? (
    <Heading mt={5} size="md">
      Loading...
    </Heading>
  ) : !foods || foods.length === 0 ? (
    <></>
  ) : (
    <FoodItems foods={foods} />
  );

  return (
    <VStack justifyContent="center" width="100%" mb={10}>
      <Heading mt={10} mb={7} size="lg" fontWeight="bold">
        Search Foods or Ingredients
      </Heading>
      <InputGroup
        width={"80%"}
        textAlign={"center"}
        size="lg"
        mb={10}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            navigate(`/nutrition/search?q=${searchQuery}`);
          }
        }}
      >
        <InputLeftElement
          onClick={() => navigate(`/nutrition/search?q=${searchQuery}`)}
          _hover={{ cursor: "pointer" }}
          children={isLoading ? <Spinner size="md" /> : <SearchIcon />}
        />
        <Input
          placeholder="Search foods by name or FDC ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </InputGroup>
      {resultsArea}
      {foods.length > 0 && !isLoading && !error && (
        <Text color="gray.500" mt={5}>
          {foods.length} result{foods.length !== 1 ? "s" : ""} for{" "}
          {new URLSearchParams(location.search).get("q") ?? ""}
        </Text>
      )}
    </VStack>
  );
}

export default Search;
