import React, { useEffect } from "react";
import GetLocation from "react-native-get-location";
import Geocoder from "react-native-geocoding";
import { launchCamera } from "react-native-image-picker";
import ImageColors from "react-native-image-colors";
import CAComp from "./CAComp";
import { Dimensions } from "react-native";

import { Button, Image, StyleSheet, Text, TextInput, View } from "react-native";

const AddScreen = () => {
  const [text, onChangeText] = React.useState(null);
  const [location, setLocation] = React.useState(null);
  const [area, setArea] = React.useState(null);
  const [imgPath, setImgPath] = React.useState(null);
  const [imgData, setImgData] = React.useState(null);
  const [imgUri, setImgUri] = React.useState(null);
  const [showImage, setShowImage] = React.useState(false);
  const [prominentColor, setProminentColor] = React.useState(null);
  const [showCA, setShowCA] = React.useState(true);
  const [patterns, setPatterns] = React.useState([]);
  const [step, setStep] = React.useState(0);
  const [description, setDescription] = React.useState(null);

  const width = Dimensions.get("window").width;
  const numRows = 20;
  const numCols = 20;
  const cellWidth = width / numCols;
  var Environment = require("./Environment");
  const myPatterns = require("./patterns");

  useEffect(() => {
    //set the patterns to a random pattern from the patterns.js file
    setPatterns(myPatterns[Math.floor(Math.random() * myPatterns.length)]);
  });

  handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      //step == 4 -> reset to 0
      setStep(0);
      //reset all states
      onChangeText(null);
      setLocation(null);
      setArea(null);
      setImgPath(null);
      setImgData(null);
      setImgUri(null);
      setShowImage(false);
      setProminentColor(null);
      setShowCA(false);
      setPatterns([]);
      setDescription(null);
    }
  };

  handleSubmitDescription = () => {
    setDescription(text);

    if (step == 2) {
      setShowImage(false);
      this.extractDominantColor();
      console.log("dominant color: ", prominentColor);
    }

    handleNextStep();
  };

  handleGetLocation = () => {
    // Get current location of the device
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then((newLocation) => {
        //get address from latutude & longitude
        const key = Environment.GOOGLE_API_KEY;
        Geocoder.init(key);

        Geocoder.from(newLocation.latitude, newLocation.longitude)
          .then((json) => {
            var addressComponent = json.results[0].address_components;

            //find area name from addressComponent
            var area = addressComponent.find((item) => {
              return item.types.includes("neighborhood");
            });

            var areaName = area ? area.long_name : "Not found";
            console.log(`Area name is ${areaName}`);
            setArea(areaName);
          })
          .catch((error) => console.warn(error));
      })
      .catch((error) => {
        const { code, message } = error;
        console.warn(code, message);
      });

    //move to the next step
    handleNextStep();
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

    handleNextStep();
  };

  /**
   * temp fix for handleImage:
   * have a preloaded image to display
   */
  loadImageTemp = async () => {
    const newImgUri =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Halleyparknovember.jpg/1200px-Halleyparknovember.jpg";

    await new Promise((resolve) => {
      setImgUri(newImgUri);
      resolve();
    });
    //toggle showImage
    showImage ? setShowImage(false) : setShowImage(true);
    // Extract dominant color from image
    //this.extractDominantColor();

    handleNextStep();
  };

  extractDominantColor = async () => {
    const result = await ImageColors.getColors(imgUri, {
      fallback: "rgb(255, 255, 255)",
      cache: true,
      key: "myKey",
    });
    setProminentColor(result.primary);
  };

  changePattern = () => {
    ///NOT IN USE

    //only to be used in Add page (it cleans the entire grid)
    //randomly select a new pattern from the list of patterns

    console.log("color: ", prominentColor);
    console.log("patterns: ", patterns);

    const patternList = myPatterns.patternNames;
    const randomPattern =
      patternList[Math.floor(Math.random() * patternList.length)];

    const newPattern = {
      pattern: randomPattern,
      x: 5,
      y: 5,
      color: prominentColor,
    };

    setPatterns((prevPatterns) => [...prevPatterns, newPattern]);
    console.log(patterns);
    setShowCA(true);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          backgroundColor: prominentColor,
          padding: 20,
          borderRadius: 10,
          width: "80%",
        }}
      ></View>
      <Text style={{ fontSize: 24 }}>Create a new generation:</Text>

      {area && <Text>Your location: {area}</Text>}

      {showImage && imgUri && (
        <Image
          source={{
            uri: imgUri,
          }}
          style={{ width: 200, height: 200 }}
        />
      )}

      {description && <Text>{description}</Text>}

      {/* The first step of adding a new generation: */}
      {step == 0 && (
        <>
          <Button title="Get location" onPress={this.handleGetLocation} />
        </>
      )}
      {/* The second step of adding a new generation: */}
      {step == 1 && (
        <>
          <Button title="Take a picture" onPress={this.loadImageTemp} />
        </>
      )}

      {/* The third step of adding a new generation: */}
      {step == 2 && (
        <>
          <TextInput
            onChangeText={onChangeText}
            style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
            placeholder="Enter description"
            value={text}
          />
          <Button
            title="Save Description"
            onPress={this.handleSubmitDescription}
          />
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
                numRows={numRows}
                numCols={numCols}
                cellWidth={cellWidth}
                patterns={patterns}
                color={prominentColor}
              />
              <Button title="Submit Generation" onPress={this.handleNextStep} />
            </>
          ) : null}
        </>
      )}
    </View>
  );
};

export default AddScreen;
