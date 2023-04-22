import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CAComp from "./CAComp";
import { Dimensions } from "react-native";
import axios from "axios";
import GetLocation from "react-native-get-location";

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

  const [userLocation, setUserLocation] = React.useState([]);
  const [data, setData] = React.useState([]);
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

      const latitude = -0.053;
      const longitude = 51.508;

      try {
        const response = await axios.get(
          `http://localhost:3000/mapRoutes?latitude=${latitude}&longitude=${longitude}`
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

    const scalingFactorX = maxDistance / userGridX;
    const scalingFactorY = maxDistance / userGridY;

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
      if (userLatitude < latitude) {
        distanceY *= -1;
      }
      if (userLongitude > longitude) {
        distanceX *= -1;
      }

      const gridX = userGridX + Math.floor(distanceX / scalingFactorX);
      const gridY = userGridY + Math.floor(distanceY / scalingFactorY);

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

  const getCoordinates = (data, latitude, longitude) => {
    //Calculate the rows and cols equivalents of the coordinates
    //returned by the database
    //DISNTANCE is applied from (0,0) as center of the grid
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
