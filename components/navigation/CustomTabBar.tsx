import rufusIcon from "@/assets/images/rufus.png";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import React, { useEffect, useState } from "react";
import { Image, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const [tabBarWidth, setTabBarWidth] = useState(0);
  const tabWidth = tabBarWidth / state.routes.length;
  console.log("🚀 ~ CustomTabBar ~ tabWidth:", tabWidth);
  const translateX = useSharedValue(state.index * tabWidth);
  const indicatorPadding = 20;
  const indicatorWidth =
    tabWidth > 2 * indicatorPadding
      ? tabWidth - 2 * indicatorPadding
      : tabWidth;
  useEffect(() => {
    translateX.value = withTiming(state.index * tabWidth + indicatorPadding, {
      duration: 200,
    });
  }, [state.index, tabWidth, translateX]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  return (
    <View
      className="flex-row bg-white relative border-t border-gray-200"
      onLayout={(e) => setTabBarWidth(e.nativeEvent.layout.width)}
    >
      {tabBarWidth > 0 && (
        <Animated.View
          className={"absolute top-0 left-0 z-10 bg-dark h-1 rounded-b-lg"}
          style={[{ width: indicatorWidth }, indicatorStyle]}
        />
      )}
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };
        return (
          <PlatformPressable
            key={index}
            onPress={onPress}
            onLongPress={onLongPress}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            className="flex-1 justify-center items-center pb-safe py-2"
          >
            {options.tabBarIcon && route?.name !== "rufus" ? (
              options.tabBarIcon({
                focused: isFocused,
                color: isFocused ? "#000" : "#888",
                size: 24,
              })
            ) : (
              <Image source={rufusIcon} className="w-14 h-10" />
            )}
          </PlatformPressable>
        );
      })}
    </View>
  );
};

export default CustomTabBar;
