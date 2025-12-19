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
import * as Sentry from "@sentry/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import { cssInterop } from "nativewind";
import { Text, TouchableOpacity, useColorScheme } from "react-native";

Sentry.init({
  dsn: "https://ab584b23dcea2ba5021e85ff6d3542c5@o4508993007058944.ingest.de.sentry.io/4510561989558352",

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

cssInterop(Ionicons, {
  className: {
    target: false,
    nativeStyleToProp: {
      color: true,
    },
  },
});
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

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

export default Sentry.wrap(RootLayout);
