import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Image, Alert } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import axios from "axios";

import GDGLogo from "./assets/developers-social-media.png";

const App = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState("Waiting for QR scanning");
  const [loading, setLoading] = useState(false);

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  };

  const getDataUsingAsyncAwaitGetCall = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://thisisbac.herokuapp.com/api/v1/qrscan/check",
        {
          id: text,
        }
      );
      setLoading(false);
      Alert.alert("QR Code Status", JSON.stringify(response.data.Status));
      setScanned(false);
      setText("Waiting for QR scanning");
    } catch (error) {
      // handle error
      alert(error.message);
    }
  };

  // Request Camera Permission
  useEffect(() => {
    askForCameraPermission();
  }, []);

  // What happens when we scan the bar code
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setText(data);
    console.log("Type: " + type + "\nData: " + data);
  };

  // Check permissions and return the screens
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>No access to camera</Text>
        <Button
          title={"Allow Camera"}
          onPress={() => askForCameraPermission()}
        />
      </View>
    );
  }

  // Return the View
  return (
    <View style={styles.container}>
      <Image
        style={{ width: 200, height: 60, bottom: 30 }}
        source={GDGLogo}
      />
      <Text style={{ position: "absolute", top: 80, fontSize: 24 }}>
        Google Developer Group Hanoi
      </Text>
      <Text style={{ position: "absolute", top: 120 }}>
        Google Developer Student Club - HUST
      </Text>

      <View style={styles.barcodebox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ height: 400, width: 400, borderRadius: 30, }}
        />
      </View>
      <Text style={styles.maintext}>{text}</Text>

      {/* {scanned && <Button title={'Scan again?'} onPress={() => setScanned(false)} color='tomato' />} */}
      {scanned && (
        <Button
          title={loading ? "Loading" : "Verify this QR"}
          onPress={getDataUsingAsyncAwaitGetCall}
          color="tomato"
        />
      )}
      <Text style={{ position: "absolute", bottom: 20, fontStyle: "italic" }}>
        Develop with love by 'thisisbac'
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  maintext: {
    fontSize: 16,
    margin: 20,
  },
  barcodebox: {
    alignItems: "center",
    justifyContent: "center",
    height: 300,
    width: 300,
    overflow: "hidden",
    backgroundColor: "white",
  },
});

export default App;
