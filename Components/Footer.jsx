import { View, Text } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../Styles/styles";
import { TouchableOpacity } from "react-native";
import { Avatar } from "react-native-paper";
import { useSelector } from "react-redux";

const Footer = ({ activeRoute = "home" }) => {
  // console.log("Footer");
  const navigate = useNavigation();
  const { loading, isAuthenticated } = useSelector((state) => state.user);
  // console.log(state.user);
  const navigationHandler = (key) => {
    switch (key) {
      case 0:
        navigate.navigate("home");
        console.log("Home");
        break;
      case 1:
        navigate.navigate("cart");
        break;
      case 2:
        if (isAuthenticated) navigate.navigate("profile");
        else navigate.navigate("login");
        console.log("login");
        break;
      case 3:
        if (!isAuthenticated) navigate.navigate("login");
        else navigate.navigate("post");
        break;
      case 4:
        navigate.navigate("nearbyoutlet");
        break;
      default:
        navigate.navigate("home");
        break;
    }
  };

  const avatarOptions = {
    color: colors.color2,
    size: 50,
    style: {
      backgroundColor: colors.color1,
    },
  };
  return (
    loading === false && (
      <View
        style={{
          backgroundColor: colors.color1,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          height: 55,
          position: "absolute",
          width: "100%",
          bottom: 0,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",

          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            size={50}
            style={{
              backgroundColor: colors.color1,
            }}
            onPress={() => navigationHandler(1)}
          >
            <Avatar.Icon
              color={colors.color2}
              style={{
                backgroundColor: colors.color1,
              }}
              icon={activeRoute === "cart" ? "shopping" : "shopping-outline"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            size={50}
            style={{
              backgroundColor: colors.color1,
            }}
            onPress={() => navigationHandler(3)}
          >
            <Avatar.Icon
              color={colors.color2}
              style={{
                backgroundColor: colors.color1,
              }}
              icon={isAuthenticated === false ? "login" : "post"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
          
            onPress={() => navigationHandler(0)}
          >
            <Avatar.Icon
              {...avatarOptions}
              style={{border : 10,borderColor: colors.color2}}
              icon={activeRoute === "home" ? "home" : "home-outline"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            size={50}
            style={{
              backgroundColor: colors.color1,
            }}
            onPress={() => navigationHandler(4)}
          >
            <Avatar.Icon
              color={colors.color2}
              style={{
                backgroundColor: colors.color1,
              }}
              icon="map"
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            size={50}
            style={{
              backgroundColor: colors.color1,
            }}
            onPress={() => navigationHandler(2)}
          >
            <Avatar.Icon
              color={colors.color2}
              style={{
                backgroundColor: colors.color1,
              }}
              icon={
                isAuthenticated === false
                  ? "login"
                  : activeRoute === "profile"
                    ? "account"
                    : "account-outline"
              }
            />
          </TouchableOpacity>
        </View>
        {/* <View
          style={{
            position: "absolute",
            width: 70,
            height: 70,
            backgroundColor: colors.color2,
            borderRadius: 100,
            justifyContent: "center",
            alignItems: "center",
            top: -40,
            alignSelf: "center",
          }}
        >
          <View
            style={{
              borderRadius: 100,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            
          </View>
        </View> */}
      </View>
    )
  );
};

export default Footer;
