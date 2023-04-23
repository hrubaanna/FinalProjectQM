import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CAComp from "./CAComp";
import { Dimensions } from "react-native";
import axios from "axios";
import GetLocation from "react-native-get-location";

const ScaleLineY = ({ distance }) => {
  return (
    <View
      style={{
        position: "absolute",
        left: 1,
        top: 5,
        width: 1,
        height: 640,
        backgroundColor: "gray",
        zIndex: 10,
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          position: "absolute",
          left: -25,
          width: 70,
          transform: [{ translateY: -0.5 * 10 }, { rotate: "-90deg" }],
          color: "gray",
          fontSize: 10,
        }}
      >
        {Math.floor(distance)} meters
      </Text>
    </View>
  );
};
const ScaleLineX = ({ distance }) => {
  return (
    <View
      style={{
        position: "absolute",
        left: 5,
        bottom: 0,
        width: 380,
        height: 1,
        backgroundColor: "gray",
        zIndex: 10,
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          position: "absolute",
          left: 4,
          bottom: 2,
          transform: [{ translateX: 160 }],
          color: "gray",
          fontSize: 10,
        }}
      >
        {Math.floor(distance)} meters
      </Text>
    </View>
  );
};

const CellSize = ({ width, height, cellSize }) => {
  return (
    <View
      style={{
        position: "absolute",
        right: 30,
        top: 10,
        width: cellSize,
        height: cellSize,
        borderColor: "gray",
        borderWidth: 1,
        zIndex: 10,
      }}
    >
      <Text
        style={{
          position: "absolute",
          width: 20,
          right: 1,
          top: 10,
          transform: [{ translateX: 10 }],
          color: "gray",
          fontSize: 10,
        }}
      >
        {Math.floor(width)}
      </Text>
      <Text
        style={{
          position: "absolute",
          right: 5,
          top: -17,
          width: 20,
          transform: [{ translateY: 10 }, { rotate: "-90deg" }],
          color: "gray",
          fontSize: 10,
        }}
      >
        {Math.floor(height)}
      </Text>
    </View>
  );
};

const MapScreen = () => {
  const [data, setData] = React.useState([]);
  const [scaleX, setScaleX] = React.useState(null);
  const [scaleY, setScaleY] = React.useState(null);
  const [cellSizeX, setCellSizeX] = React.useState(null);
  const [cellSizeY, setCellSizeY] = React.useState(null);
  const width = Dimensions.get("window").width;
  const numRows = 100;
  const numCols = 60;
  const cellWidth = width / numCols;

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      })
        .then((location) => {
          resolve(location);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  React.useEffect(() => {
    //get the closest generations from the user's location
    const fetchData = async () => {
      //get the user's location
      const location = await getCurrentLocation();
      console.log("location: ", location);
      //Uncomment this line to use the user's location
      //const {latitude, longitude} = location;

      const latitude = location.longitude;
      const longitude = location.latitude;

      console.log("users location: ", latitude, longitude);

      try {
        const response = await axios.get(
          `https://glacial-escarpment-05495.herokuapp.com/mapRoutes?latitude=${latitude}&longitude=${longitude}`
        );
        //console.log("response data: ", JSON.stringify(response.data, null, 2));
        let mappedToCoordinates = getScaledCoordinates(
          response.data,
          longitude,
          latitude
        );
        //transform this data into the format that the CAComp expects
        const transformedData = mappedToCoordinates.map((item) => item.CA[0]);

        setData(transformedData);
      } catch (err) {
        console.log("Error fetching data: ", err);
      }
    };
    fetchData();
  }, []);

  const toRadians = (degrees) => {
    return (degrees * Math.PI) / 180;
  };

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    //use the Haversine formula to calculate the distance
    //between two points on the Earth's surface, given their latitude and longitude

    const R = 6371e3; // Earth's radius in meters
    const phi1 = toRadians(lat1);
    const phi2 = toRadians(lat2);
    const deltaPhi = toRadians(lat2 - lat1);
    const deltaLambda = toRadians(lon2 - lon1);

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) *
        Math.cos(phi2) *
        Math.sin(deltaLambda / 2) *
        Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const getScaledCoordinates = (data, userLatitude, userLongitude) => {
    //calculate the rows and cols equivalents of the coordinates relative to the user's location
    //DISNTANCE is applied from the center of the grid

    const userGridX = Math.floor(numCols / 2);
    const userGridY = Math.floor(numRows / 2);

    //Determine the scaling factor
    const maxDistance = data.reduce((max, item) => {
      const [longitude, latitude] = item.location.coordinates;
      const distance = haversineDistance(
        userLatitude,
        userLongitude,
        latitude,
        longitude
      );
      return Math.max(max, distance);
    }, 0);

    console.log("max distance: ", maxDistance);

    const scalingFactorX = maxDistance / userGridX;
    const scalingFactorY = maxDistance / userGridY;
    setScaleY(scalingFactorY);
    setScaleX(scalingFactorX);
    setCellSizeX(scalingFactorX);
    setCellSizeY(scalingFactorY);

    //transform the coordinates to the rows and cols of the grid
    const gridData = data.map((item) => {
      const [longitude, latitude] = item.location.coordinates;
      let distanceX = haversineDistance(
        userLatitude,
        userLongitude,
        userLatitude,
        longitude
      );

      let distanceY = haversineDistance(
        userLatitude,
        userLongitude,
        latitude,
        userLongitude
      );

      //get the sign of the distance
      let multX = 1;
      let multY = 1;

      if (userLatitude < latitude) {
        multY - 1;
      }
      if (userLongitude > longitude) {
        multX = -1;
      }

      const gridX = userGridX + multX * Math.floor(distanceX / scalingFactorX);
      const gridY = userGridY + multY * Math.floor(distanceY / scalingFactorY);

      console.log("one unit of distance: ", scalingFactorX, scalingFactorY);

      const newItem = {
        CA: item.CA.map((ca) => ({
          ...ca,
          x: gridX,
          y: gridY,
        })),
      };
      return newItem;
    });
    return gridData;
  };

  return (
    <View>
      {scaleY !== null && <ScaleLineY distance={scaleY * numRows} />}
      {scaleX !== null && <ScaleLineX distance={scaleX * numCols} />}
      {cellSizeX !== null && cellSizeY !== null && (
        <CellSize width={cellSizeX} height={cellSizeY} cellSize={cellWidth} />
      )}
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
