import React from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Navigation from "./Navigation";
import CAComp from "./CAComp";
import { Dimensions } from "react-native";
import axios from "axios";

/***
 * The Home Screen
 * This screen allows the user to view their most recent pattern
 * and navigate to other screens
 */

const dateToDay = (dateTime) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const date = new Date(dateTime);
  return days[date.getDay()];
};

const HomeScreen = ({ navigation, route }) => {
  const width = Dimensions.get("window").width;
  const numRows = 20;
  const numCols = 20;
  const cellWidth = width / numCols;
  const username = route.params.username;

  const [data, setData] = React.useState([]);
  const [modalVisible, setModalVisible] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      //fetch the single most recent generation from the database
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `https://glacial-escarpment-05495.herokuapp.com/homeRoutes?username=${username}`
          );
          //console.log("response data: ", JSON.stringify(response.data, null, 2));
          console.log("response data: ", response.data[0].CA);
          setData(response.data[0]);
        } catch (err) {
          console.log("Error fetching data: ", err);
          if (err.response.status === 500) {
            setModalVisible(true);
          }
        }
      };
      fetchData();

      // Return a cleanup function to cancel any ongoing request if the component is unmounted
      return () => {
        // Cancel the request if needed
      };
    }, [])
  );

  return (
    <View style={{ flexDirection: "column", flex: 1 }}>
      {modalVisible && (
        <Modal animationType="slide">
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ fontSize: 30 }}> Server Error. </Text>
            <Text style={{ margin: 5, fontSize: 25, padding: 15 }}>
              Error loading content. Please try again later.
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#007AFF",
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 4,
                marginBottom: 16,
              }}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "#fff", fontSize: 16 }}>Continue</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
      <View style={styles.lastGeneration}>
        {/* This view holds the information about the last generation
            added by the user
             */}
        <Text style={styles.primaryText}>
          Take a look at your last addition:
        </Text>
        <CAComp
          location="Home"
          numRows={numRows}
          numCols={numCols}
          cellWidth={cellWidth}
          patterns={data.CA}
        />
        <Text style={styles.secondaryText}>
          {data.locationName}, {dateToDay(data.time)}
        </Text>
      </View>
      {/* This view is the navigation space  */}
      <Navigation navigation={navigation} username={username} />
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
