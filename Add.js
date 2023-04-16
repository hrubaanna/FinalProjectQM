import React from "react";
import GetLocation from "react-native-get-location";
import Geocoder from "react-native-geocoding";
import { launchCamera } from "react-native-image-picker";
import ImageColors from "react-native-image-colors";

import { Button, Image, StyleSheet, Text, TextInput, View } from "react-native";

const AddScreen = ({ navigation }) => {
  const [text, onChangeText] = React.useState(null);
  const [location, setLocation] = React.useState(null);
  const [area, setArea] = React.useState(null);
  const [imgPath, setImgPath] = React.useState(null);
  const [imgData, setImgData] = React.useState(null);
  const [imgUri, setImgUri] = React.useState(null);
  const [showImage, setShowImage] = React.useState(false);
  const [prominentColor, setProminentColor] = React.useState(null);

  const imageWidth = 200;
  const imageHeight = 200;

  handleGetLocation = () => {
    // Get current location of the device
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then((newLocation) => {
        console.log("_______________________");
        console.log(newLocation);
        setLocation(newLocation);
        console.log("_______________________");
      })
      .catch((error) => {
        const { code, message } = error;
        console.warn(code, message);
      });

    // Get address from latidude & longitude.
    Geocoder.init("AIzaSyDoJNnJmVXJpPJQU1hBR3Ti-1LXAfFWI_A");

    Geocoder.from(location.latitude, location.longitude)
      .then((json) => {
        var addressComponent = json.results[0].address_components;

        //find area name from addressComponent
        var area = addressComponent.find((item) => {
          return item.types.includes("neighborhood");
        });

        var areaName = area ? area.long_name : "Not found";
        console.log(`Area name is ${areaName}`);
        setArea(areaName);

        // console.log("_______________________");
        // console.log("Address:");
        // console.log(json.results[0]);
        // console.log(addressComponent);
        // console.log("_______________________");
      })
      .catch((error) => console.warn(error));
  };

  /***
   * handleImage:
   * Open a camera and take a picture --> not working yet, must fix xcode to launch on iphone
   */
  handleImage = () => {
    // Open camera
    var options = {
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };

    launchCamera(options, (response) => {
      console.log("_______________________");
      console.log("response", response);
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        //let source = {uri: response.uri};
        console.log("response", JSON.stringify(response));
        setImgPath(response);
        setImgData(response.data);
        setImgUri(response.uri);
      }
      console.log("_______________________");
    });
  };

  /**
   * temp fix for handleImage:
   * have a preloaded image to display
   */
  loadImageTemp = () => {
    setImgUri(
      "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
    );
    //toggle showImage
    showImage ? setShowImage(false) : setShowImage(true);

    // Extract dominant color from image
    this.extractDominantColor();
  };

  extractDominantColor = async () => {
    const result = await ImageColors.getColors(imgUri, {
      fallback: "white",
      cache: true,
      key: "myKey",
    });

    setProminentColor(result.primary);
  };

  return (
    <View style={{ backgroundColor: prominentColor }}>
      <View style={{ alignItems: "center" }}>
        <Text style={{ fontSize: 24 }}>Create a new generation</Text>
      </View>
      <Button title="Get location" onPress={this.handleGetLocation} />

      <Button title="Take a picture" onPress={this.loadImageTemp} />
      {/* Image which only appears when imageSelected is true */}
      {showImage && (
        <Image source={{ uri: imgUri }} style={{ width: 200, height: 200 }} />
      )}
      {/* Show the dominant color in the photo */}

      {/* Once location and picture are taken,
      propose a CA design and ask user if they want a custom */}
      {/* <Button title="Design CA" /> */}

      <TextInput
        onChangeText={onChangeText}
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        placeholder="Enter description"
        value={text}
      />
      <Button title="Submit" />
    </View>
  );
};

export default AddScreen;
