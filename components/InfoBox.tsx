import { View, Text } from "react-native";

type infoBoxProps = {
  title: number | string;
  subtitle?: string;
  containerStyles?: string;
  titleStyles?: string;
}

export const InfoBox = ({ title, subtitle, containerStyles, titleStyles }: infoBoxProps) => {
  return (
    <View className={containerStyles}>
      <Text className={`text-white text-center font-psemibold ${titleStyles}`}>
        {title}
      </Text>
      <Text className="text-sm text-gray-100 text-center font-pregular">
        {subtitle}
      </Text>
    </View>
  );
};
