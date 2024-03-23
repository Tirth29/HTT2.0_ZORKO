import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Pressable } from "react-native";
import { Avatar } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { server } from "../Redux/Store";
import axios from "axios";
import { useSelector } from "react-redux";

const PostItem = ({ post }) => {
  const { user } = useSelector((state) => state.user);
  //   console.log(user);
  const [liked, setLiked] = useState(post.likes.includes(user._id));
  //   console.log(user._id);
  const handleLike = async () => {
    // Implement like functionality
    // console.log(post._id);
    // console.log(${server}/${post._id}/like);
    try {
      const { data } = await axios.post(`${server}/post/${post._id}/like`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      //   console.log(data);
      setLiked(true);
    } catch (e) {
      console.log(e);
    }
    // console.log("Liked post:", post.title);
  };
  const handleUnlike = async () => {
    try {
      //   console.log("unlike");
      const { data } = await axios.delete(`${server}/post/${post._id}/unlike`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      //   console.log(data);
      setLiked(false); // Set liked to false after successful unlike
    } catch (e) {
      console.log(e);
    }
  };
  const handleLikePress = () => {
    if (liked) {
      handleUnlike();
    } else {
      handleLike();
    }
  };

  const handleComment = () => {
    // Implement comment functionality
    console.log("Commented on post:", post.title);
  };

  return (
    <View style={{ marginBottom: 20, margin: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        {post.title}
      </Text>
      <Image
        source={{ uri: post.image }}
        style={{ width: "100%", height: 200, marginBottom: 10 }}
        resizeMode="cover"
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Pressable onPress={handleLikePress}>
          <MaterialCommunityIcons
            name={liked ? "heart" : "heart-outline"}
            size={32}
            color={liked ? "red" : "black"}
          />
        </Pressable>
        <TouchableOpacity onPress={handleComment}>
          <Text style={{ color: "blue", fontSize: 16 }}>Comment</Text>
        </TouchableOpacity>
      </View>
      <Text>{post.description}</Text>
    </View>
  );
};

export default PostItem;
