import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  FormControl,
  FormLabel,
  Input,
  Textarea,
  InputGroup,
  InputRightElement,
  Center,
  Spinner,
} from "@chakra-ui/react";
import * as client from "./client";
import { setCurrentUser } from "./reducer";

function ProfileEdit() {
  const { currentUser } = useSelector((state: UserState) => state.users);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirm, setShowPasswordConfirm] =
    useState<boolean>(false);
  const [passwordConfirm, setPasswordConfirm] = useState<string | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    if (currentUser) {
      setUserProfile(currentUser);
    }
    setIsLoading(false);
  }, [currentUser, navigate]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (!currentUser || !userProfile) {
        throw new Error("User not found");
      }
      if (passwordConfirm !== userProfile.password) {
        throw new Error("Passwords do not match");
      }
      const updatedUser = await client.updateProfile(userProfile);
      dispatch(setCurrentUser(updatedUser));
      toast({
        title: "Profile updated",
        description: "Your profile has been updated",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/user/profile");
    } catch (error) {
      console.error("Error updating user profile", error);
      toast({
        title: "Error updating user profile",
        description: "An error occurred while updating your profile",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setIsSaving(false);
  };

  const saveButton = (
    <Button
      isLoading={isSaving}
      m={0}
      onClick={handleSave}
      colorScheme="blue"
      title={
        userProfile?.password !== passwordConfirm
          ? "Passwords do not match"
          : "Save changes to your profile"
      }
      isDisabled={userProfile?.password !== passwordConfirm}
    >
      Save
    </Button>
  );

  const cancelButton = (
    <Button
      m={0}
      mr={2}
      onClick={() => navigate(-1)}
      colorScheme="red"
      title="Discard changes and return to profile"
    >
      Cancel
    </Button>
  );

  const desktopHeader = (
    <HStack w="full" mt={5} mb={4} display={{ base: "none", md: "flex" }}>
      <Heading
        position="absolute"
        left="50%"
        transform="translateX(-50%)"
        zIndex="1"
        size="xl"
        mt={5}
        mb={3}
      >
        Edit Profile
      </Heading>
      <Spacer />
      <Box h="40px" mr={5}>
        {cancelButton}
        {saveButton}
      </Box>
    </HStack>
  );

  const mobileHeader = (
    <VStack display={{ base: "flex", md: "none" }}>
      <Heading size="xl" mt={5} mb={0}>
        Edit Profile
      </Heading>
      <HStack>
        {cancelButton}
        {saveButton}
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

  if (!isLoading && !currentUser) {
    return (
      <Center mt={20}>
        <Text fontSize="xl" m={5} ml={8} mb={3} fontWeight="bold">
          Please sign in to edit your profile
        </Text>
      </Center>
    );
  }

  return (
    userProfile && (
      <div>
        <VStack w="full">
          {desktopHeader}
          {mobileHeader}
          <Divider />
          <Box m={5} w="80%">
            <Text fontSize="lg" fontWeight="bold">
              Public Information
            </Text>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                value={userProfile.username}
                placeholder='Chef "Gordon Ramsay"'
                title="Your public username, visible to other users"
                onChange={(e) =>
                  setUserProfile({ ...userProfile, username: e.target.value })
                }
              />
            </FormControl>
            <FormControl mt={5}>
              <FormLabel>Biography</FormLabel>
              <Textarea
                value={userProfile.bio ?? ""}
                placeholder="The best chef in the world"
                title="A short description of yourself and your food journey"
                onChange={(e) =>
                  setUserProfile({ ...userProfile, bio: e.target.value })
                }
              />
            </FormControl>
          </Box>
          <Divider my={5} />
          <Box mx={5} w="80%">
            <Text fontSize="lg" fontWeight="bold">
              Private Information
            </Text>
            <FormControl mt={5}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={userProfile.password ?? ""}
                  title="Your private password, used to log in to your account"
                  onChange={(e) => {
                    if (e.target.value !== "") {
                      setUserProfile({
                        ...userProfile,
                        password: e.target.value,
                      });
                    } else {
                      const { password, ...rest } = userProfile;
                      setUserProfile(rest);
                    }
                  }}
                  placeholder="************"
                  isInvalid={passwordConfirm !== userProfile.password}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>

              <InputGroup mt={1}>
                <Input
                  type={showPasswordConfirm ? "text" : "password"}
                  value={passwordConfirm ?? ""}
                  onChange={(e) =>
                    setPasswordConfirm(
                      e.target.value !== "" ? e.target.value : undefined,
                    )
                  }
                  placeholder="************"
                  title="Confirm your new password by typing it again"
                  isInvalid={passwordConfirm !== userProfile.password}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  >
                    {showPasswordConfirm ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormLabel mt={1} htmlFor="confirm password">
                Confirm Password
              </FormLabel>
            </FormControl>
            <FormControl mt={5}>
              <FormLabel>Email</FormLabel>
              <Input
                value={userProfile.email ?? ""}
                title="Your private email address, used for account recovery and notifications"
                placeholder="gramsay@gmail.com"
                onChange={(e) =>
                  setUserProfile({ ...userProfile, email: e.target.value })
                }
              />
            </FormControl>
            <FormControl mt={5}>
              <FormLabel>First Name</FormLabel>
              <Input
                value={userProfile.firstName ?? ""}
                placeholder="Gordon"
                title="Your private first name, used for personalization"
                onChange={(e) =>
                  setUserProfile({ ...userProfile, firstName: e.target.value })
                }
              />
            </FormControl>
            <FormControl mt={5}>
              <FormLabel>Last Name</FormLabel>
              <Input
                value={userProfile.lastName ?? ""}
                placeholder="Ramsay"
                title="Your private last name, used for personalization"
                onChange={(e) =>
                  setUserProfile({ ...userProfile, lastName: e.target.value })
                }
              />
            </FormControl>
          </Box>
          <Divider />
        </VStack>
      </div>
    )
  );
}

export default ProfileEdit;
