import React from "react";
import { StyleSheet, Button, Image, Text, View } from "react-native";
import Navigation from "./Navigation";
import CAComp from "./CAComp";
import { Dimensions } from "react-native";

const HomeScreen = ({ navigation }) => {
  const patterns = [
    //array of patterns and their coordinates
    {
      pattern: "glider",
      x: 5,
      y: 5,
      color: "rgb(128, 0, 128)",
    },
  ];

  const width = Dimensions.get("window").width;
  const numRows = 20;
  const numCols = 20;
  const cellWidth = width / numCols;

  return (
    <View style={{ flexDirection: "column", flex: 1 }}>
      <View style={styles.lastGeneration}>
        {/* This view holds the information about the last generation
            added by the user
             */}
        <Text style={styles.primaryText}>
          Take a look at your last addition:
        </Text>
        <CAComp
          numRows={numRows}
          numCols={numCols}
          cellWidth={cellWidth}
          patterns={patterns}
        />
        <Text style={styles.secondaryText}>Hackney, Monday</Text>
      </View>
      {/* This view is the navigation space  */}
      <Navigation navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  lastGeneration: {
    flex: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  primaryText: {
    color: "#333",
    margin: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  secondaryText: {
    color: "#666",
    margin: 10,
    fontSize: 15,
  },
  tempImg: {
    width: 200,
    height: 200,
    marginTop: 10,
    margin: 20,
  },
});

export default HomeScreen;
