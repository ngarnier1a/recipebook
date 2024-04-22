import { Card, CardBody, Stack, Heading, CardFooter, Text, Icon, useColorModeValue, Flex, Spacer, Button } from "@chakra-ui/react";
import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserState } from "../store";


function RecipeCard({ recipe }: {recipe: Recipe }) {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: UserState) => state.users);
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const hoverColor = useColorModeValue("blue.50", "gray.600");
  const textHoverColor = useColorModeValue("blue.500", "blue.300");

  const nameDisplay = recipe.name.length > 17 ? recipe.name.slice(0, 17) + "..." : recipe.name;
  const descriptionDisplay = recipe.description.length > 160 ? recipe.description.slice(0, 160) + "..." : recipe.description;

  const isLiked = (currentUser?.likedRecipes?.findIndex((r) => r._id === recipe._id) ?? -1) >= 0;

  const card = (
    <Card
        w='250px'
        h='250px'
        m={2}
        onClick={() => navigate(`/recipe/${recipe._id}`)}
        bg={bgColor}
        _hover={{ cursor: 'pointer', bg: hoverColor, color: textHoverColor }}
        title={recipe.name}
    >
        <CardBody px={5} pt={5} pb={0}>
            <Stack  spacing='3'>
            <Heading size='md'>{nameDisplay}</Heading>
            <Text size='sm'>
                {descriptionDisplay}
            </Text>
            </Stack>
        </CardBody>
        <CardFooter px={5} pb={3} pt={0}>
            <Flex align='center' justify="space-between" width="100%">
                <Text color='red.600'>
                    {recipe.likes}
                    <Icon ml={1} pt={1} as={ isLiked ? FaHeart : FaRegHeart } />
                </Text>
                <Spacer />
                <Button variant='ghost' size='sm' m={0} py={0} px={1} onClick={(e) => {
                    e.stopPropagation();
                    if (recipe.author) {
                        navigate(`/user/${recipe.author._id}/profile`);
                    } else {
                        navigate(`/recipe/${recipe._id}`);
                    }
                }}>
                    By {recipe.author?.username || 'Unknown'}
                </Button>
            </Flex>
        </CardFooter>
    </Card>
  )

  return (
    card
  );
}

export default RecipeCard;