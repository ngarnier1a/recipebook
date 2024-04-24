import { ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

function Search() {
  const { searchType } = useParams();
  const [ localSearchType, setLocalSearchType ] = useState(searchType || 'RECIPE');

  const friendlySearchType: Record<SearchType,string> = {
    RECIPE: 'Recipes',
    CHEF: 'Chefs',
    INGREDIENT: 'Nutrition',
  }

  const searchDropdown = (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        {friendlySearchType[localSearchType as SearchType]}
      </MenuButton>
      <MenuList>
        {Object.entries(friendlySearchType).map(([type, friendlyName]) => (
          <MenuItem key={type} value={type} onClick={() => setLocalSearchType(type as SearchType)}>
            {friendlyName}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )

  return (
    <VStack justifyContent='center'>
      <Text mt={16} mb={5} fontSize={"x-large"} fontWeight={600}>
        Search RecipeBook
      </Text>
      {/* I want a big search bar for an entire website */}
      <InputGroup width={"80%"} textAlign={"center"} size='lg'>
        <InputLeftElement children={<SearchIcon />} />
        <Input placeholder="Search Recipes, People, and Ingredients" />
        <InputRightElement width={'7em'} children={searchDropdown} />
      </InputGroup>
    </VStack>
  );
}

export default Search;
