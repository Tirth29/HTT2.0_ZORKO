import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  NativeModules,
  PermissionsAndroid,
  Text,
  Dimensions,
  Image,
  Pressable,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { server } from "../Redux/Store";
import * as Location from "expo-location";
import Carousel from "react-native-snap-carousel";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { useRef } from "react";
import Footer from "../Components/Footer";
// import { log } from "console";
import { useNavigation } from "@react-navigation/native";
import ReactNativeModal from "react-native-modal";

import { MaterialCommunityIcons } from "@expo/vector-icons";

// Geolocation.getCurrentPosition;
const NearbyOutlets = () => {
  const [showOutletModal, setShowOutletModal] = useState(false);
  const [selectedOutletModal, setSelectedOutletModal] = useState(null);
  console.log(showOutletModal, selectedOutletModal);
  const [outlets, setOutlets] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [initialRegion, setInitialRegion] = useState({
    latitude: 21.1888, // Replace with your initial latitude
    longitude: 72.8293, // Replace with your initial longitude
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const mapRef = useRef(null);
  

  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Location permission denied");
        return; // Exit if permission is denied
      }

      const locationData = await Location.getCurrentPositionAsync({});
      console.log("Location: ", locationData);
      setLatitude(locationData.coords.latitude);
      setLongitude(locationData.coords.longitude);
    };

    requestLocationPermission();
  }, []); // Empty dependency array ensures it runs only once on component mount

  // Function to fetch outlets based on location (replace with your API call)
  const fetchOutlets = async () => {
    if (!latitude || !longitude) {
      console.warn("Location not available yet");
      return; // Prevent unnecessary API calls if location is not ready
    }

    try {
      console.log(`${server}/user/nearby-outlets`, { latitude, longitude });
      const response = await axios.get(
        `${server}/user/nearby-outlets?latitude=${latitude}&longitude=${longitude}`,
        {
          latitude,
          longitude,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const data = await response.data;
      console.log("Outlets:", data.outlets);
      setOutlets(data.outlets); // Update outlets state with fetched data
    } catch (err) {
      console.error(err); // Handle API call errors
      setErrorMsg("Error fetching outlets"); // Update error message
    }
  };

  useEffect(() => {
    if (latitude && longitude) {
      fetchOutlets();
    }
  }, [latitude, longitude]);

  // Handle carousel item press to focus map on marker
  const handleMarkerPress = (outletData) => {
    const { coordinates } = outletData.location; // Assuming location data has a 'coordinate' property
    mapRef.current.animateToRegion({
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      latitudeDelta: 0.01, // Adjust zoom level as needed
      longitudeDelta: 0.01, // Adjust zoom level as needed
    });
  };
  // In NearbyOutlets:
  const handleCardPress = (outletData) => {
    setSelectedOutletModal(outletData); // Pass the whole outlet object
    setShowOutletModal(true);
  };
  const closeOutletModal = () => {
    setShowOutletModal(false);
  };
  return (
    <View style={styles.container}>
      {errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : latitude && longitude ? (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            region={{ ...initialRegion }}
          >
            <Marker
              coordinate={{ latitude, longitude }} // Update marker coordinates to user location
              title="Your Location"
            />
            {/* Display retrieved outlets on the map (replace with your logic) */}
            {outlets.map((outlet) => {
              console.log(
                outlet.location.coordinates[0],
                outlet.location.coordinates[1]
              );
              return (
                <Marker
                  pinColor="green"
                  key={outlet._id} // Use unique identifier for each outlet
                  coordinate={{
                    latitude: outlet.location.coordinates[0],
                    longitude: outlet.location.coordinates[1],
                  }}
                  title={outlet.name} // Set marker title (e.g., outlet name)
                />
              );
            })}
          </MapView>
          <View style={styles.carouselContainer}>
            {outlets.length > 0 ? (
              <OutletCarousel
                handleCardPress={handleCardPress}
                data={outlets}
                onMarkerPress={handleMarkerPress}
                mapRef={mapRef}
              />
            ) : null}
          </View>
        </>
      ) : (
        <Text>Fetching location...</Text>
      )}
      <Footer></Footer>
      <Outlet
        outletData={selectedOutletModal}
        isVisible={showOutletModal}
        onClose={closeOutletModal}
      />
    </View>
  );
};

const OutletCarousel = ({ data, onMarkerPress, mapRef, handleCardPress }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const navigation = useNavigation();
  // useEffect();

  const _renderItem = ({ item, index }) => (
    <Pressable
      key={index} // Use unique identifier for each item
      style={styles.carouselItem}
      onPress={() => {
        console.log("ITEM", item);
        onMarkerPress(item); // Call the passed function on press
        setActiveSlide(index); // Update active slide for visual feedback (optional)
        handleCardPress(item);
        navigation.navigate("contact", { it : item });
      }}
    >
      <Image
        source={{
          uri: "https://img.freepik.com/free-photo/exploding-burger-with-vegetables-melted-cheese-black-background-generative-ai_157027-1734.jpg",
        }}
        style={{
          height: "70%",
          borderRadius: 5,
        }}
        alt=""
      />

      <Text style={styles.carouselTitle}>{item.name}</Text>
      <Text style={styles.carouselText}>{item.address}</Text>
      {/* Add distance, image, or other outlet details */}
    </Pressable>
  );

  return (
    <View style={styles.carouselContainer}>
      {data.length > 0 ? (
        <Carousel
          data={data}
          renderItem={_renderItem}
          sliderWidth={Dimensions.get("window").width} // Adjust carousel width if needed
          itemWidth={Dimensions.get("window").width * 0.9} // Adjust carousel item width if needed
          onBeforeChange={(index) => setActiveSlide(index)} // Update active slide on slide change
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "start",
  },
  map: {
    width: "100%",
    height: "65%", // Adjust map height as needed
  },
  carouselContainer: {
    flex: 0.98, // Adjust carousel container height as needed
    width: "100%",
  },
  carouselItem: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 0,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  carouselTitle: {
    fontSize: 18,
    fontWeight: "bold",
    paddingLeft: 10,
    paddingTop: 3,
  },
  carouselText: {
    fontSize: 16,
    paddingLeft: 10,
  },
});

const Outlet = ({ outletData, isVisible, onClose }) => {
  // Check if outletData exists for safety
  if (!outletData) return null;
  console.log("jsdbvkjds:", outletData);

  return (
    <ReactNativeModal
      visible={isVisible}
      animationType="slide" // Adjust animation as desired
      transparent={true} // Consider making the background semi-transparent
    >
      <ScrollView>
        <View style={outletStyles.modalContainer}>
          <View style={outletStyles.contentContainer}>
            <Image
              source={{ uri: "https://lh5.googleusercontent.com/p/AF1QipO5Dmkq-hHpda5p5bxoglRNA1YQacCbd5e9LW6p=w426-h240-k-no" }}
              style={outletStyles.image}
            />
            <Pressable>
              <MaterialCommunityIcons name="close" size={30} onPress={onClose} />
            </Pressable>
            <Text style={outletStyles.title}>{outletData.name}</Text>
            <Text style={outletStyles.address}>{outletData.address}</Text>

            <View style={outletStyles.additionalInfo}>
              <Text style={outletStyles.additionalInfoLabel}>
                Dining Availability:{" "}
              </Text>
              <Text style={outletStyles.additionalInfoValue}>
                {outletData.diningIn}
              </Text>
              <Text style={outletStyles.additionalInfoLabel}>Rating: </Text>
              <Text style={outletStyles.additionalInfoValue}>
                {outletData?.rating} stars
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row" }}>
              {outletData.offers && outletData.offers.length > 0 ? (
                <View className="offers-section">
                  <Text style={{ fontSize: 30, fontWeight: 600 }}>
                    Available Offers:
                  </Text>
                  {outletData.offers.map((offer) => (
                    <OfferItem key={offer.name} {...offer} />
                  ))}
                </View>
              ) : null}
            </View>

            {outletData.coupons && outletData.coupons.length > 0 ? (
              <View className="coupons-section">
                <Text style={{ fontSize: 30, fontWeight: 600 }}>
                  Available Coupons:
                </Text>
                {outletData.coupons.map((coupon) => (
                  <CouponItem key={coupon._id} {...coupon} />
                ))}
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </ReactNativeModal>
  );
};
const OfferItem = ({ name, description }) => {
  return (
    <View style={estyles.offerCard}>
      <Text style={estyles.title}>{name}</Text>
      <Text style={estyles.description}>{description}</Text>
    </View>
  );
};

const CouponItem = ({ code, discount, minOrderValue }) => {
  return (
    <View style={{ backgroundColor:"lightgray", margin:3, padding:9, borderRadius:10}}>
      <Text style={estyles.code}>{code}</Text>
      <Text style={estyles.details}>
        {discount} (Min. Order: ${minOrderValue})
      </Text>
    </View>
  );
};

const estyles = StyleSheet.create({
  offerCard: {
    // flex: 1,
    margin: 10,
    backgroundColor: "#fff", // White background
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000", // Subtle shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // (For Android)
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    paddingBottom:0
  },
  couponCard: {
    flex: 1,
    margin: 10,
    backgroundColor: "#f0f0f0", // Light gray background
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // (For Android)
  },
  code: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  details: {
    fontSize: 16,
  },
});

const outletStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", //  Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    // ...other styles
  },
  closeButton: {
    alignSelf: "flex-end", // Optionally place close button on top-right
  },
  closeButtonText: {
    fontSize: 20,
  },
  title: {
    fontSize: 24, // Larger for prominence
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10, // Spacing below title
  },
  image: {
    width: "100%",
    // height: 200, // Adjust height as needed
    marginBottom: 12, // Add spacing below the image
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8, // Assuming you want rounded top corners
  },
  address: {
    fontSize: 16, // Standard for readability
  },
  // Styling for additional info
  additionalInfo: {
    marginTop: 15, // Add some space above the additional info section
  },
  additionalInfoLabel: {
    fontWeight: "600", // or 'bold' - Make labels slightly bolder
  },
  additionalInfoValue: {
    // No changes needed (regular weight)
  },
  // ... other detail styles
});

export default NearbyOutlets;
