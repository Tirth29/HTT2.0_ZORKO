import { TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Avatar, TextInput } from "react-native-paper";
import { colors, inputOptions } from "../Styles/styles";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch } from "react-redux";

const Header = ({ back, emptyCart = false, setPriceLimit }) => {
  const [limit, setLimit] = useState(1000);
  const navigate = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const emptyCartHandler = () => {
    dispatch({
      type: "clearCart",
    });
  };

  const handleLimitChange = (x) => {
    setLimit(x);
    setPriceLimit(x);
  };

  return (
    <>
      {back && (
        <TouchableOpacity
          style={{
            position: "absolute",
            left: 20,
            top: 30,
            zIndex: 10,
          }}
          onPress={() => navigate.goBack()}
        >
          <Avatar.Icon
            style={{
              backgroundColor: colors.color4,
            }}
            icon={"arrow-left"}
            color={
              route.name === "productdetails" ? colors.color2 : colors.color3
            }
          />
        </TouchableOpacity>
      )}

      <View style={{ width: "40%" }}>
        {/* set price range filter */}
        <TextInput
          placeholder="Set Limit"
          keyboardType="numeric"
          value={limit}
          onChangeText={handleLimitChange}
        />
      </View>

      <TouchableOpacity
        style={{
          position: "absolute",
          right: 20,
          top: 30,
          zIndex: 10,
        }}
        onPress={emptyCart ? emptyCartHandler : () => navigate.navigate("cart")}
      >
        <Avatar.Icon
          style={{
            backgroundColor: colors.color4,
          }}
          icon={emptyCart ? "delete-outline" : "cart-outline"}
          color={
            route.name === "productdetails" ? colors.color2 : colors.color3
          }
        />
      </TouchableOpacity>
    </>
  );
};

export default Header;
