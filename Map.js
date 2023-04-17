import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CAComp from "./CAComp";
import { Dimensions } from "react-native";

const MapScreen = () => {
  const patterns = [
    //array of patterns and their coordinates
    {
      pattern: "loaf",
      x: 15,
      y: 20,
      color: "rgb(255, 255, 0)",
    },
    {
      pattern: "glider",
      x: 13,
      y: 18,
      color: "rgb(255, 128, 0)",
    },
  ];

  const width = Dimensions.get("window").width;
  const numRows = 100;
  const numCols = 60;
  const cellWidth = width / numCols;

  return (
    <View>
      <CAComp
        numRows={numRows}
        numCols={numCols}
        cellWidth={cellWidth}
        patterns={patterns}
      />
    </View>
  );
};

export default MapScreen;
