import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Alert } from "react-native";
import { WebView } from "react-native-webview";
import PassKit from "react-native-passkit-wallet";


export default function App() {
  const originalWarn = console.warn;

  console.warn = (...args) => {
    if (typeof args[0] === "string" && args[0].includes("base64")) {
      // Truncate base64 output
      const truncatedMessage =
        args[0].length > 100
          ? args[0].substring(0, 100) + "... (truncated)"
          : args[0];
      originalWarn(truncatedMessage);
    } else {
      originalWarn(...args);
    }
  };

  const handleMessage = async (event) => {
    const messageData = JSON.parse(event.nativeEvent.data);
    if (messageData.type === "openWallet") {
      try {
        // Use the base64 data directly as a data URL
        const pkpassDataUrl = `data:application/vnd.apple.pkpass;base64,${messageData.data}`;

        
        
      } catch (error) {
        console.log("Error processing base64 data:", error);
        Alert.alert("Error", "An error occurred while processing the PKPass data.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{
          uri:
            "https://olympicsportaltest.rltdplatform.com/auth?token=X0WCQ0%2FtvZ6L5FkH%7CW7Rha19ICZCJ8cYAzOYBmNU3ew%3D%3D%7CAPrbu9jGTC2kWd1rVNooaA%3D%3D",
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        mixedContentMode="always"
        style={{ flex: 1 }}
        onMessage={handleMessage}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
