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
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as client from "./client";
import FoodItems from "../nutrition/FoodItems";

function Search() {

  const location = useLocation();
  const navigate = useNavigate();
  const [ foods, setFoods ] = useState<FDCFoodItem[]>([]);
  const [ searchQuery, setSearchQuery ] = useState<string>("");
  const [ isLoading, setIsLoading ] = useState<boolean>(true);
  const [ error, setError ] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const fetchFoods = async (query: string) => {
      if (parseInt(query)) {
        navigate(`/nutrition/${query}`);
      }

      setSearchQuery(query);
      try {
        const foods = await client.searchFoods(query);
        setFoods(foods);
      } catch (error) {
        setError(`Error searching ${query}`);
      } finally {
        setIsLoading(false);
      }
    };

    const query = new URLSearchParams(location.search).get("q") ?? "";
    if (!query) {
      setIsLoading(false);
      return;
    } else {
      fetchFoods(query);
    }
  }, [location, navigate]);

  const resultsArea = (
    error ? <Text>{error}</Text> :
    isLoading ? <Heading mt={5} size='md'>Loading...</Heading> :
    !foods || foods.length === 0 ? <></> :
    <FoodItems foods={foods} />
  )

  return (
    <VStack justifyContent='center' width='100%' mb={10}>
      <Heading mt={10} mb={5} size='lg' fontWeight='bold'>
        Search Foods or Ingredients
      </Heading>
      <InputGroup
        width={"80%"}
        textAlign={"center"}
        size='lg'
        mb={10}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            navigate(`/search?q=${searchQuery}`);
          }
        }}
      >
        <InputLeftElement
          onClick={() => navigate(`/search?q=${searchQuery}`)}
          _hover={{ cursor: 'pointer' }}
          children={isLoading ? <Spinner size='md' /> : <SearchIcon/>}
        />
        <Input placeholder="Search foods from the FDC" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </InputGroup>
      {resultsArea}
    </VStack>
  );
}

export default Search;