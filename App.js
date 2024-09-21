import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Alert, Linking } from "react-native";
import { WebView } from "react-native-webview";
import * as FileSystem from "expo-file-system";
import PassKit from "react-native-passkit-wallet"; // Import PassKit

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
        // Create a temporary file path
        const fileUri = `${FileSystem.documentDirectory}temp.pkpass`;

        // Write base64 data to the file
        await FileSystem.writeAsStringAsync(fileUri, messageData.data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Check if file exists and log the path
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (fileInfo.exists) {
          console.log("File created at:", fileUri);
          console.log("File size:", fileInfo.size); // Log file size

          // Use PassKit to add the pass to Apple Wallet
          try {
            const result = await PassKit.addPass(fileUri);
            if (result) {
              Alert.alert("Success", "Pass added to Wallet successfully!");
            } else {
              Alert.alert("Failed", "Unable to add the pass to Wallet.");
            }
          } catch (err) {
            console.error("Error adding pass to Wallet:", err);
            Alert.alert(
              "Error",
              "Unable to add the pass to Wallet. Make sure your device supports Apple Wallet."
            );
          }
        } else {
          console.log("File not created.");
        }
      } catch (error) {
        console.log("Error creating file:", error);
        Alert.alert(
          "Error",
          "An error occurred while creating the PKPass file."
        );
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
