import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { colors, defaultStyle, formHeading } from "../Styles/styles";
import Header from "../Components/Header";
import OrderItem from "../Components/OrderItem";
import Loader from "../Components/Loader";
// import { orders } from "../Screens/Orders";
import { useIsFocused } from "@react-navigation/native";
import { useGetOrders, useMessageAndErrorOther } from "../Utils/hooks";
import { Headline } from "react-native-paper";
import { processOrder } from "../Redux/Actions/OtherAction";
import { useDispatch } from "react-redux";

const AdminOrders = async ({ navigation }) => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const { loading } = useGetOrders(isFocused, true);
  // axios.get(`${server}/order/admin`).then((res) => {
  //   console.log("orders hook", res.data.orders);
  //   // setOrders(res.data.orders);
  //   // setLoading(false);
  //   // setOrders(res.data);
  // });
  // useEffect(() => {
  // Fetch posts from backend upon component mount
  useEffect(() => {
    async function fetchData() {
      console.log("Orders");
      try {
        const { data } = await axios.get(`${server}/order/admin`);
        console.log(data);
        setOrders(data.response.orders);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  });

  // }, []);
  console.log("orders:", orders);
  // console.log("orders");
  // const data = await axios.get(`${server}/order/admin`);
  // console.log(data);
  const processOrderLoading = useMessageAndErrorOther(
    dispatch,
    navigation,
    "adminpanel"
  );
  const updateHandler = (id) => {
    dispatch(processOrder(id));
  };
  return (
    <View>
      <Text>Hello</Text>
    </View>
    // <View
    //   style={{
    //     ...defaultStyle,
    //     backgroundColor: colors.color5,
    //   }}
    // >
    //   <Header back={true} />
    //   <View style={{ maerginTop: 70, marginBottom: 20 }}>
    //     <Text style={formHeading}>All Orders</Text>
    //   </View>
    //   {loading ? (
    //     <Loader />
    //   ) : (
    //     <View
    //       style={{
    //         padding: 10,
    //         flex: 1,
    //       }}
    //     >
    //       <ScrollView showsVerticalScrollIndicator={false}>
    //         {orders?.orders?.length > 0 ? (
    //           orders?.orders?.map((item, index) => (
    //             <div></div>
    //             // <View key={index}>
    //             //   <OrderItem
    //             //     key={index}
    //             //     id={item._id}
    //             //     i={index}
    //             //     price={item.totalAmount}
    //             //     status={item.orderStatus}
    //             //     paymentMethod={item.paymentMethod}
    //             //     orderedOn={item.createdAt.split("T")[0]}
    //             //     address={`${item.shippingInfo.address}, ${item.shippingInfo.city}, ${item.shippingInfo.country}, ${item.shippingInfo.pinCode}`}
    //             //     admin={true}
    //             //     updateHandler={updateHandler}
    //             //     loading={processOrderLoading}
    //             //   />
    //             // </View>
    //           ))
    //         ) : (
    //           <Headline style={{ textAlign: "center" }}>No Orders Yet</Headline>
    //         )}
    //       </ScrollView>
    //     </View>
    //   )}
    // </View>
  );
};
export default AdminOrders;
