import { View, Text } from 'react-native'
import { StatusBar } from "expo-status-bar";
import React from 'react'
import { Redirect, Stack } from "expo-router";
import Loader from "@/components/Loader";
import { useGlobalContext } from "@/context/GlobalProvider";

const AuthLayout = () => {
  const { loading, isLogged, user } = useGlobalContext();
  console.log("loading", loading);
  console.log("user", user);
  console.log("isLogged", isLogged);

  if (!loading && isLogged) return <Redirect href="/home" />;
  
  return (
    <>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default AuthLayout;
