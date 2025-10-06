import Heading from "@/components/Heading";
import TagSelector from "@/components/TagSelector";
import { useRouter } from "expo-router";
import {
  EllipsisVertical,
  Heart,
  MessageCircle,
  Plus,
  SlidersHorizontal,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

export default function CommunityScreen() {
  const router = useRouter();

  const currentUserId = "u1";
  const [posts, setPosts] = useState([
    {
      id: "p1",
      userId: "u1",
      username: "user 01234567",
      createdAt: "2025-01-01 12:20:20",
      content: "Tôi vui lắm",
      likes: 10,
      comments: 10,
      isInterested: false,
      isLiked: false,
    },
    {
      id: "p2",
      userId: "u2",
      username: "user 987654321",
      createdAt: "2025-01-02 10:15:00",
      content: "Hôm nay trời đẹp",
      likes: 2,
      comments: 1,
      isInterested: true,
      isLiked: true,
    },
  ]);

  const [filterVisible, setFilterVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const handleCancel = () => {
    setShowConfirm(true);
  };

  const handleDelete = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setMenuVisible(false);
    setShowConfirm(false);
  };

  const handleToggleInterested = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, isInterested: !p.isInterested } : p
      )
    );
    setMenuVisible(false);

    const post = posts.find((p) => p.id === id);
    if (post?.isInterested) {
      ToastAndroid.show(
        "You will see fewer posts like this.",
        ToastAndroid.SHORT
      );
    } else {
      ToastAndroid.show(
        "You will see more posts like this.",
        ToastAndroid.SHORT
      );
    }
  };

  const handleToggleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              isLiked: !p.isLiked,
              likes: p.isLiked ? p.likes - 1 : p.likes + 1,
            }
          : p
      )
    );
  };

  return (
    <View className="flex-1 bg-[#FAF9FF]">
      {/* Heading */}
      <Heading title="Forum" />

      {/* Body */}
      <View className="flex-1 px-4 mt-4">
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 120, // tránh đè nút Add
            gap: 12,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Filter */}
          <TouchableOpacity
            className="flex-row justify-end items-center mb-4"
            onPress={() => setFilterVisible(true)}
          >
            <Text className="text-black font-[Montserrat-Bold] text-xs mr-2">
              Filter
            </Text>
            <SlidersHorizontal width={20} height={20} color="black" />
          </TouchableOpacity>

          {/* Posts */}
          {posts.map((post) => (
            <View
              key={post.id}
              className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#EEEEEE]"
            >
              {/* Header */}
              <View className="flex-row justify-between items-start">
                <View>
                  <Text className="text-black font-[Montserrat-SemiBold] text-base">
                    {post.username}
                  </Text>
                  <Text className="text-[#7B7B7B] font-[Montserrat-Regular] text-sm mt-1">
                    {post.createdAt}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedPost(post);
                    setMenuVisible(true);
                  }}
                >
                  <EllipsisVertical width={20} height={20} color="black" />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push("/(tabs)/community/comment")}
              >
                <Text className="text-base mt-3 font-[Montserrat-Regular]">
                  {post.content}
                </Text>
              </TouchableOpacity>

              {/* Interaction */}
              <View className="flex-row mt-3 gap-6">
                <TouchableOpacity
                  className="flex-row items-center gap-1"
                  onPress={() => handleToggleLike(post.id)}
                >
                  <Heart
                    width={18}
                    height={18}
                    color={post.isLiked ? "red" : "black"} // đổi màu khi like
                    fill={post.isLiked ? "red" : "transparent"} // trái tim đầy
                  />
                  <Text className="text-black text-sm font-[Montserrat-Regular]">
                    {post.likes}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-row items-center gap-1"
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/community/comment",
                      params: { focusInput: "true" }, // 👈 truyền param
                    })
                  }
                >
                  <MessageCircle width={18} height={18} color="black" />
                  <Text className="text-black text-sm font-[Montserrat-Regular]">
                    {post.comments}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Floating Add Button */}
      <TouchableOpacity
        className="absolute bg-[#7F56D9] bottom-6 right-6 w-16 h-16 shadow-lg p-4 items-center rounded-full overflow-hidden"
        onPress={() => router.push("/(tabs)/community/confirm")}
      >
        <Plus width={24} height={24} color="white" />
      </TouchableOpacity>

      {/* Filter Modal */}
      <Modal
        visible={filterVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterVisible(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center">
          <View className="w-80 bg-white p-6 rounded-2xl">
            <Text className="text-lg font-[Montserrat-Bold] mb-4">Sort</Text>
            <TagSelector
              options={[
                { id: 2025, name: "2025" },
                { id: 2024, name: "2024" },
                { id: 2023, name: "2023" },
              ]}
              multiSelect={false}
              onChange={(ids) => console.log("Years:", ids)}
            />
            {/* Close Button */}
            <Pressable
              className="mt-4 bg-[#7F56D9] py-2 rounded-xl"
              onPress={() => setFilterVisible(false)}
            >
              <Text className="text-center text-white font-[Montserrat-Bold]">
                Apply
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-2xl p-4">
            {selectedPost?.userId === currentUserId ? (
              <>
                <Pressable onPress={handleCancel}>
                  <Text className="text-red-500 text-lg font-[Montserrat-Bold] text-center">
                    Delete
                  </Text>
                </Pressable>
                {/* <Pressable onPress={() => handleEdit(selectedPost.id)}>
                  <Text className="text-lg mt-2">Chỉnh sửa</Text>
                </Pressable> */}
              </>
            ) : (
              <Pressable
                onPress={() => handleToggleInterested(selectedPost.id)}
              >
                <Text className="text-lg text-center">
                  {selectedPost?.isInterested ? "Ignore" : "Interested"}
                </Text>
              </Pressable>
            )}
            {/* <Pressable onPress={() => handleShare(selectedPost.id)}>
              <Text className="text-lg mt-2">Chia sẻ</Text>
            </Pressable> */}
            <Pressable onPress={() => setMenuVisible(false)}>
              <Text className="text-center font-[Montserrat-Bold] mt-4">
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={showConfirm}
        onRequestClose={() => setShowConfirm(false)}
      >
        <View className="flex-1 bg-black/60 justify-center items-center">
          <View className="bg-white w-4/5 rounded-2xl p-6 items-center">
            <Text className="text-lg font-[Montserrat-SemiBold] mb-6 text-gray-800">
              Are you sure you want to delete this post?
            </Text>
            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={() => {
                  setShowConfirm(false);
                  setMenuVisible(false);
                }}
                className="bg-gray-300 px-8 py-4 rounded-xl"
              >
                <Text className="text-base font-[Montserrat-SemiBold] text-gray-800">
                  No
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(selectedPost.id)}
                className="bg-red-500 px-8 py-4 rounded-xl"
              >
                <Text className="text-base font-[Montserrat-SemiBold] text-white">
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}