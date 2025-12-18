import { StyledStack } from "@/components/navigation/stack";
import "@/global.css";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Ionicons } from "@expo/vector-icons";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import { Text, TouchableOpacity, useColorScheme } from "react-native";

const queryClient = new QueryClient();

const IntialLayout = () => {
  const router = useRouter();
  return (
    <StyledStack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="signin"
        options={{
          title: "Amazon",
          presentation: "fullScreenModal",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.dismiss()}>
              <Text className="dark:text-white text-lg">Cancel</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="(modal)/rufus"
        options={{
          title: "Rufus",
          headerTintColor: "#000",
          presentation: "formSheet",
          headerStyle: {
            backgroundColor: "#ffffff",
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.dismiss()}>
              {/* <Text className="text-white text-lg">Cancel</Text> */}
              <Ionicons name="close" size={24} color={"text-gray-400"} />
            </TouchableOpacity>
          ),
          sheetAllowedDetents: [0.45, 0.95],
          sheetInitialDetentIndex: 0,
          sheetGrabberVisible: true,
          contentStyle: {
            backgroundColor: "#ffffff",
          },
        }}
      />
    </StyledStack>
  );
};

const RootLayout = () => {
  const colorScheme = useColorScheme();
  console.log("🚀 ~ RootLayout ~ colorScheme:", colorScheme);
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <IntialLayout />
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default RootLayout;
