import React, { useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  Button,
} from "react-native";
import CAComp from "./CAComp";
import axios from "axios";

const GenerationItem = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.generationItem}>
        <Text style={styles.itemTitle}>{props.location}</Text>
        <Text style={styles.itemSubtitle}>on {props.time}</Text>
        <Text>{props.description}</Text>
        <View style={styles.caCompContainer}>
          <CAComp numRows={21} numCols={19} cellWidth={9} patterns={props.CA} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const HistoryScreen = () => {
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [detailsVisible, setDetailsVisible] = React.useState(false);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/history");
        setData(response.data);
      } catch (err) {
        console.log("Error fetching data: ", err);
      }
    };
    fetchData();
  }, []);

  const handleItemPress = (item) => {
    setSelectedItem(item);
    setDetailsVisible(true);
  };

  return (
    <View style={{ flex: 1, flexDirection: "column" }}>
      <View style={styles.generationsList}>
        {/* All previous additions */}
        <FlatList
          data={
            data
            //   [
            // {
            //   location: "Hackney",
            //   time: "Monday",
            //   description: "A beautiful day in the park",
            //   CA: [
            //     { pattern: "glider", x: 5, y: 5, color: "rgb(128, 0, 128)" },
            //   ],
            // },
            // {
            //   location: "Camden",
            //   time: "Friday",
            //   description: "test",
            //   CA: [{ pattern: "loaf", x: 5, y: 5, color: "rgb(266, 15, 20)" }],
            // },
            //   { location: "Kensington", time: "Thursday" },
            //   { location: "Islington", time: "Monday" },
            //   { location: "Hackney", time: "Tuesday" },
            //   { location: "Chelsea", time: "Wednesday" },
            //   { location: "Hackney", time: "Saturday" },
            //   { location: "Camden", time: "Saturday" },
            //   { location: "Fulham", time: "Sunday" },
            //   { location: "Hackney", time: "Monday" },
            //   { location: "Kensington", time: "Wednesday" },
            //   { location: "Hackney", time: "Monday" },
            //   { location: "Fulham", time: "Thursday" },
            //   { location: "Islington", time: "Friday" },
            //   { location: "Westminster", time: "Saturday" },
            // ]
          }
          renderItem={({ item }) => (
            <GenerationItem
              location={item.location}
              time={item.time}
              CA={item.CA}
              onPress={() => handleItemPress(item)}
            />
          )}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailsVisible}
        onRequestClose={() => {
          setDetailsVisible(!detailsVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text stlye={styles.itemSubtitle}>
              {selectedItem && selectedItem.description}
            </Text>
            <Button
              title="Close"
              onPress={() => setDetailsVisible(!detailsVisible)}
            />
          </View>
        </View>
      </Modal>
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
