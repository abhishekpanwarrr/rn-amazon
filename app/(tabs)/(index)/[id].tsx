import SearchBar from "@/components/SearchBar";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View>
      <Stack.Screen
        options={{
          headerLeft: () => <SearchBar withBackButton />,
        }}
      />
      <Text className="text-black text-3xl mt-[150px]">Page {id}</Text>
    </View>
  );
};

export default Page;
