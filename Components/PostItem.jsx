import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  TextInput,
  BackHandler,
} from "react-native";
import { Avatar } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { server } from "../Redux/Store";
import axios from "axios";
import { useSelector } from "react-redux";
import Modal from "react-native-modal";

const PostItem = ({ post }) => {
  const { user } = useSelector((state) => state.user);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [newCommentText, setNewCommentText] = useState(""); // Add this state
  const [comments, setComments] = useState([]);

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
  const handleOpenComments = () => {
    setIsCommentOpen(true);
    fetchComments(); // Fetch when the modal is opened
  };

  const handleCloseComments = () => {
    setIsCommentOpen(false);
  };

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(
        `${server}/comment/${post._id}/comments`
      );
      setComments(data.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  const handleSubmitComment = async (newCommentText) => {
    try {
      const { data } = await axios.post(
        `${server}/comment/${post._id}/comments`,
        {
          text: newCommentText, // Assuming 'text' is what your backend expects
        }
      );

      // Success! Update comments locally
      setComments([data.comment, ...comments]); // Prepend
      setNewCommentText(""); // Clear the input field
    } catch (error) {
      console.error("Error submitting comment:", error);
      // Handle the error (e.g., display an error message)
    }
  };
  return (
    <View style={{ marginBottom: 20, margin: 10 }}>
      {isCommentOpen ? (
        <View style={{ width: "100%", height: "20px", zIndex: 100 }}>
          <MaterialCommunityIcons
            onPress={handleCloseComments}
            name="close"
            style={{ zIndex: 100 }}
          ></MaterialCommunityIcons>
        </View>
      ) : null}
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
          justifyContent: "flex-start",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Pressable onPress={handleLikePress}>
          <MaterialCommunityIcons
            name={liked ? "heart" : "heart-outline"}
            size={25}
            color={liked ? "red" : "black"}
          />
        </Pressable>
        <Pressable style={{marginLeft:7}} onPress={handleComment}>
        <MaterialCommunityIcons onPress={handleOpenComments} name="message-outline" size={24} />
        </Pressable>
      </View>
      <Text>{post.description}</Text>
      <Modal
        hasBackdrop={true}
        isVisible={isCommentOpen}
        onBackdropPress={handleCloseComments}
        style={{
          margin: 0,
          zIndex: 10,
        }} // Semi-transparent background
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            padding: 10,
            height: "80%",
          }}
        >
          <FlatList
            data={comments}
            renderItem={({ item }) => (
              <CommentItem comment={item} userId={user._id} />
            )}
            keyExtractor={(comment) => comment._id}
          />
          <KeyboardAvoidingView behavior="padding">
            <View style={{ flexDirection: "row", alignItems:"center" }}>
              <MaterialCommunityIcons
                onPress={handleCloseComments}
                name="close"
                size={27}
                style={{ zIndex: 100 }}
              ></MaterialCommunityIcons>
              <TextInput
                style={{ flex: 1 }}
                onChangeText={(text) => setNewCommentText(text)}
              />
              <TouchableOpacity
                onPress={() => handleSubmitComment(newCommentText)}
              >
                <Text>Submit</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
};

const CommentItem = ({ comment, userId }) => {
  const [liked, setLiked] = useState(comment.likes.includes(userId));
  const handleLikeComment = async () => {
    try {
      const { data } = await axios.post(
        `${server}/comment/${comment._id}/like`
      );
      setLiked(true);
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleUnlikeComment = async () => {
    try {
      const { data } = await axios.delete(
        `${server}/comment/${comment._id}/unlike`
      );
      setLiked(false);
    } catch (error) {
      console.error("Error unliking comment:", error);
    }
  };
  return (
    <View
      style={{
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Avatar.Image size={32} source={{ uri: "" }} />
        <Text style={{ fontWeight: "bold", marginLeft: 10 }}>
          {comment.createdBy.username} {/* Or any display name field */}
        </Text>
      </View>
      <View style={{ width: "75%" }}>
        <Text style={{ marginTop: 5 }}>{comment.text}</Text>
        <Text style={{ fontSize: 12, color: "gray", marginTop: 5 }}>
          {new Date(comment.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <Pressable>
        <MaterialCommunityIcons
          onPress={liked ? handleUnlikeComment : handleLikeComment}
          name={liked ? "heart" : "heart-outline"}
          size={20}
          color={liked ? "red" : "black"}
        />
      </Pressable>
    </View>
  );
};

export default PostItem;
