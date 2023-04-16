import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CAComp from "./CAComp";

const MapScreen = () => {
  const patterns = [
    //array of patterns and their coordinates
    {
      pattern: "loaf",
      x: 15,
      y: 20,
    },
    {
      pattern: "glider",
      x: 40,
      y: 10,
    },
  ];

  return (
    <View>
      <CAComp location="Map" patterns={patterns} />
    </View>
  );
};

export default MapScreen;
