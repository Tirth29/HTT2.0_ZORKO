import { View, Text, ScrollView, StyleSheet } from "react-native";
import React, { useState } from "react";
import { colors, defaultStyle } from "../Styles/styles";
import { formHeading } from "../Styles/styles";
import Header from "../Components/Header";
import Loader from "../Components/Loader";
import { Headline } from "react-native-paper";
import OrderItem from "../Components/OrderItem";
import { useIsFocused } from "@react-navigation/native";
import { useGetOrders } from "../Utils/hooks";
import axios from "axios";
import { server } from "../Redux/Store";

const Orders = async () => {
  const [orders, setOrders] = useState([]);
  try {
    const { data } = await axios.get(`${server}/order/my`, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    console.log(data.orders);
    setOrders(data.orders);
    console.log(orders);
  } catch (e) {
    console.log(e);
  }
  // console.log({ orders: orders.orders });

  return (
    <View style={defaultStyle}>
      {/* header  */}
      <Header back={true} />
      {/* heading  */}
      <View>
        <Text style={styles.formHeading}>Orders</Text>
      </View>
      {loading ? (
        <Loader />
      ) : (
        <View
          style={{
            padding: 10,
            flex: 1,
          }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {orders.length > 0 ? (
              orders.map(
                (item, index) => (
                  <View>
                    <OrderItem
                      i={index}
                      id={item._id}
                      cname={item.user}
                      price={item.totalAmount}
                      status={item.orderStatus}
                      paymentMethod={item.paymentMethod}
                      orderedOn={item.createdAt.split("T")[0]}
                      address={`${item.shippingInfo.address}, ${item.shippingInfo.city}, ${item.shippingInfo.country}, ${item.shippingInfo.pinCode}`}
                      admin={false}
                    />
                  </View>
                )
                // console.log(item)
              )
            ) : (
              <Headline style={{ textAlign: "center" }}>No Orders Yet</Headline>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  formHeading: {
    fontSize: 25,
    fontWeight: "500",
    textAlign: "center",
    backgroundColor: colors.color1,
    color: colors.color2,
    padding: 5,
    borderRadius: 5,
    marginTop: 50,
  },
});

export default Orders;
