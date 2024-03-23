import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../Components/Footer";
import { useMessageAndErrorUser } from "../Utils/hooks";
import { loginOTP, submitOTP } from "../Redux/Actions/UserAction";
import axios from "axios";
import { server } from "../Redux/Store";
import { colors, defaultStyle, formHeading } from "../Styles/styles";

const OtpVerify = ({ navigation }) => {
  const [phone, setPhone] = useState("");
  const [otp, setOTP] = useState("");

  const [otpSent, setOtpSent] = useState(false); // Flag to track if OTP is sent
  const dispatch = useDispatch();
  const loading = useMessageAndErrorUser(navigation, dispatch, "profile");
  const [verificationSid, setVerificationSid] = useState("");
  const handleSendOTP = async () => {
    console.log(phone);
    setOtpSent(true);
    // dispatch(loginOTP(phone));
    try {
      dispatch({
        type: "loginRequest",
      });
      // console.log(phone);
      const { data } = await axios.post(
        `${server}/user/otp-login`,
        {
          phone,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setVerificationSid(data.verificationSid);
      console.log(verificationSid, data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitOTP = async () => {
    const code = otp;
    // const { verificationSid } = useSelector((state) => state.verificationSid);
    console.log(verificationSid, code, phone);
    dispatch(submitOTP(verificationSid, code, phone));
  };

  return (
    <>
      <View style={defaultStyle}>
        <View style={{ marginBottom: 20, marginTop: 30 }}>
          <Text style={formHeading}>Login Via OTP</Text>
        </View>
        {/* Your UI components for OTP verification */}
        {!otpSent ? ( // Render phone input if OTP is not sent
          <>
            <TextInput
              placeholder="Enter Mobile Number"
              value={phone}
              onChangeText={setPhone}
            />
            <Button
              textColor={colors.color1}
              //   buttonColor={colors.color2}
              onPress={handleSendOTP}
            >
              Send OTP
            </Button>
          </>
        ) : (
          // Render OTP input if OTP is sent
          <>
            <TextInput
              placeholder="Enter OTP"
              value={otp}
              color={colors.color2}
              onChangeText={setOTP}
            />
            <Button onPress={handleSubmitOTP}>Verify OTP</Button>
          </>
        )}
        <TouchableOpacity onPress={() => navigation.navigate("login")}>
          <Text>Back to Login</Text>
        </TouchableOpacity>
      </View>
      <Footer activeRoute="profile" />
    </>
  );
};

export default OtpVerify;
