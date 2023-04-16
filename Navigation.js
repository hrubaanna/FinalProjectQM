import React from "react";
import { StyleSheet, Button, View } from "react-native";

const Navigation = ({ navigation }) => {
  return (
    <View style={styles.navigationSpace}>
      <Button
        onPress={() => navigation.navigate("History")}
        title="See History"
      />
      <Button onPress={() => navigation.navigate("Add")} title="Add new" />
      <Button onPress={() => navigation.navigate("Map")} title="Map" />
    </View>
  );
};

const styles = StyleSheet.create({
  navigationSpace: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: "white",
    paddingTop: 20,
    justifyContent: "space-evenly",
  },
});

export default Navigation;
