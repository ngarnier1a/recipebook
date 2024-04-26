import {
  Card,
  CardBody,
  Stack,
  Heading,
  CardFooter,
  Text,
  Icon,
  useColorModeValue,
  Flex,
  Spacer,
  Button,
} from "@chakra-ui/react";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserState } from "../store";

function ChefCard({ chef }: { chef: User }) {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: UserState) => state.users);

  const bgColor = useColorModeValue("blue.100", "blue.800");
  const hoverColor = useColorModeValue("blue.200", "blue.700");
  const textHoverColor = useColorModeValue("blue.700", "blue.100");
  const textColor = useColorModeValue("blue.600", "blue.200");
  const followColor = useColorModeValue("red.500", "red.400");

  const chefUsername = chef.username ?? "Unknown chef";

  const chefBio = chef.bio ?? "No bio avaliable";
  const nameDisplay =
    chefUsername.length > 15
      ? chefUsername.slice(0, 15) + "..."
      : chefUsername;
  const descriptionDisplay =
    chefBio.length > 130 ? chefBio.slice(0, 130) + "..." : chefBio;

  const isFollowed =
    (currentUser?.followedChefs?.findIndex((c) => c._id === chef._id) ?? -1) >=
    0;

  const card = (
    <Card
      w="250px"
      h="250px"
      m={2}
      onClick={() => navigate(`/user/${chef._id}/profile`)}
      bg={bgColor}
      color={textColor}
      _hover={{ cursor: "pointer", bg: hoverColor, color: textHoverColor }}
      title={chefUsername}
    >
      <CardBody px={5} pt={5} pb={0}>
        <Stack spacing="3">
          <Heading size="md">{nameDisplay}</Heading>
          <Text size="sm">{descriptionDisplay}</Text>
        </Stack>
      </CardBody>
      <CardFooter px={5} pb={3} pt={0} color={textColor}>
        <Flex align="center" justify="space-between" width="100%">
          <Text color={followColor}>
            {Math.max(chef.numFollowers ?? 0, 0)}
            <Icon ml={1} pt={1} as={isFollowed ? FaHeart : FaRegHeart} />
          </Text>
          <Spacer />
          <Button
            variant="ghost"
            size="sm"
            m={0}
            py={0}
            px={1}
            color={textColor}
            _hover={{
              bg: bgColor,
            }}
            title={`View ${chefUsername}'s recipe${chef.authoredRecipes?.length === 1 ? "" : "s"}`}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/user/${chef._id}/recipes`);
            }}
          >
            {chef.authoredRecipes?.length ?? 0} Recipe
            {chef.authoredRecipes?.length === 1 ? "" : "s"}
          </Button>
        </Flex>
      </CardFooter>
    </Card>
  );

  return card;
}

export default ChefCard;
