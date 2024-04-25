import React from 'react'
import { AccordionButton, AccordionPanel, Table, Thead, Tr, Th, Tbody, Td, Accordion, AccordionItem, Text, Box, Button } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';

function FoodItems({ foods }: { foods: FDCFoodItem[] }) {

    const navigate = useNavigate();

    const secondaryInfo = (food: FDCFoodItem) => {
        let info = '';
    
        if (food.foodCategory) {
            info = food.foodCategory;
            if (food.brandName) {
                info += ` - ${food.brandName}`;
            }
        } else if (food.brandName && food.brandName !== 'Unknown') {
            info = food.brandName;
        }
    
        return info ? <Text color="gray.500">{info}</Text> : <></>;
    }

    const items = foods.map(food => (
        <AccordionItem key={food.fdcId} width='100%'>
            <AccordionButton>
                <Box flex="1" textAlign="left">
                    {`${food.description} `}
                    <Text
                        as="span"
                        color="blue.500"
                        _hover={{ cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/nutrition/${food.fdcId}`);
                        }}
                    >
                        {`${food.fdcId}`}
                    </Text>
                    {(food.brandName || food.foodCategory) && secondaryInfo(food)}
                </Box>
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
                    <Button
                        m={2}
                        onClick={() => window.open(`https://fdc.nal.usda.gov/fdc-app.html#/food-details/${food.fdcId}`)}
                    >
                        View on USDA
                    </Button>
                </AccordionPanel> :
                <AccordionPanel>
                    <Text>No nutritional information available</Text>
                </AccordionPanel>
            }
        </AccordionItem>
    ));

    return (
        <Accordion allowToggle width='100%'>
            {items}
        </Accordion>
    )
}

export default FoodItems;