import { Card, CardBody, Stack, Heading, CardFooter, Text, Icon, useColorModeValue, Flex, Spacer, Button } from "@chakra-ui/react";
import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserState } from "../store";


function ChefCard({ chef }: {chef: User }) {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: UserState) => state.users);
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const hoverColor = useColorModeValue("blue.50", "gray.600");
  const textHoverColor = useColorModeValue("blue.500", "blue.300");

  const chefBio = chef.bio ?? "No bio avaliable";
  const nameDisplay = chef.username.length > 17 ? chef.username.slice(0, 17) + "..." : chef.username;
  const descriptionDisplay = chefBio.length > 160 ? chefBio.slice(0, 160) + "..." : chefBio;

  const isFollowed = (currentUser?.followedChefs?.findIndex((c) => c._id === chef._id) ?? -1) >= 0;

  const card = (
    <Card
        w='250px'
        h='250px'
        m={2}
        onClick={() => navigate(`/user/${chef._id}/profile`)}
        bg={bgColor}
        _hover={{ cursor: 'pointer', bg: hoverColor, color: textHoverColor }}
        title={chef.username}
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
                    {Math.max(chef.numFollowers ?? 0, 0)}
                    <Icon ml={1} pt={1} as={ isFollowed ? FaHeart : FaRegHeart } />
                </Text>
                <Spacer />
                <Button variant='ghost' size='sm' m={0} py={0} px={1} onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/user/${chef._id}/recipes`);
                }}>
                    {chef.authoredRecipes?.length ?? 0} Recipes
                </Button>
            </Flex>
        </CardFooter>
    </Card>
  )

  return (
    card
  );
}

export default ChefCard;