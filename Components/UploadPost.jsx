import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Button,
} from "react-native";
import {
  defaultStyle,
  colors,
  formHeading,
  inputOptions,
} from "../Styles/styles";
import Header from "./Header";
import { ScrollView } from "react-native-gesture-handler";
import { Avatar } from "react-native-paper";
import Footer from "./Footer";
import axios from "axios";
import { server } from "../Redux/Store";
import { useIsFocused } from "@react-navigation/native";
import mime from "mime";
// Mock posts data for posts uploaded by the user
const myPosts = [
  {
    id: 1,
    title: "My Post 1",
    description: "Description for my post 1",
    image:
      "https://www.shutterstock.com/image-photo/classic-hamburger-stock-photo-isolated-600nw-2282033179.jpg",
    likes: 8,
  },
  {
    id: 2,
    title: "My Post 2",
    description: "Description for my post 2",
    image:
      "https://www.shutterstock.com/image-photo/classic-hamburger-stock-photo-isolated-600nw-2282033179.jpg",
    likes: 15,
  },
  // Add more mock posts as needed
];

const UploadPost = ({ navigation, route }) => {
  //   const isFocused = useIsFocused();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  // Add state for image upload if needed

  const handleUploadPost = () => {
    // Implement upload post functionality here
    console.log("Uploaded post:", { title, description });
    // Reset form fields after upload
    setTitle("");
    setDescription("");
  };

  const submitHandler = async () => {
    // Call handleUploadPost function to upload post
    console.log("Hello");
    console.log(image);
    const myForm = new FormData();
    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("file", {
      uri: image,
      type: mime.getType(image),
      name: image.split("/").pop(),
    });
    console.log(myForm);
    try {
      const { data } = await axios.post(`${server}/post`, myForm, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      console.log(data);
      alert("Post Uploaded Secuessfully!");
      navigation.navigate("post");
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (route.params?.image) setImage(route.params.image);
  }, [route.params]);
  //   const renderMyPostItem = ({ item }) => (
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
  //     </View>
  //   );

  return (
    <>
      <View style={{ flex: 1, padding: 10 }}>
        <View
          style={{
            ...defaultStyle,
            backgroundColor: colors.color5,
          }}
        >
          {/* <Header back={true} /> */}

          {/* Heading */}
          <View style={{ marginBottom: 20, paddingTop: 70 }}>
            <Text style={formHeading}>New Post</Text>
          </View>

          <ScrollView
            style={{
              padding: 20,
              elevation: 10,
              borderRadius: 10,
              backgroundColor: colors.color3,
            }}
          >
            <View
              style={{
                justifyContent: "center",
                height: 650,
              }}
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  alignSelf: "center",
                  marginBottom: 20,
                }}
              >
                <Avatar.Image
                  size={80}
                  style={{
                    backgroundColor: colors.color1,
                  }}
                  source={{
                    uri: image ? image : null,
                  }}
                />
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("camera", { newPost: true })
                  }
                >
                  <Avatar.Icon
                    icon={"camera"}
                    size={30}
                    color={colors.color3}
                    style={{
                      backgroundColor: colors.color2,
                      position: "absolute",
                      bottom: 0,
                      right: -5,
                    }}
                  />
                </TouchableOpacity>
              </View>

              <TextInput
                {...inputOptions}
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
              />
              <TextInput
                {...inputOptions}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
              />

              <Button
                textColor={colors.color2}
                style={{
                  backgroundColor: colors.color1,
                  margin: 20,
                  padding: 6,
                }}
                title="Upload"
                onPress={submitHandler}
                //   loading={loading}
                //   disabled={disableBtnCondition || loading}
              >
                <Text>Upload</Text>
              </Button>
            </View>
          </ScrollView>
        </View>
        {/* <Text style={{ fontSize: 20, marginVertical: 20 }}>My Posts</Text> */}
        {/* <FlatList
        data={myPosts}
        renderItem={renderMyPostItem}
        keyExtractor={(item) => item.id.toString()}
      /> */}
      </View>
      <Footer />
    </>
  );
};

export default UploadPost;
