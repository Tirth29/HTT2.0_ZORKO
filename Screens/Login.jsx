import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useDispatch } from "react-redux";
import Footer from "../Components/Footer";
import { login } from "../Redux/Actions/UserAction";
import {
  colors,
  defaultStyle,
  formHeading,
  formStyles,
  inputOptions,
} from "../Styles/styles";
import { useMessageAndErrorUser } from "../Utils/hooks";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const dispatch = useDispatch();
  let loading = useMessageAndErrorUser(navigation, dispatch, "profile");

  const submitHandler = () => {
    alert("Welcome to our store ");
    if (email !== "") {
      dispatch(login(email, password));
      loading = useMessageAndErrorUser(navigation, dispatch, "profile");
    } else {
      dispatch(loginOTP(phone, password));
      loading = useMessageAndErrorUser(navigation, dispatch, "otp");
    }
  };

  return (
    <>
      <View style={defaultStyle}>
        <View style={{ marginBottom: 20, marginTop: 30 }}>
          <Text style={formHeading}>Login</Text>
        </View>
        <View style={formStyles.container}>
          <TextInput
            {...inputOptions}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            multiline={false}
          />
          {/* <Text>OR</Text>
          <TextInput
            {...inputOptions}
            placeholder="Phone No."
            keyboardType="numeric"
            value={phone}
            onChangeText={setPhone}
            multiline={false}
          /> */}
          <TextInput
            {...inputOptions}
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate("forgetpassword")}
          >
            <Text style={formStyles.forget}>Forget Password</Text>
          </TouchableOpacity>
          <Button
            loading={loading}
            textColor={colors.color2}
            disabled={email === "" || password == ""}
            style={formStyles.btn}
            onPress={submitHandler}
          >
            Log In
          </Button>
          <Text style={formStyles.or}>OR</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("otpsignin")}
          >
            <Text style={formStyles.link}>Log in via OTP</Text>
          </TouchableOpacity>
          <Text style={formStyles.or}>OR</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("signup")}
          >
            <Text style={formStyles.link}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Footer activeRoute="profile" />
    </>
  );
};

export default Login;
