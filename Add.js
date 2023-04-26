import React, { useEffect } from "react";
import GetLocation from "react-native-get-location";
import Geocoder from "react-native-geocoding";
import { launchCamera } from "react-native-image-picker";
import ImageColors from "react-native-image-colors";
import CAComp from "./CAComp";
import { Dimensions } from "react-native";
import Environment from "./Environment";

import { Button, Image, Text, TextInput, View } from "react-native";

const AddScreen = ({ navigation, route }) => {
  const [text, onChangeText] = React.useState(null);
  const [area, setArea] = React.useState(null);
  const [latitude, setLatitude] = React.useState(null);
  const [longitude, setLongitude] = React.useState(null);
  const [imgUri, setImgUri] = React.useState(null);
  const [prominentColor, setProminentColor] = React.useState(null);
  const [showCA, setShowCA] = React.useState(true);
  const [step, setStep] = React.useState(0);
  const [description, setDescription] = React.useState(null);
  const [imageResponse, setImageResponse] = React.useState(null);

  const username = route.params.username;

  const width = Dimensions.get("window").width;
  const numRows = 20;
  const numCols = 20;
  const cellWidth = width / numCols;
  const myPatterns = require("./patterns");

  const pattern = [
    {
      pattern:
        myPatterns.patternNames[
          Math.floor(Math.random() * myPatterns.patternNames.length)
        ],
      x: 5,
      y: 5,
      color: prominentColor,
    },
  ];

  handleNextStep = () => {
    setStep(step + 1);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      //reset all variables to their initial state
      setStep(0);
      //reset all states
      onChangeText(null);
      setArea(null);
      setLatitude(null);
      setLongitude(null);
      setImgUri(null);
      setProminentColor(null);
      setShowCA(true);
      setDescription(null);
      setImageResponse(null);
    });
    return unsubscribe;
  }, [navigation]);

  handleSubmitDescription = () => {
    setDescription(text);
    handleNextStep();
    setImgUri(null);
  };

  getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      })
        .then((location) => {
          resolve(location);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  getLocationName = (latitude, longitude) => {
    return new Promise((resolve, reject) => {
      //use Google API to get the name of the location
      //const key = Environment.GOOGLE_API_KEY;
      //for use with heroku:
      const key = process.env.GOOGLE_API_KEY;

      Geocoder.init(key);
      Geocoder.from(latitude, longitude)
        .then((json) => {
          var addressComponent = json.results[0].address_components;

          //find area name from addressComponent

          var area = addressComponent[2].short_name;

          //console.log(`Area name is ${areaName}`);
          resolve(area);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  handleGetLocation = async () => {
    // Get current location of the device
    const locationData = await getCurrentLocation();
    //get address from latutude & longitude
    const areaName = await getLocationName(
      locationData.latitude,
      locationData.longitude
    );
    setLatitude(locationData.latitude);
    setLongitude(locationData.longitude);
    setArea(areaName);
    handleNextStep();
  };

  /***
   * handleImage:
   * Open a camera and take a picture
   */
  handleImage = () => {
    // Open camera
    var options = {
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };

    launchCamera(options, async (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        const asset = response.assets[0];
        setImgUri(asset.uri);

        await extractDominantColor(asset.uri);
        setImageResponse(response);
      }
    });

    handleNextStep();
  };

  extractDominantColor = async (imageUri) => {
    console.log("imgUri:", imageUri);

    const result = await ImageColors.getColors(imageUri, {
      fallback: "rgb(255, 255, 255)",
      cache: false,
      key: "myKey",
    });

    setTimeout(() => {}, 200);
    console.log("result color:", result.primary);
    setProminentColor(result.primary);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* The third step of adding a new generation: */}
      {step == 2 && (
        <>
          <TextInput
            onChangeText={onChangeText}
            style={{
              height: 40,
              borderColor: "lightgray",
              borderWidth: 1,
              borderRadius: 10,
              width: "80%",
              padding: 10,
            }}
            placeholder="Enter description"
            value={text}
          />
          <Button title="Save Description" onPress={handleSubmitDescription} />
        </>
      )}

      {(step == 1 || step == 3) && (
        <>
          <Text style={{ fontSize: 24 }}>Create a new generation:</Text>
        </>
      )}

      {imgUri && step == 2 && (
        <Image
          source={{
            uri: imgUri,
          }}
          style={{ width: 200, height: 200, borderRadius: 10 }}
        />
      )}

      {area && (
        <Text style={{ color: "gray", margin: 5 }}>Your location: {area}</Text>
      )}
      {description && (
        <Text style={{ color: "gray" }}>Description: {description}</Text>
      )}

      {/* The first step of adding a new generation: */}
      {step == 0 && (
        <>
          <Button title="Get location" onPress={handleGetLocation} />
        </>
      )}
      {/* The second step of adding a new generation: */}
      {step == 1 && (
        <>
          <Button title="Take a picture" onPress={handleImage} />
        </>
      )}

      {step == 3 && (
        <>
          {/* Once location and picture are taken,
          propose a CA design and ask user if they want a custom */}
          {/* if showCA is true, show CA element */}
          {showCA ? (
            <>
              <CAComp
                location="Add"
                locationName={area}
                longitude={longitude}
                latitude={latitude}
                description={description}
                numRows={numRows}
                numCols={numCols}
                cellWidth={cellWidth}
                patterns={pattern}
                color={prominentColor}
                username={username}
              />
            </>
          ) : null}
        </>
      )}
    </View>
  );
};

export default AddScreen;
