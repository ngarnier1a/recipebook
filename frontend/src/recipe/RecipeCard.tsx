import { Card, CardBody, Stack, Heading, CardFooter, Text, Icon, useColorModeValue, Flex, Spacer, Button } from "@chakra-ui/react";
import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserState } from "../store";


function RecipeCard({ recipe }: {recipe: Recipe }) {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: UserState) => state.users);
  const bgColor = useColorModeValue('yellow.100', 'orange.800');
  const hoverColor = useColorModeValue('yellow.200', 'orange.700');
  const textHoverColor = useColorModeValue("orange.600", "orange.200");
  const textColor = useColorModeValue("orange.500", "orange.300");
  const likeColor = useColorModeValue("red.500", "red.300");

  const nameDisplay = recipe.name.length > 17 ? recipe.name.slice(0, 17) + "..." : recipe.name;
  const descriptionDisplay = recipe.description.length > 160 ? recipe.description.slice(0, 160) + "..." : recipe.description;

  const isLiked = (currentUser?.likedRecipes?.findIndex((r) => r._id === recipe._id) ?? -1) >= 0;

  const card = (
    <Card
        w='250px'
        h='250px'
        m={2}
        opacity={0.95}
        onClick={() => navigate(`/recipe/${recipe._id}`)}
        bg={bgColor}
        color={textColor}
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
                <Text color={likeColor}>
                    {recipe.likes}
                    <Icon ml={1} pt={1} as={ isLiked ? FaHeart : FaRegHeart } />
                </Text>
                <Spacer />
                <Button
                    variant='ghost'
                    size='sm'
                    m={0}
                    py={0}
                    px={1}
                    color={textColor}
                    _hover={{
                        bg: bgColor
                    }}
                    title={`View ${recipe.author?.username || 'Unknown'}'s profile`}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (recipe.author) {
                            navigate(`/user/${recipe.author._id}/profile`);
                        } else {
                            navigate(`/recipe/${recipe._id}`);
                        }
                    }}
                >
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