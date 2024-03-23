import Header from "./Header";
import Footer from "./Footer";
import { useState, useEffect } from "react";
import { colors } from "../Styles/styles";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { loadUser } from "./Redux/Actions/UserAction";

const Vouchers = () => {
   const [vouchers, setVouchers] = useState([]);
   const [userpoints, setUserpoints] = useState(0);
   
   const fetchuserpoints = async () => {
      const res = await fetch(`https://htt-production.up.railway.app/api/v1/${user._id}/points`);
      const data = await res.json();
      setUserpoints(data);
      //  dispatch(loadUser(data));
   };
   useEffect(() => {
      fetch(`https://htt-production.up.railway.app/api/v1/vouchers`)
         .then((res) => res.json())
         .then((data) => setVouchers(data));
      fetchuserpoints();
   }, []);

   const handleRedeem = async (voucher) => {
      
   };

   return (
      <View style={styles.container}>
         {/* <Header back={true} /> */}
         <ScrollView>
            {vouchers.map((i) => (
               <View style={styles.voucher} key={i._id}>
                  <Text style={styles.text}>{i.voucher}</Text>
                  <Text style={styles.text}>{i.discount}</Text>
                  <Text style={styles.text}>{i.points}</Text>
                  <Button
                     title="Redeem"
                     disabled={userpoints < i.points}
                     onPress={() => handleRedeem(i)}
                  />
               </View>
            ))}
         </ScrollView>
         {/* <Footer /> */}
      </View>
   );
};
