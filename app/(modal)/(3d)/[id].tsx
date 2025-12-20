import { getArticleById } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Dimensions, Text, View } from "react-native";
import {
  Camera,
  DefaultLight,
  FilamentScene,
  FilamentView,
  Model,
  useCameraManipulator,
} from "react-native-filament";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";

const Page = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["article", id],
    queryFn: () => getArticleById(+id),
  });
  console.log("🚀 ~ Page ~ data:", data);

  const cameraManipulator = useCameraManipulator({
    orbitHomePosition: [0, 0, 8], // "Camera location"
    targetPosition: [0, 0, 0], // "Looking at"
    orbitSpeed: [0.003, 0.003],
  });

  // Pan gesture
  const viewHeight = Dimensions.get("window").height;
  const panGesture = Gesture.Pan()
    .onBegin((event) => {
      const yCorrected = viewHeight - event.translationY;
      cameraManipulator?.grabBegin(event.translationX, yCorrected, false); // false means rotation instead of translation
    })
    .onUpdate((event) => {
      const yCorrected = viewHeight - event.translationY;
      cameraManipulator?.grabUpdate(event.translationX, yCorrected);
    })
    .maxPointers(1)
    .onEnd(() => {
      cameraManipulator?.grabEnd();
    });

  // Scale gesture
  const previousScale = useSharedValue(1);
  const scaleMultiplier = 100;
  const pinchGesture = Gesture.Pinch()
    .onBegin(({ scale }) => {
      previousScale.value = scale;
    })
    .onUpdate(({ scale, focalX, focalY }) => {
      const delta = scale - previousScale.value;
      cameraManipulator?.scroll(focalX, focalY, -delta * scaleMultiplier);
      previousScale.value = scale;
    });
  const combinedGesture = Gesture.Race(pinchGesture, panGesture);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
        <Text className="text-black text-xl font-semibold">
          Loading 3D Model...
        </Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">
          Error loading 3D Model: {error?.message}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <Stack.Screen
        options={{
          title: `3D View ${id}`,
          headerLeft: () => (
            <Ionicons
              onPress={() => router.back()}
              name="arrow-back"
              size={28}
            />
          ),
        }}
      />

      {data?.glbUrl && (
        <GestureDetector gesture={combinedGesture}>
          {/* 🏞️ A view to draw the 3D content to */}
          <FilamentView style={{ flex: 1 }}>
            {/* 💡 A light source, otherwise the scene will be black */}
            <Camera cameraManipulator={cameraManipulator} />
            <DefaultLight />

            {/* 📦 A 3D model */}
            <Model source={{ uri: data?.glbUrl }} transformToUnitCube />

            {/* 📹 A camera through which the scene is observed and projected onto the view */}
            <Camera />
          </FilamentView>
        </GestureDetector>
      )}
      {data?.glbUrl == null && (
        <View className="flex-1 items-center justify-center">
          <Text className="text-black text-xl font-semibold">
            No 3D model available for this article.
          </Text>
        </View>
      )}
    </View>
  );
};

export default function Scene() {
  return (
    <View className="flex-1">
      <FilamentScene>
        <Page />
      </FilamentScene>
    </View>
  );
}
