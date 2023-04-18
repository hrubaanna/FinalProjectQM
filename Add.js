import React from "react";
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
  const [showCA, setShowCA] = React.useState(false);
  const [patterns, setPatterns] = React.useState([]);
  const [step, setStep] = React.useState(0);
  const [description, setDescription] = React.useState(null);

  const width = Dimensions.get("window").width;
  const numRows = 20;
  const numCols = 20;
  const cellWidth = width / numCols;
  var Environment = require("./Environment");
  const myPatterns = require("./patterns");

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
  loadImageTemp = () => {
    const newImgUri =
      "data:image/jpeg;base64,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";

    setImgUri(newImgUri);
    //toggle showImage
    showImage ? setShowImage(false) : setShowImage(true);

    // Extract dominant color from image
    this.extractDominantColor();
    handleNextStep();
  };

  extractDominantColor = async () => {
    const result = await ImageColors.getColors(
      "data:image/jpeg;base64,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",
      {
        fallback: "rgb(255, 255, 255)",
        cache: true,
        key: "myKey",
      }
    );
    setProminentColor(result.primary);
  };

  changePattern = () => {
    //only to be used in History page
    //randomly select a new pattern from the list of patterns
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
      {/* The first step of adding a new generation: */}
      {step == 0 && (
        <>
          <Text style={{ fontSize: 24 }}>Create a new generation</Text>
          <Button title="Get location" onPress={this.handleGetLocation} />
        </>
      )}

      {/* The second step of adding a new generation: */}
      {step == 1 && (
        <>
          <Text>{area}</Text>
          <Button title="Take a picture" onPress={this.loadImageTemp} />
          {/* Image which only appears when imageSelected is true */}
          {showImage && imgUri && (
            <Image
              source={{
                uri: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMWFhUXGBoaGBgYGBcaHRobHxodGhgeIB0dHSggGhsnHR8dITEhJSkrLi4uHR8zODMtNygtLisBCgoKDg0OGxAQGy0mICYyNzMvLS0tLS0tLzIwLS8vLy8tLS0tLS0vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIALIBHAMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAAFBgMEBwACAf/EAEEQAAECBAQDBgQDBgQGAwAAAAECEQADBCEFEjFBBlFhEyJxgZGhMkKxwRTR8AcjUnLh8TNikrIkNGNzgqIVQ8L/xAAbAQADAAMBAQAAAAAAAAAAAAADBAUBAgYAB//EADoRAAEDAgMECQQBAwMFAQAAAAECAxEAIQQxQRJRYXEFE4GRobHB0fAiMuHxFAYjMzRCUnKCorLCNf/aAAwDAQACEQMRAD8AdMGrlVKQClr+rRJVT5K5mScGSkHXR4lTQJpcvZkpS7XvrFDGcJVNSsJIJBCgT7xz7aEK2VITdJII36jwvaKvh1lT8TsJOWcideyqNMEonESpjyzcB7CO45l5US82j6+UDsIw4hZEwkJCtebQX4gqkqypXlVLCv7QZYQopUlN7zwp7+QgYtHVq24GmZt4mhOCFK1KEtF1JZn94P0WD/hpebObB1DaKHD2RKiZSCq7eHKHSkJyOtLHcRsGlOkBNgJkxroONriOe6g9JY1SFbMGDFrSfOKGYPicuYLK02ifFKvIjOi7aiAFZLH4qYuUxGUWFr7x4o8QJQVKScr97pAFYXbWWwoRrntWvI4GhKw6FLCkawdk53Ex6TV6jxBQStS0nnYEgcrxXqOJGBZJeL+HYpKSky1EXNhzB0gBxbSSpcsGVse9d4wvCNqSklXZ6VthVNOPhDyNknLd8taixcSjMUntCb2LtBPD6xMyUglri8L/AAFMK5UxKg6X7pPuImmTJRK5ctTKcsBsd4DiEO2KIk8xbKDu0yrL7Y21tZ7JmRlBG68VJiAkks9wbHlFrCMilKck5bB9IQqlM6WVdo4IOp3HOGbglRmdoCe6wMFU0Sn6e7lr7/inMRhAjDFxK5G+iM1MmVOVMBLqYHlBpCwUukWPKBnZypg7MiynBME0y0SJQSn4Ui93gKmlIaDqjEX5gxEDhFS31AhIuVcdRp7UHn4r2IXnDcvCB1TjYGUJBUV+sXaxKZ57gCibP03gvTUUpCR3EuGu0eZQCjaV2Tl2edYafbaMFBMZyY+XqliE7spaVy0KKmFgDePeF4smcgKPdUCxB5wTpqnMcrQMVhS1Kmp7iQVOCznSNQ2pSJ0mMojh+fOvIU0UlDliLzOk5RrRZM4HlFCul5iACGfQwNrKKamXMaa60hwBvFPh9c7uqmkd4sEq1aNg26NnriABJFyfIdhFbIw6dgrSsWtGu+3zhUVJh6fxBMtBWymJfug7w0VyghBUpI7oj1S0YlqUUn4tthAziKqQuTNQSXYi0DfXtwkHl81j0rLjvXupiSLDWdK8cNY6qpBGVm5aQfzpd4TOEqSd2B7EoSHIu79YLVc5aUsZS7aq5/nDqMGYUpRj/jJsd0ajjRcVh2ziFJaIF4gG450TxNKZiCBrsRq8DKionSZAUUhTDvXNhFnD0Mys3dZ784rYtVlY7IAHO/h5wopl1MFYBndl6Gl8OpJUEC6Zkz43q1hVaFyUqKWe7RdQhK090AeUAsMJdlkMNhE9ZiolMGPSNcS2cOoASoRuvesvNfWQnW+dXjg6FAKKUhSTYsIkJD5Slm94rYbigUDm7pGx5RJWAzE5kqsm569Iy2es2WU5m8Z8zQyFpVsuGw8KgxJE0yz2OUEaPCjUYzOMx5jGYgMyd3/tFzE62atKxIzHre3MCBfBq0Z1GeSFKNn+8MM4fqUuIJkTETnYXO4DzFWcLh0BhTiglUZACVaeFNGK0FWZIWgiwzEb6QKoptWECyi99OcPCMQSEsSIoVmKICm6RspjDtNJ2jPOCfeKjpxC3B1fVi2okW4xnQ7GMSzSwnKSTe12A3gTSYq4y5xoXO8MWLyhLkT+yQXWlgEhze0ZbMWUKSC4JNwbNGOrSUpSDJi/Pu+TVLA4RGMw5Qq0HQ8JNtBpWgUlFNnSitKXGx0e+0TysEExCUTRlWk5ibc/eKvCGNJRIKFKFlFvDf3jzPxkqmEgskkB+kbuqRsJWidoaTuqM6DhMWUgxBgHy8LUVpsLRJeYFG6rizchBVc1xfQxUoqXtQoZiEwExSqmyFlJuzMeY2PSF3y+tIeSmxF7gXnPtrDrqQ4etVflwsK+Vk1EusS9kqR3m6EtFbi3GqfJ2SFELa2QBr8+cDcLwqdUTJk1SibsCQwPQHpFCdh8uTUBU0kqQQWDEEbQzhVqaQEnOBf0nviqGHdbfxTewlSglGYt9QOvDIfIq9RVMsLQpd2DAmIK45lq/hUfKJJ1TTzVPlygkMeXO0WcQw9qXtpJKy7kN8oGsbFhRUTM/PzSaujnkvIGIMIUrOcpm05DdnHKjvD89JkCQgMRqRzMWqzhtJUlaDkKQ1t/6wl4BXzJYJY97aHeXjaCAXvCmIxOyqVcgR5UZZTh8QpGHXI1vPA8DxqnS4J2wV2wcA5b3doIYlRy5NOsSEBBYFkjW8U8MxjMVpQknvE+sSnEFJnErSQMu43hrCPpU4ptdpFyRvGk7xQS6459YVlcDQwQIilidioSlBe4U7ed/aC9LUTahKmDJ5GzwNxelQoFcxKQXcNzMXsKxtKBlUwADDrC+JbKU7CgbGfg5VvicShK0tK+68mRBm8dhoRh+Krk1LAZQ+XL5wVrsfX2hAS5cBhzgbW4d20xVRLSop2OxVppBGlwqbIImzU7ZrXazX6x5QLrO1BIFznFGfx2FceSEoM7IHCQfEETfjUVfxWpDFADtd9ovYJxKZoJUO9m25NAbE8AEwLUlbTDcDYveL/DGBJQhLqJU/eP26RjEGGQDInKL6TR3FYT+KNlH1mMwe2+WRt3UbWFzlOhJ0vA3Fqaaupp0oCR2Zcg7wzyVZbAW6RQxRaZaxNIuH+kEbc61Ab2juMgZQZgxuHfekA84lY6sCwMa5iD3ivXbnP2YHe5QLxOjPaBKkkJLknn0irRY/LVVZ7gKGW8HarEJazlKg3jGE4ZDUkqJO1AFhYXGVYebeQsJUCi0zrx130o0qZkmcLlKM4BY2h6XPSQzg9IVMcxSn70pKFFT6vYdY+4dXpEsqLZto1xgIjq7pNuXHuprGqcWlLjjeyALG17WkaTodaJcRYQlFMtSVqzAZtfNoEcFrKpE4qLsrunkGizV4pMnAykJzFQb84puqSRKUoS3S2UbjnD7IQfqaT9MeQ3mgYbEKVh14aRY7UnheB3X3TUq6uWpRKFZdidv7x6p62WqaAsgkaHrEWO9nKpVIQQokgvbeElNQykh77xjEH+QFIIggm4MxaKt4XCN45raBMTbLTWtHxKnRN+fKSHcdNoGTcQXKlqEtRHI9d4PYXhwMmUZku+UEP1F3i2nB6dQOZAPRy0KYdtS1hsWULzlutGdc2+44hWcpScsx8tSNwpjMxfaoWSCxYsRe7wLVRrM4hiA7lR5PGkow6UiWooSNSfSF2nIUuYtVyLJB0EEfbU2qRmq3AfM6osdLL69RaQE7WW4QKt0hkqyJQvNMca8t4JTcJzF1G8B52JIkjvoAKi4YR7wybUzkZ0pLOQLjaNSkI2kKSZB0sIikXkP4ZQWSYVNxwphEpSg4PIwncYcHzZ60zZYbu98ZgHINi3Noe5NkgcgB4sI9KXzhNLLbSusQTMG827QZojGKdZVtIj53VnHD+DrKFDs1FjyNjy8YnqcPmpYiWoJFjY2h3NSlG4HT7wv1fFKXVL+I3DD2h9tCC2layQTuj5FDx74xRVtJSDMzrYZcalwSsWiSSW1s5a2kUJ0tVXVKlpIsACdgNSfeAtRiKnAUe65YQZ4GnpE6YrQlFutw8bNL63ZbVlz3etIs4Z19lTiR9KMydcrDvo1xHiaKVKZKbfu3BA0",
              }}
              style={{ width: 200, height: 200 }}
            />
          )}
        </>
      )}

      {/* The third step of adding a new generation: */}
      {step == 2 && (
        <>
          <Text>{area}</Text>
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

      {/* The fourth step of adding a new generation: */}
      {step == 3 && (
        <>
          {/* Once location and picture are taken,
          propose a CA design and ask user if they want a custom */}
          {/* if showCA is true, show CA element */}
          <Text>{area}</Text>
          <Text>{description}</Text>
          {showCA ? (
            <>
              <CAComp
                location="Add"
                numRows={numRows}
                numCols={numCols}
                cellWidth={cellWidth}
                patterns={patterns}
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
