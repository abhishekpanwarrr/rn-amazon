import { getArticles } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const dummyHeros = [
  { id: 1, name: "Home when you are away ", color: "#0000ff" },
  { id: 2, name: "New Tech new possiblities", color: "#00ff00" },
];
export default function Index() {
  const {
    data: articles,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["articles"],
    queryFn: getArticles,
  });
  const scrollOffset = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (event.contentOffset.y > 50) {
        scrollOffset.value = 50 - event.contentOffset.y;
      } else {
        scrollOffset.value = 0;
      }
    },
  });

  const scrollStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: scrollOffset.value }],
    };
  });
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
        <Text>Loading articles....</Text>
      </View>
    );
  }
  if (isError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error loading articles: {(error as Error).message}</Text>
      </View>
    );
  }
  return (
    <>
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="flex-1 flex-row items-center p-4 gap-6"
        className="absolute top-[118px] w-full h-14 bg-dark left-0"
        style={scrollStyle}
      >
        <View className="flex-row items-center">
          <Ionicons name="location-outline" size={24} className="text-white" />
          <Text className="text-white text-lg font-bold">123401</Text>
        </View>
        {["Alexa", "Prime", "Video", "Music", "Books"].map((item) => (
          <TouchableOpacity key={item}>
            <Text className="text-white text-md font-semibold">{item}</Text>
          </TouchableOpacity>
        ))}
      </Animated.ScrollView>
      <Animated.FlatList
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        data={[1]}
        style={{
          zIndex: -1,
        }}
        contentContainerStyle={{
          paddingTop: 105,
        }}
        ListHeaderComponent={() => (
          <>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              className="flex-1 mb-10"
            >
              {dummyHeros.map((hero) => (
                <View
                  key={hero.id}
                  style={{
                    width: Dimensions.get("window").width,
                    height: 250,
                    backgroundColor: hero.color,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text className="text-white text-center font-bold text-3xl">
                    {hero.name}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </>
        )}
        renderItem={() => (
          <View className="mx-4">
            {articles && (
              <FlatList
                data={[...articles]}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={() => (
                  <Text className="text-2xl font-bold mb-4">
                    Top picks for you
                  </Text>
                )}
                renderItem={({ item }) => (
                  <Link
                    href={`/(tabs)/(index)/${item.id}`}
                    asChild
                    style={{ marginBottom: 10 }}
                  >
                    <TouchableOpacity className="flex-row items-center gap-4 flex-wrap">
                      <Image
                        source={{ uri: item.imageUrl }}
                        className="rounded-lg w-28 h-28"
                      />
                      <View className="flex-1">
                        <Text className="text-lg font-bold">{item.title}</Text>
                        <Text className="text-sm text-gray-500">
                          {item.description}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </Link>
                )}
              />
            )}
          </View>
        )}
      />
    </>
  );
}
