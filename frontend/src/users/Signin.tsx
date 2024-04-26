import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import * as client from "./client";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import { ChevronDownIcon } from "@chakra-ui/icons";

function Signin({
  isOpen,
  onClose,
  isSignUp,
}: {
  isOpen: boolean;
  onClose: () => void;
  isSignUp: boolean;
}) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [userType, setUserType] = useState<UserType>("FOODIE");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const toast = useToast();

  const userTypeExplanation = {
    FOODIE: "Looking to discover recipes",
    CHEF: "Looking to publish recipes",
  };

  const readyToSignIn = username.length > 0 && password.length > 0;
  const readyToSignUp = readyToSignIn && password === passwordConfirm;

  const handleClose = () => {
    setUsername("");
    setPassword("");
    setPasswordConfirm("");
    setUserType("FOODIE");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsLoading(false);
    onClose();
  };

  const sendCreds = async () => {
    setIsLoading(true);
    if (isSignUp) {
      if (password !== passwordConfirm) {
        toast({
          title: "Passwords do not match",
          description: "Please try again",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setIsLoading(false);
        return;
      }
      try {
        const user = await client.signup(
          username,
          password,
          userType,
          colorMode.toUpperCase() as SiteTheme,
        );
        dispatch(setCurrentUser(user));
        toast({
          title: "Account created",
          description: "You have successfully signed up",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setIsLoading(false);
        handleClose();
      } catch (error) {
        toast({
          title: "Failed to sign up",
          description: "Please try again",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setIsLoading(false);
      }
    } else {
      try {
        const user = await client.signin(username, password);
        if (colorMode !== (user.siteTheme?.toLowerCase() || colorMode)) {
          toggleColorMode();
        }
        dispatch(setCurrentUser(user));
        toast({
          title: "Signed in",
          description: "You have successfully signed in",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setIsLoading(false);
        handleClose();
      } catch (error) {
        toast({
          title: "Failed to sign in",
          description: "Please try again",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setIsLoading(false);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isSignUp ? "Sign up for RecipeBook" : "Sign in"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="jappleseed"
            />
          </FormControl>
          <FormControl isRequired>
            <br />
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="************"
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
          </FormControl>
          {isSignUp && (
            <>
              <br />
              <FormControl isRequired isInvalid={password !== passwordConfirm}>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="************"
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>Passwords do not match</FormErrorMessage>
              </FormControl>
              <br />
              <FormControl isRequired>
                <FormLabel>Account Type</FormLabel>
                <Menu>
                  <MenuButton
                    as={Button}
                    width="100%"
                    textAlign={"start"}
                    rightIcon={<ChevronDownIcon boxSize={6} />}
                    variant="outline"
                  >
                    {userType === "FOODIE" ? "Foodie" : "Chef"}
                  </MenuButton>
                  <MenuList width="100%">
                    <MenuItem
                      width="100%"
                      title={userTypeExplanation["FOODIE"]}
                      onClick={() => setUserType("FOODIE")}
                    >
                      Foodie
                    </MenuItem>
                    <MenuItem
                      width="100%"
                      title={userTypeExplanation["CHEF"]}
                      onClick={() => setUserType("CHEF")}
                    >
                      Chef
                    </MenuItem>
                  </MenuList>
                </Menu>
                <FormHelperText>{userTypeExplanation[userType]}</FormHelperText>
              </FormControl>
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            Close
          </Button>
          <Button
            colorScheme="blue"
            onClick={sendCreds}
            isDisabled={isSignUp ? !readyToSignUp : !readyToSignIn}
            isLoading={isLoading}
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default Signin;
