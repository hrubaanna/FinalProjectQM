import React from "react";
import { StyleSheet, Button, View } from "react-native";

const Navigation = ({ navigation, username }) => {
  return (
    <View style={styles.navigationSpace}>
      <Button
        onPress={() => navigation.navigate("History", { username })}
        title="See History"
      />
      <Button
        onPress={() => navigation.navigate("Add", { username })}
        title="Add new"
      />
      <Button
        onPress={() => navigation.navigate("Map", { username })}
        title="Map"
      />
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
