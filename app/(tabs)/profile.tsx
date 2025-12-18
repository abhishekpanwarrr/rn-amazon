import amazonLogo from "@/assets/images/amazon-logo-white.png";
import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const Page = () => {
  const { signOut } = useAuth();
  const { user } = useUser();
  console.log("🚀 ~ Page ~ user:", user);
  return (
    <View className="flex-1">
      <Stack.Screen
        options={{
          headerLeft: () => (
            <Image
              source={amazonLogo}
              className="pl-3"
              style={{
                width: 100,
                height: 30,
              }}
            />
          ),
          headerRight: () => (
            <View className="flex-row items-center gap-6 pr-4">
              <Ionicons name="settings-outline" size={24} color={"white"} />
              <Ionicons name="search-outline" size={24} color={"white"} />
            </View>
          ),
        }}
      />
      <SignedOut>
        <View className="pt-10 px-8 items-center">
          <Text className="text-3xl text-center">
            Sign in for optimal experience
          </Text>
        </View>
        <View className="mt-8 w-full px-8">
          <Link href={"/signin"} asChild>
            <TouchableOpacity className="bg-primary py-3 border-dark">
              <Text className="text-center text-base">Sign in</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </SignedOut>
      <SignedIn>
        <View className="pt-10 px-8 items-center">
          <Text className="text-3xl text-center">You are signed in!</Text>
        </View>
        <View className="mt-8 w-full px-8 items-center">
          {user?.primaryEmailAddress?.emailAddress && (
            <Text className="text-lg text-black">
              Hello, {user?.primaryEmailAddress?.emailAddress}
            </Text>
          )}
          <TouchableOpacity
            className="bg-white border border-gray-300 rounded-full px-10 py-2 mt-3"
            onPress={() => signOut()}
          >
            <Text className="text-red-500 text-lg font-medium">Sign out</Text>
          </TouchableOpacity>
        </View>
      </SignedIn>
    </View>
  );
};

export default Page;
