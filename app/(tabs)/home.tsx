import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, FlatList, Image, RefreshControl, Text, View } from "react-native";

import { images } from "../../constants";
import { usePostStore } from "@/store/usePostStore";
import { SearchInput } from "@/components/SearchInput";
import { EmptyState } from "@/components/EmptyState";
import { Trending } from "@/components/Trending";
import { VideoCard } from "@/components/VideoCard";
import { CustomButton } from "@/components/CustomButton";

const Home = () => {
  const { posts, fetchAllPosts, loading: loadingAllPosts, error: errorAllPosts, latestPosts, fetchLatestPosts, loading: loadingLatestPosts, error: errorLatestPosts } = usePostStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAllPosts();
    fetchLatestPosts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllPosts();
    await fetchLatestPosts();
    setRefreshing(false);
  };

  const loading = loadingAllPosts || loadingLatestPosts;
  const error = errorAllPosts || errorLatestPosts;

  if (loading) {
    return (
      <SafeAreaView className="bg-primary h-full flex justify-center items-center">
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="text-white mt-4">Loading videos...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="bg-primary h-full flex justify-center items-center">
        <Text className="text-red-500 text-lg">Failed to load videos.</Text>
        <CustomButton title="Retry" handlePress={() => { fetchAllPosts(); fetchLatestPosts(); }} containerStyles="mt-4" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator.username}
            avatar={item.creator.avatar}
          />
        )}
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  JSMastery
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>

            <SearchInput />

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-lg font-pregular text-gray-100 mb-3">
                Latest Videos
              </Text>

              {/* <Trending posts={latestPosts ?? []} /> */}
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos created yet"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;