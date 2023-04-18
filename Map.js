import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CAComp from "./CAComp";
import { Dimensions } from "react-native";
import axios from "axios";

const MapScreen = () => {
  const patterns = [
    //array of patterns and their coordinates
    {
      pattern: "loaf",
      x: 0,
      y: 30,
      color: "rgb(255, 255, 0)",
    },
    {
      pattern: "glider",
      x: 30,
      y: 0,
      color: "rgb(255, 128, 0)",
    },
  ];

  const [data, setData] = React.useState([]);
  const width = Dimensions.get("window").width;
  const numRows = 100;
  const numCols = 60;
  const cellWidth = width / numCols;

  const getCoordinates = (data) => {
    //Calculate the rows and cols equivalents of the coordinates
    //returned by the database
    let minLongitude = Infinity;
    let maxLongitude = -Infinity;
    let minLatitude = Infinity;
    let maxLatitude = -Infinity;

    data.forEach(({ location: { coordinates } }) => {
      const [longitude, latitude] = coordinates;
      minLongitude = Math.min(minLongitude, longitude);
      maxLongitude = Math.max(maxLongitude, longitude);
      minLatitude = Math.min(minLatitude, latitude);
      maxLatitude = Math.max(maxLatitude, latitude);
    });

    //map the coordinates to the rows and cols of the grid
    const targetMinLongitude = 0;
    const targetMaxLongitude = numCols * 0.6;
    const targetMinLatitude = 0;
    const targetMaxLatitude = numRows * 0.6;
    // const targetMinLongitude = 5;
    // const targetMaxLongitude = 10;
    // const targetMinLatitude = 5;
    // const targetMaxLatitude = 10;

    const mappedArray = data.map((item) => {
      const [longitude, latitude] = item.location.coordinates;

      const newLongitude = Math.floor(
        targetMinLongitude +
          ((longitude - minLongitude) / (maxLongitude - minLongitude)) *
            (targetMaxLongitude - targetMinLongitude)
      );
      const newLatitude = Math.floor(
        targetMinLatitude +
          ((latitude - minLatitude) / (maxLatitude - minLatitude)) *
            (targetMaxLatitude - targetMinLatitude)
      );

      const newItem = {
        CA: item.CA.map((ca) => ({
          ...ca,
          x: newLongitude,
          y: newLatitude,
        })),
      };
      return newItem;
    });
    return mappedArray;
  };

  React.useEffect(() => {
    //get the closest generations from the user's location
    const fetchData = async () => {
      //TODO: get the user's location
      const latitude = -0.053;
      const longitude = 51.508;

      try {
        const response = await axios.get(
          `http://localhost:3000/mapRoutes?latitude=${latitude}&longitude=${longitude}`
        );
        //console.log("response data: ", JSON.stringify(response.data, null, 2));
        let mappedToCoordinates = getCoordinates(response.data);
        //transform this data into the format that the CAComp expects
        const transformedData = mappedToCoordinates.map((item) => item.CA[0]);

        setData(transformedData);
      } catch (err) {
        console.log("Error fetching data: ", err);
      }
    };
    fetchData();
  }, []);

  return (
    <View>
      <CAComp
        location="Map"
        numRows={numRows}
        numCols={numCols}
        cellWidth={cellWidth}
        patterns={data}
      />
    </View>
  );
};

export default MapScreen;
