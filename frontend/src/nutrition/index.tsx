import React, { useEffect } from 'react'
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Button, Center, Divider, Heading, Table, Tbody, Td, Text, Th, Thead, Tr, useToast } from "@chakra-ui/react";
import { useNavigate, useParams } from 'react-router-dom';
import * as client from "./client";
import { ExternalLinkIcon } from '@chakra-ui/icons';
import RecipeCard from '../recipe/RecipeCard';

function Nutrition() {
    const navigate = useNavigate();
    const { fdcId } = useParams();
    const [food, setFood] = React.useState<FDCFoodItem | null>(null);
    const [recipes, setRecipes] = React.useState<Recipe[] | null>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const toast = useToast();

    useEffect(() => {
      console.log(`Nutrition component mounted with fdcId: ${fdcId}`);
      setIsLoading(true);
      if (!fdcId) {
        navigate('/nutrition/search');
        return;
      }

      const fetchFood = async () => {
        try {
          const [food, recipes] = await Promise.all([
            client.getFoodItem(fdcId),
            client.getRecipesWithFDCId(fdcId),
          ]);
          console.log(food);
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

    if (isLoading || !food) {
      return <></>;
    }

    const headerInfo = (<>
      <Center>
        <Heading size='xl' mt={5}>Nutrition</Heading>
      </Center>
      <Divider my={5} />
      <Heading size='xl' ml={10} mt={5}>
        {`${food.description} `}
        <Text
          color='blue.500'
          fontSize='small'
          as='span'
          title='The USDA Food Data Central ID for this food item'
          _hover={{ cursor: 'pointer', textDecoration: 'underline' }}
        >
          {food.fdcId}
        </Text>
        {food.foodCategory && <Text mt={3} fontSize='large' color="gray.500">In '{food.foodCategory}'</Text>}
        {food.brandName && <Text mt={3} fontSize='large' color="gray.500">By {food.brandName}</Text>}
        <Button
          mt={5}
          mb={2}
            onClick={() => window.open(`https://fdc.nal.usda.gov/fdc-app.html#/food-details/${food.fdcId}`)}
            rightIcon={<ExternalLinkIcon />}
        >
            USDA
        </Button>
      </Heading>
    </>
    )

    const nutritionInfo = (
      <AccordionItem>
        <AccordionButton>
          <AccordionIcon ml={5} boxSize={8} />
          <Heading
            size='md'
            ml={4}
            my={5}
          >
            Nutritional Information
          </Heading>
        </AccordionButton>
        {
              (food.nutrients && food.nutrients.length > 0) ?
              <AccordionPanel>
                  <Table>
                      <Thead>
                          <Tr>
                              <Th>Nutrient</Th>
                              <Th>Amount</Th>
                          </Tr>
                      </Thead>
                      <Tbody>
                          {food.nutrients.map(nutrient => (
                              <Tr key={nutrient.nutrientId}>
                                  <Td>{nutrient.name}</Td>
                                  <Td>{nutrient.amount} {nutrient.unitName}</Td>
                              </Tr>
                          ))}
                      </Tbody>
                  </Table>
              </AccordionPanel> :
              <AccordionPanel>
                  <Text ml={5} mb={3}>No nutritional information available for this food item</Text>
              </AccordionPanel>
          }
      </AccordionItem>
    )

    const recipeInfo = (
      <AccordionItem>
        <AccordionButton>
          <AccordionIcon ml={5} boxSize={8} />
          <Heading
            size='md'
            ml={4}
            my={5}
          >
            Used In
          </Heading>
        </AccordionButton>
        {
          recipes && recipes.length > 0 ? recipes.map(recipe => (
            <AccordionPanel>
              <RecipeCard recipe={recipe} />
            </AccordionPanel>
          )) : (
            <AccordionPanel>
              <Text ml={5} mb={3}>This food item is not used in any recipes</Text>
            </AccordionPanel>
          )
        }
      </AccordionItem>
    )

    return (<>
      {headerInfo}
      <Accordion width='100%' mt={5} allowToggle defaultIndex={0}>
        {nutritionInfo}
        {recipeInfo}
      </Accordion>
    </>);
}

export default Nutrition;