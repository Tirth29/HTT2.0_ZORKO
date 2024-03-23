import Main from "./Main";
import { Provider } from "react-redux";
import { Store } from "./Redux/Store";
import { StripeProvider } from "@stripe/stripe-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
const stripeKey =
  "pk_test_51NIEnzSB4h8hbRqEuQPdncAamxRkcmHE3RlYfm6N1YZXrr3FOpkrXV6qjk6pnUvVijTAwRbMTbFb9x7WyptCrNPr00n7a4aYjG";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StripeProvider
        threeDSecureParams={{
          backgroundColor: "#FFFFFF",
          timeout: 5,
        }}
        merchantIdentifier="merchant.identifier.solanki.tirth"
        publishableKey={stripeKey}
      >
        <Provider store={Store}>
          <Main />
        </Provider>
      </StripeProvider>
    </GestureHandlerRootView>
  );
}
