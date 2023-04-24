import React from "react";
import { StyleSheet, Button, View } from "react-native";

const Navigation = ({ navigation }) => {
  const username = props.username;
  return (
    <View style={styles.navigationSpace}>
      <Button
        onPress={() => navigation.navigate("History")}
        title="See History"
      />
      <Button
        onPress={() => navigation.navigate("Add", { username: username })}
        title="Add new"
      />
      <Button
        onPress={() => navigation.navigate("Map", { username: username })}
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
