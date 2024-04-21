import * as client from "./client";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import { useEffect } from "react";
import { useColorMode } from "@chakra-ui/react";
export default function CurrentUser({ children }: { children: any }) {
  const dispatch = useDispatch();
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUser = await client.profile();
        if ((currentUser.siteTheme?.toLowerCase() || colorMode) !== colorMode) {
          toggleColorMode();
        }
        dispatch(setCurrentUser(currentUser));
      } catch (error) {
        dispatch(setCurrentUser(null));
      }
    };
    fetchCurrentUser();
  }, [dispatch, colorMode, toggleColorMode]);
  return children;
}
