import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import CAComp from "./CAComp";
import axios from "axios";

const dateToString = (dateTime) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const date = new Date(dateTime);
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const day = date.getDate();

  return `${dayName} ${monthName} ${day}`;
};

const GenerationItem = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.generationItem}>
        <Text style={styles.itemTitle}>{props.location}</Text>
        <Text style={styles.itemSubtitle}>on {dateToString(props.time)}</Text>
        <Text style={styles.itemSubtitle}>{props.description}</Text>
        <View style={styles.caCompContainer}>
          <CAComp
            location="History"
            numRows={21}
            numCols={19}
            cellWidth={9}
            patterns={props.CA}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const HistoryScreen = ({ route }) => {
  const [data, setData] = React.useState([]);
  const username = route.params.username;

  React.useEffect(() => {
    //fetch the generations from the server, sorted by date
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://glacial-escarpment-05495.herokuapp.com/historyRoutes?username=${username}`
        );
        setData(response.data);
      } catch (err) {
        console.log("Error fetching data: ", err);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={{ flex: 1, flexDirection: "column" }}>
      <View style={styles.generationsList}>
        {/* All previous additions */}
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <GenerationItem
              location={item.locationName}
              time={item.time}
              description={item.description}
              CA={item.CA}
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  generationsList: {
    flex: 6,
    backgroundColor: "#F1F1F1",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  generationItem: {
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: 300,
  },
  navigationSpace: {
    flex: 1,
    backgroundColor: "#F1F1F1",
    paddingTop: 20,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemSubtitle: {
    fontSize: 12,
    color: "#666",
  },
  caCompContainer: {
    width: "66%",
    alignSelf: "center",
    marginTop: 15,
    marginBottom: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default HistoryScreen;
