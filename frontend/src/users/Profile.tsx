import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { UserState } from "../store";
import { useToast } from "@chakra-ui/react";
import * as client from "./client";



function Profile() {
  const { userId } = useParams();
  const { currentUser } = useSelector((state: UserState) => state.users);
  const [userProfile, setUserProfile] = React.useState<User | null>(null);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (userId) {
      const fetchUserProfile = async () => {
        try {
          const userProfile = await client.otherProfile(userId);
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
          navigate('/home')
          setUserProfile(null);
        }
      };
      fetchUserProfile();
    } else {
      setUserProfile(currentUser);
    }
  }, [userId, currentUser, navigate, toast]);

  return (
    <div>
      <h1>Profile</h1>
      {userProfile && JSON.stringify(userProfile)}
    </div>
  );
}

export default Profile;