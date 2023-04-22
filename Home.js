import React from "react";
import { StyleSheet, Button, Image, Text, View } from "react-native";
import Navigation from "./Navigation";
import CAComp from "./CAComp";
import { Dimensions } from "react-native";
import axios from "axios";

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

const HomeScreen = ({ navigation }) => {
  const width = Dimensions.get("window").width;
  const numRows = 20;
  const numCols = 20;
  const cellWidth = width / numCols;

  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    //fetch the single most recent generation from the database
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://glacial-escarpment-05495.herokuapp.com/homeRoutes"
        );
        //console.log("response data: ", JSON.stringify(response.data, null, 2));
        console.log("response data: ", response.data[0].CA);
        setData(response.data[0]);
      } catch (err) {
        console.log("Error fetching data: ", err);
      }
    };
    fetchData();
  }, []);

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
