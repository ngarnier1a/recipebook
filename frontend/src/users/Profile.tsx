import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { UserState } from "../store";
import {
  Divider,
  Heading,
  useToast,
  Text,
  VStack,
  HStack,
  Spacer,
  Button,
  Box,
  Spinner,
  Center,
} from "@chakra-ui/react";
import * as client from "./client";
import UserRecipes from "./UserRecipes";
import { setCurrentUser } from "./reducer";

function Profile() {
  const { userId } = useParams();
  const { currentUser } = useSelector((state: UserState) => state.users);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isCurrentUser, setIsCurrentUser] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isPressingFollow, setIsPressingFollow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    if (userId) {
      const fetchUserProfile = async () => {
        try {
          const userProfile = await client.otherProfile(userId);
          if (currentUser && userProfile._id === currentUser._id) {
            setIsCurrentUser(true);
            setIsFollowing(true);
          } else {
            if (currentUser && currentUser._id) {
              setIsFollowing(
                (currentUser.followedChefs?.findIndex(
                  (chef) => chef._id === userProfile._id,
                ) ?? -1) >= 0,
              );
            }
            setIsCurrentUser(false);
          }
          setUserProfile(userProfile);
        } catch (error) {
          console.error("Error fetching user profile", error);
          toast({
            title: "Error displaying user profile",
            description: "The specified user was not found",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          navigate("/home");
          setIsFollowing(false);
          setUserProfile(null);
        }
      };
      fetchUserProfile();
    } else {
      setIsFollowing(true);
      setIsCurrentUser(true);
      setUserProfile(currentUser);
    }
    setIsLoading(false);
  }, [userId, currentUser, navigate, toast]);

  const handleFollow = async (setFollowingStatus: boolean) => {
    setIsPressingFollow(true);
    if (!userProfile || !currentUser) {
      console.error(
        `Error following user: userProfile: ${JSON.stringify(userProfile)}, currentUser: ${JSON.stringify(currentUser)}`,
      );
      setIsPressingFollow(false);
      return;
    }

    try {
      const newUser = await client.setFollowUser(
        userProfile._id || "",
        setFollowingStatus,
      );
      if (newUser._id) {
        dispatch(setCurrentUser(newUser));
      }
      setIsFollowing(setFollowingStatus);
      toast({
        title: setFollowingStatus ? "Following chef" : "Unfollowing chef",
        description: setFollowingStatus
          ? `You are now following ${userProfile.username}`
          : `You are no longer following ${userProfile.username}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: setFollowingStatus
          ? "Error Following chef"
          : "Error Unfollowing chef",
        description: "Please try again",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Error following chef", error);
    }
    setIsPressingFollow(false);
  };

  const handleEdit = () => {
    navigate("/user/profile/edit");
  };

  const followButton = (
    <Button
      isLoading={isPressingFollow}
      m={0}
      onClick={() => handleFollow(!isFollowing)}
      colorScheme={isFollowing ? "red" : "blue"}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );

  const editButton = (
    <Button m={0} onClick={handleEdit} colorScheme="blue">
      Edit Profile
    </Button>
  );

  const AnonymousInfo = <Text m={0}>Sign in to follow</Text>;

  const desktopHeader = (
    <HStack
      justifyContent="space-between"
      align="center"
      w="full"
      mt={5}
      mb={4}
      display={{ base: "none", md: "flex" }}
    >
      <Heading
        position="absolute"
        left="50%"
        transform="translateX(-50%)"
        zIndex="1"
        size="xl"
        mt={5}
        mb={3}
      >
        {isCurrentUser ? "Your" : `${userProfile?.username ?? "Unknown"}'s`}{" "}
        Profile
      </Heading>
      <Spacer />
      <Box h="40px" mr={5}>
        {currentUser && isCurrentUser && editButton}
        {currentUser &&
          !isCurrentUser &&
          userProfile?.type === "CHEF" &&
          followButton}
        {!currentUser && userProfile?.type === "CHEF" && AnonymousInfo}
      </Box>
    </HStack>
  );

  const mobileHeader = (
    <VStack display={{ base: "flex", md: "none" }}>
      <Heading size="xl" mt={5} mb={0}>
        {isCurrentUser ? "Your" : `${userProfile?.username ?? "Unknown"}'s`}{" "}
        Profile
      </Heading>
      <HStack>
        {currentUser && isCurrentUser && editButton}
        {currentUser &&
          !isCurrentUser &&
          userProfile?.type === "CHEF" &&
          followButton}
        {!currentUser && userProfile?.type === "CHEF" && AnonymousInfo}
      </HStack>
    </VStack>
  );

  if (isLoading && !userProfile) {
    return (
      <Center mt={20}>
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!isLoading && !userId && !currentUser) {
    return (
      <Center mt={20}>
        <Text fontSize="xl" m={5} ml={8} mb={3} fontWeight="bold">
          Please sign in to view your profile
        </Text>
      </Center>
    );
  }

  return (
    userProfile && (
      <div>
        <VStack>
          {desktopHeader}
          {mobileHeader}
          <Divider />
        </VStack>
        {currentUser && isCurrentUser && (
          <>
            <Text fontSize="xl" m={5} ml={8} mb={3} fontWeight="bold">
              Email
            </Text>
            <Text fontSize="large" ml={10} mr={10} mb={10}>
              {userProfile.email ? userProfile.email : "No email set"}
            </Text>
            <Text fontSize="xl" m={5} ml={8} mb={3} fontWeight="bold">
              First Name
            </Text>
            <Text fontSize="large" ml={10} mr={10} mb={10}>
              {userProfile.firstName
                ? userProfile.firstName
                : "No first name set"}
            </Text>
            <Text fontSize="xl" m={5} ml={8} mb={3} fontWeight="bold">
              Last Name
            </Text>
            <Text fontSize="large" ml={10} mr={10} mb={10}>
              {userProfile.lastName ? userProfile.lastName : "No last name set"}
            </Text>
          </>
        )}
        <Text fontSize="xl" m={5} ml={8} mb={3} fontWeight="bold">
          Biography
        </Text>
        <Text fontSize="large" ml={10} mr={10} mb={10}>
          {userProfile.bio
            ? userProfile.bio
            : `No bio ${isCurrentUser ? "set" : "available"}`}
        </Text>
        {userProfile.type === "CHEF" && (
          <Text fontSize="medium" ml={10} mr={10} mb={5}>
            {`${Math.max(0, userProfile.numFollowers ?? 0)}
            follower${(userProfile.numFollowers ?? 0) === 1 ? "" : "s"}
            | ${userProfile.authoredRecipes?.length ?? 0} recipes published`}
          </Text>
        )}
        <Divider />
        <UserRecipes />
      </div>
    )
  );
}

export default Profile;
