import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { UserState } from "../store";
import { Divider, Heading, useToast, Text, VStack, HStack, Spacer, Button } from "@chakra-ui/react";
import * as client from "./client";
import Recipes from "./Recipes";
import { setCurrentUser } from "./reducer";



function Profile() {
  const { userId } = useParams();
  const { currentUser } = useSelector((state: UserState) => state.users);
  const [userProfile, setUserProfile] = React.useState<User | null>(null);
  const [isCurrentUser, setIsCurrentUser] = React.useState<boolean>(false);
  const [isFollowing, setIsFollowing] = React.useState<boolean>(false);
  const [isPressingFollow, setIsPressingFollow] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userId) {
      const fetchUserProfile = async () => {
        try {
          const userProfile = await client.otherProfile(userId);
          if (currentUser && userProfile._id === currentUser._id) {
            setIsCurrentUser(true);
            setIsFollowing(true);
          } else {
            if (currentUser && currentUser._id) {
              setIsFollowing((currentUser.followedChefs?.findIndex(chef => chef._id === userProfile._id) ?? -1) >= 0);
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
          navigate('/home');
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
  }, [userId, currentUser, navigate, toast]);

  if (!userProfile || !userProfile._id) {
    return <div>404: No user found</div>;
  }

  const handleFollow = async (setFollowingStatus: boolean) => {
    setIsPressingFollow(true);
    if (!userProfile || !currentUser) {
      console.log(`Error following user: userProfile: ${userProfile}, currentUser: ${currentUser}`)
      setIsPressingFollow(false);
      return;
    }

    try {
      const newUser = await client.setFollowUser(userProfile._id || '', true);
      if (newUser._id) {
        dispatch(setCurrentUser(newUser));
      }
      setIsFollowing(setFollowingStatus);
      toast({
        title: setFollowingStatus ?
          "Following chef" :
          "Unfollowing chef",
        description: setFollowingStatus ?
          `You are now following ${userProfile.username}` :
          `You are no longer following ${userProfile.username}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: setFollowingStatus ?
          "Error Following chef" :
          "Error Unfollowing chef",
        description: "Please try again",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Error following chef", error);
    }
    setIsPressingFollow(false);
  }

  const handleEdit = () => {
    navigate('/user/profile/edit');
  }

  const followButton = (
    <Button
      isLoading={isPressingFollow}
      mr={5}
      onClick={() => handleFollow(!isFollowing)}
      colorScheme={isFollowing ? "red" : "blue"}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  )

  const editButton = (
    <Button mr={5} onClick={handleEdit} colorScheme="blue">
      Edit Profile
    </Button>
  )

  const AnonymousInfo = (
    <Text mr={5}>
      Sign in to follow
    </Text>
  )

  return (userProfile &&
    <div>
      <VStack>
          <HStack justifyContent="space-between" align='center' w='full' mt={5} mb={4}>
            <Heading position="absolute" left="50%" transform="translateX(-50%)" zIndex="1" size='xl' mt={5} mb={3}>
              {userProfile.username}'s Profile
            </Heading>
            <Spacer />
            {currentUser ? (isCurrentUser ? editButton : followButton) : AnonymousInfo}
          </HStack>
          <Divider />
      </VStack>
      <Text fontSize='xl' m={5} ml={8} mb={3} fontWeight='bold'>Biography</Text>
      <Text fontSize='large' ml={10} mr={10} mb={10}>
        {userProfile.bio ? userProfile.bio : "No bio available"}
      </Text>
      <Divider />
      <Recipes />
    </div>
  );
}

export default Profile;