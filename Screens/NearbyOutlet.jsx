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
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { server } from "../Redux/Store";
import * as Location from "expo-location";
import Carousel from "react-native-snap-carousel";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useRef } from "react";
import Footer from "../Components/Footer";

// Geolocation.getCurrentPosition;
const NearbyOutlets = () => {
  const [outlets, setOutlets] = useState([]);
  // const [location, setLocation] = useState(null);
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
    const { coordinate } = outletData.location; // Assuming location data has a 'coordinate' property
    mapRef.current.animateToRegion({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      latitudeDelta: 0.01, // Adjust zoom level as needed
      longitudeDelta: 0.01, // Adjust zoom level as needed
    });
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
    </View>
  );
};

const OutletCarousel = ({ data, onMarkerPress, mapRef }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  // useEffect();

  const _renderItem = ({ item, index }) => (
    <TouchableOpacity
      key={index} // Use unique identifier for each item
      style={styles.carouselItem}
      onPress={() => {
        onMarkerPress(item); // Call the passed function on press
        setActiveSlide(index); // Update active slide for visual feedback (optional)
      }}
    >
      <Image
        source={{
          uri: "https://img.freepik.com/free-photo/exploding-burger-with-vegetables-melted-cheese-black-background-generative-ai_157027-1734.jpg",
        }}
        style={{
          height:"70%",borderRadius: 5
        }}
        alt=""
      />
      
      <Text style={styles.carouselTitle}>{item.name}</Text>
      <Text style={styles.carouselText}>{item.address}</Text>
      {/* Add distance, image, or other outlet details */}
    </TouchableOpacity>
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

async function CarouselWrapper({
  data,
  renderItem,
  sliderWidth,
  itemWidth,
  onBeforeChange,
  animate,
}) {
  useEffect(() => {
    animate();
  }, []);
  return (
    <Carousel
      data={data}
      renderItem={renderItem}
      sliderWidth={sliderWidth} // Adjust carousel width if needed
      itemWidth={itemWidth} // Adjust carousel item width if needed
      onBeforeChange={onBeforeChange} // Update active slide on slide change
    />
  );
}

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

export default NearbyOutlets;
