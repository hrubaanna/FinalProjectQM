import React from "react";
import { StyleSheet, Button, Image, Text, View } from "react-native";
import Navigation from "./Navigation";
import CAComp from "./CAComp";

const HomeScreen = ({ navigation }) => {
  const patterns = [
    //array of patterns and their coordinates
    {
      pattern: "glider",
      x: 5,
      y: 5,
    },
  ];

  return (
    <View style={{ flexDirection: "column", flex: 1 }}>
      <View style={styles.lastGeneration}>
        {/* This view holds the information about the last generation
            added by the user
             */}
        <Text style={styles.primaryText}>
          Take a look at your last addition:
        </Text>
        <CAComp location="Home" patterns={patterns} />
        <Text style={styles.secondaryText}>Location: Hackney</Text>
        <Text style={styles.secondaryText}>Time: Monday</Text>
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
    backgroundColor: "blue",
  },
  primaryText: {
    color: "white",
    margin: 10,
    fontSize: 20,
  },
  secondaryText: {
    color: "white",
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
