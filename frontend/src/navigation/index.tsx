"use client";

import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Avatar,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuGroup,
  useToast,
  useColorMode,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MoonIcon,
  SunIcon,
} from "@chakra-ui/icons";
import Signin from "../users/Signin";
import { UserState } from "../store";
import * as client from "../users/client";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCurrentUser } from "../users/reducer";
import { useState } from "react";

export default function Navbar() {
  const hamburger = useDisclosure();
  const signinModal = useDisclosure();
  const signupModal = useDisclosure();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { currentUser } = useSelector((state: UserState) => state.users);
  const { colorMode, toggleColorMode } = useColorMode();
  const [ colorModeLoading, setColorModeLoading ] = useState<boolean>(false);

  const handleSignout = async () => {
    try {
      await client.signout();
      dispatch(setCurrentUser(null));
      navigate("/home");
      toast({
        title: "Signed out",
        description: "You have been signed out",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to sign out",
        description: "Please try again",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleToggleColorMode = async () => {
    try {
      setColorModeLoading(true);
      if (currentUser) {
        await client.updateProfile({
          ...currentUser,
          siteTheme: currentUser.siteTheme === "LIGHT" ? "DARK" : "LIGHT",
        });
      }
      toggleColorMode();
      setColorModeLoading(false);
    } catch (error) {
      toast({
        title: "Failed to update color mode",
        description: "Please try again",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setColorModeLoading(false);
    }
  };

  // pick first name if avaliable for greeting
  const greeting = currentUser
    ? (currentUser.firstName
        ? `Hi, ${currentUser.firstName}`
        : `Hi, ${currentUser.username}`
      )
    : "";

  const endContent = currentUser ? (
    <Menu isLazy variant="filled">
      <MenuButton>
        <Avatar size="sm" />
      </MenuButton>
      <MenuList>
        <MenuGroup title={greeting}>
          <MenuItem onClick={() => navigate("/user/profile")}>Profile</MenuItem>
          <MenuItem onClick={() => navigate("/user/profile/edit")}>
            Settings
          </MenuItem>
          <MenuItem onClick={handleSignout}>Sign Out</MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  ) : (
    <>
      <Button
        fontSize={"sm"}
        fontWeight={400}
        variant={"link"}
        onClick={signinModal.onOpen}
      >
        Sign In
      </Button>
      <Button
        fontSize={"sm"}
        fontWeight={600}
        colorScheme="blue"
        onClick={signupModal.onOpen}
      >
        Sign Up
      </Button>
      <Signin
        isOpen={signinModal.isOpen}
        onClose={signinModal.onClose}
        isSignUp={false}
      />
      <Signin
        isOpen={signupModal.isOpen}
        onClose={signupModal.onClose}
        isSignUp={true}
      />
    </>
  );

  return (
    <Box>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={hamburger.onToggle}
            icon={
              hamburger.isOpen ? (
                <CloseIcon w={3} h={3} />
              ) : (
                <HamburgerIcon w={5} h={5} />
              )
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex
          flex={{ base: 1 }}
          justify={{ base: "center", md: "start" }}
          alignItems={"center"}
        >
          <Button
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
            fontFamily={"heading"}
            fontSize={"large"}
            variant={"ghost"}
            color={useColorModeValue("gray.800", "white")}
            onClick={() => navigate("/home")}
          >
            <strong>RecipeBook</strong>
          </Button>

          <Flex display={{ base: "none", md: "flex" }} pl={1}>
            <DesktopNav />
          </Flex>
        </Flex>
        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={5}
        >
          <IconButton
            display={{ base: "none", md: "inline-flex" }}
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={handleToggleColorMode}
            variant="ghost"
            isLoading={colorModeLoading}
            aria-label="Toggle color mode"
          />
          {endContent}
        </Stack>
      </Flex>

      <Collapse in={hamburger.isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.700");
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: UserState) => state.users);

  return (
    <Stack direction={"row"} spacing={1}>
      {NAV_ITEMS.filter((navItem) => {
        return !navItem.userType || navItem.userType === currentUser?.type || (navItem.userType === "ANY" && currentUser);
      }).map((navItem, idx) => (
        <Box key={idx}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <Box
                as={Button}
                p={2}
                variant={"ghost"}
                fontSize={"sm"}
                px={4}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                }}
                onClick={() => navItem.href && navigate(navItem.href)}
              >
                {navItem.label}
              </Box>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={"xl"}
                bg={popoverContentBgColor}
                p={4}
                rounded={"xl"}
                minW={"sm"}
              >
                <Stack>
                  {navItem.children
                    .filter((child) => {
                      return (
                        !child.userType || child.userType === currentUser?.type || (child.userType === "ANY" && currentUser)
                      );
                    })
                    .map((child) => (
                      <DesktopSubNav key={child.label} {...child} />
                    ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  const navigate = useNavigate();
  return (
    <Box
      as="a"
      onClick={() => navigate(href || "")}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: useColorModeValue("blue.50", "gray.900"), cursor: "pointer" }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: "blue.400" }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"blue.400"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Box>
  );
};

const MobileNav = () => {
  const { currentUser } = useSelector((state: UserState) => state.users);

  return (
    <Stack
      bg={useColorModeValue("white", "gray.700")}
      p={4}
      display={{ md: "none" }}
    >
      {NAV_ITEMS.filter(
        (navItem) => !navItem.userType || navItem.userType === currentUser?.type || (navItem.userType === "ANY" && currentUser)
      ).map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: UserState) => state.users);

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Box
        py={2}
        as="a"
        onClick={() => navigate(href || "")}
        justifyContent="space-between"
        alignItems="center"
        _hover={{
          textDecoration: "none",
          cursor: "pointer",
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Box>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
          _hover={{ cursor: "pointer" }}
        >
          {children &&
            children.filter(
              (child) => !child.userType || child.userType === currentUser?.type || (child.userType === "ANY" && currentUser)
            ).map((child) => (
              <Box
                as="a"
                key={child.label}
                py={2}
                onClick={() => navigate(child.href || "")}
              >
                {child.label}
              </Box>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
  userType?: UserType | "ANY";
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Recipes",
    children: [
      {
        label: "Explore Popular",
        subLabel: "Trending Recipes to enjoy",
        href: "/browse/recipes?type=top&dir=dsc",
      },
      {
        label: "Your Recipes",
        subLabel: "Recipes you've created or liked",
        href: "/user/recipes",
        userType: "ANY"
      },
      {
        label: "Create Recipe",
        subLabel: "Create or import your own recipe",
        href: "/recipe/create",
        userType: "CHEF",
      },
    ],
  },
  {
    label: "Chefs",
    href: "/browse/chefs?by=followers&dir=dsc",
  },
  {
    label: "Nutrition",
    href: "/nutrition",
  },
  {
    label: "Search",
    href: "/search",
  },
];
