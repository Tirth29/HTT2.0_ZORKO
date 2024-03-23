import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PostItem from "../Components/PostItem";
import { ScrollView } from "react-native-gesture-handler";
import { server } from "../Redux/Store";
import axios from "axios";
// Mock posts data
// const mockPosts = [
//   {
//     id: 1,
//     title: "Post 1",
//     description: "Description for post 1",
//     image:
//       "https://www.shutterstock.com/image-photo/classic-hamburger-stock-photo-isolated-600nw-2282033179.jpg",
//     likes: 15,
//     createdAt: new Date("2024-01-23"),
//   },
//   {
//     id: 2,
//     title: "Post 2",
//     description: "Description for post 2",
//     image:
//       "https://www.shutterstock.com/image-photo/classic-hamburger-stock-photo-isolated-600nw-2282033179.jpg",
//     likes: 100,
//     createdAt: new Date("2024-02-22"),
//   },
//   {
//     id: 3,
//     title: "Post 3",
//     description: "Description for post 2",
//     image:
//       "https://www.shutterstock.com/image-photo/classic-hamburger-stock-photo-isolated-600nw-2282033179.jpg",
//     likes: 150,
//     createdAt: new Date("2024-03-22"),
//   },
//   {
//     id: 4,
//     title: "Post 4",
//     description: "Description for post 2",
//     image:
//       "https://www.shutterstock.com/image-photo/classic-hamburger-stock-photo-isolated-600nw-2282033179.jpg",
//     likes: 1,
//     createdAt: new Date("2024-03-22"),
//   },
//   // Add more mock posts as needed
// ];

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filter, setFilter] = useState("recent"); // Default filter
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch posts from backend upon component mount
    async function fetchData() {
      //   console.log("posts");
      try {
        const { data } = await axios.get(`${server}/post/posts`);
        // console.log(data);
        setPosts(data.posts);
        setFilteredPosts(data.posts);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, []);

  const handleFilter = (type) => {
    let sortedPosts = [...posts];

    if (type === "recent") {
      sortedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (type === "oldest") {
      sortedPosts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (type === "mostLiked") {
      sortedPosts.sort((a, b) => b.likes.length - a.likes.length);
    } else if (type === "leastLiked") {
      //   sortedPosts.sort((a, b) => a.likes.length - b.likes.length);
      sortedPosts.sort((a, b) => b.likes.length - a.likes.length);
      sortedPosts.reverse();
    }

    setFilteredPosts(sortedPosts);
    setFilter(type);
  };

  //   const renderItem = ({ item }) => (
  //     <View
  //       style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" }}
  //     >
  //       <Text>Title: {item.title}</Text>
  //       <Text>Description: {item.description}</Text>
  //       <Image
  //         source={item.image}
  //         style={{ width: 200, height: 200, marginVertical: 10 }}
  //       />
  //       <Text>Likes: {item.likes}</Text>
  //       <Text>Created At: {item.createdAt.toDateString()}</Text>
  //     </View>
  //   );

  return (
    <View style={{ flex: 1, padding: 10, marginTop: 40 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 10,
        }}
      >
        <TouchableOpacity onPress={() => handleFilter("recent")}>
          <Text style={{ color: filter === "recent" ? "blue" : "black" }}>
            Most Recent
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleFilter("oldest")}>
          <Text style={{ color: filter === "oldest" ? "blue" : "black" }}>
            Least Recent
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleFilter("mostLiked")}>
          <Text style={{ color: filter === "mostLiked" ? "blue" : "black" }}>
            Most Liked
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleFilter("leastLiked")}>
          <Text style={{ color: filter === "leastLiked" ? "blue" : "black" }}>
            Least Liked
          </Text>
        </TouchableOpacity>
      </View>
      {/* <FlatList
        data={filteredPosts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      /> */}
      <ScrollView>
        {filteredPosts.map((post) => (
          <PostItem key={post._id} post={post} />
        ))}
      </ScrollView>
      <TouchableOpacity onPress={() => navigation.navigate("uploadpost")}>
        <Text
          style={{
            textAlign: "center",
            padding: 10,
            backgroundColor: "blue",
            color: "white",
            borderRadius: 5,
          }}
        >
          Upload Post
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Post;
