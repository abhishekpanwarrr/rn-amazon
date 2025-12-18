import { useState } from "react";
import { Text, View } from "react-native";

export default function Index() {
  const [data, setData] = useState(null);
  // useEffect(() => {
  //   fetch(`${process.env.EXPO_PUBLIC_API_URL}/articles`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data);
  //       setData(data);
  //     });
  // }, []);
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-red-500">
        Edit app/index.tsx to edit this screen.
      </Text>
      {data && <Text className="mt-4">{JSON.stringify(data, null, 2)}</Text>}
    </View>
  );
}
