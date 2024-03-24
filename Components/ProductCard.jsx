import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { colors } from "../Styles/styles";
import { Button } from "react-native-paper";

const ProductCard = ({
  stock,
  name,
  price,
  image,
  id,
  addToCardHandler,
  i,
  navigate,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => navigate.navigate("productdetails", { id })}
    >
      <View
        style={{
          elevation: 10,
          width: 150,
          alignItems: "center",
          justifyContent: "space-between",
          margin: 10,
          borderRadius: 20,
          height: 250,
          backgroundColor: i % 2 === 0 ? colors.color1 : colors.color2,
        }}
      >
        <Image
          source={{
            uri: image,
          }}
          style={{
            width: "100%",
            height: 115,
            resizeMode: "contain",
            position: "absolute",
            // left: 50,
            top: 65,
            // borderBottomLeftRadius: 10,
          }}
        />

        <View
          style={{
            flexDirection: "row",
            padding: 15,
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Text
            numberOfLines={2}
            style={{
              color: i % 2 === 0 ? colors.color2 : colors.color3,
              fontSize: 18,
              fontWeight: "300",
              width: "60%",
            }}
          >
            {name}
          </Text>

          <Text
            numberOfLines={2}
            style={{
              color: i % 2 === 0 ? colors.color2 : colors.color3,
              fontSize: 18,
              fontWeight: "700",
            }}
          >
            ₹{price}
          </Text>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: i % 2 === 0 ? colors.color2 : colors.color3,
            borderRadius: 0,
            paddingVertical: 5,
            borderBottomRightRadius: 20,
            borderBottomLeftRadius: 20,
            width: "100%",
          }}
        >
          <Button
            onPress={() => addToCardHandler(id, name, price, image, stock)}
            textColor={i % 2 === 0 ? colors.color1 : colors.color2}
          >
            Add To Cart
          </Button>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;
