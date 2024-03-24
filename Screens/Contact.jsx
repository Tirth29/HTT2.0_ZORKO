import Footer from "../Components/Footer";
import { View, Text,StyleSheet } from "react-native";
import { colors } from "../Styles/styles";
const Contact = (item) => {
   // console.log(item);
   item = item.route.params.it;
   console.log(item);
   return (
      <View
         style={{
            padding: 20,
            backgroundColor: colors.color2,
         }}
      >
         <Text
            style={{
               margin: 20,
               textAlign: "center",
               fontSize: 30,
            }}
         >Contact Us</Text>
         <View
            style={{
               margin: 20,
               padding: 20,
               backgroundColor: colors.color1,
               borderRadius: 10,
            }}
         >
            <Text style={styles.text}>Name : {item.name}</Text>
            <Text style={styles.text}>Address : {item.address}</Text>
            <Text style={styles.text}>Phone : +91 9909900139</Text>
            <Text style={styles.text}>Email : zorko.in@gmail.com</Text>
            
         </View>
         <View>
            <Text
               style={{
                  margin: 20,
                  textAlign: "center",
                  fontSize: 30,
               }}
            >Offers</Text>
            {
               item.offers.map((offer, index) => {
                  return (
                     <View key={index}>
                        <Text style={styles.offertext}>Name: {offer.name}</Text>
                        <Text style={styles.offertext}>Description: {offer.description}</Text>
                        <Text style={styles.offertext}>Start Date: {offer.startDate}</Text>
                        <Text style={styles.offertext}>End Date: {offer.endDate}</Text>
                     </View>
                  );
               })
            }
         </View>
      </View>
   );
}
const styles = StyleSheet.create({
   text: {
     color: colors.color2,
     padding: 10,
     borderRadius: 10,
     alignItems: "center",
   },
   offertext:{
      color: colors.color2,
      padding: 5,
      borderRadius: 10,
      alignItems: "center",
   }
 });
export default Contact;