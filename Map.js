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
        left: 5,
        top: 10,
        width: 1,
        height: 700,
        backgroundColor: "gray",
        zIndex: 10,
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          position: "absolute",
          left: -35,
          width: 90,
          transform: [{ translateY: -0.5 * 10 }, { rotate: "-90deg" }],
          color: "gray",
          fontSize: 10,
          backgroundColor: "white",
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
        left: 15,
        top: 730,
        width: 355,
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
          backgroundColor: "white",
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
        backgroundColor: "white",
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

const MapScreen = ({ navigation, route }) => {
  const [data, setData] = React.useState([]);
  const [scaleX, setScaleX] = React.useState(null);
  const [scaleY, setScaleY] = React.useState(null);
  const [cellSizeX, setCellSizeX] = React.useState(null);
  const [cellSizeY, setCellSizeY] = React.useState(null);
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  const numRows = 90;
  const numCols = 40;
  const cellWidth = width / numCols;
  const username = route.params.username;

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
          `https://glacial-escarpment-05495.herokuapp.com/mapRoutes?latitude=${latitude}&longitude=${longitude}&user=${username}`
        );
        //console.log("response data: ", JSON.stringify(response.data, null, 2));
        let mappedToCoordinates = getCoordinates(
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

  const getCoordinates = (data, userLatitude, userLongitude) => {
    //determine the X and Y position of each item relative to the user's location
    const userGridY = Math.floor(numRows / 2); //--> 45
    const userGridX = Math.floor(numCols / 2); // --> 20

    //Determine which item is the furthest away from the user
    let furthestCoordinate = [0, 0];
    let maxDistance = 0;
    data.forEach((item) => {
      //get distance of each item
      const [longitude, latitude] = item.location.coordinates;
      let curDistance = haversineDistance(
        userLatitude,
        userLongitude,
        latitude,
        longitude
      );
      //if distance is greater than the current max, update furthestCoordinates
      if (curDistance > maxDistance) {
        maxDistance = curDistance;
        furthestCoordinate = [longitude, latitude];
      }
    });

    console.log("furthest coordinate: ", furthestCoordinate);

    //Determine the scaling factor
    //if latitude is the maximum, use the latitude to determine the scaling factor
    //if longitude is the maximum, use the longitude to determine the scaling factor
    const distanceX =
      haversineDistance(
        userLatitude,
        userLongitude,
        userLatitude,
        furthestCoordinate[0]
      ) / userGridX;
    const distanceY =
      haversineDistance(
        userLatitude,
        userLongitude,
        furthestCoordinate[1],
        userLongitude
      ) / userGridY;

    let scalingFactor = 0;
    if (distanceX > distanceY) {
      scalingFactor = distanceX;
    } else {
      scalingFactor = distanceY;
    }

    console.log("scaling factor: ", scalingFactor);
    setScaleY(distanceY);
    setScaleX(distanceX);
    setCellSizeX(distanceX);
    setCellSizeY(distanceY);

    //Determine the X and Y position of each item relative to the user's location

    let minX = 20;
    let maxX = 0;
    let minY = 45;
    let maxY = 0;

    const gridData = data.map((item) => {
      const [longitude, latitude] = item.location.coordinates;
      const distanceXItem = haversineDistance(
        userLatitude,
        userLongitude,
        userLatitude,
        longitude
      );
      const distanceYItem = haversineDistance(
        userLatitude,
        userLongitude,
        latitude,
        userLongitude
      );

      /**TWO OPTIONS
       * 1. Scale the X and Y coordinates by the scaling factor
       * 2. Scale the X and Y coordinates by the distance of the furthest item
       *
       * Using option 1 makes items keep their relative distance to each other,
       * but if x or y is much larger than the other, part of the screen will not be filled
       *
       * Using option 2 makes sure that the screen is filled, but the relative distance between
       * items is not preserved
       */

      let scaledX = Math.floor(distanceXItem / distanceX);
      let scaledY = Math.floor(distanceYItem / distanceY);

      //get coordinate of each item
      if (longitude < userLongitude) {
        scaledX = scaledX * -1;
      }
      if (latitude < userLatitude) {
        scaledY = scaledY * -1;
      }

      scaledX = scaledX + userGridX;
      scaledY = scaledY + userGridY;

      //determine the min and max values of X and Y
      if (scaledX < minX) {
        minX = scaledX;
      }
      if (scaledX > maxX) {
        maxX = scaledX;
      }
      if (scaledY < minY) {
        minY = scaledY;
      }
      if (scaledY > maxY) {
        maxY = scaledY;
      }

      const newItem = {
        CA: item.CA.map((ca) => ({
          ...ca,
          x: scaledX,
          y: scaledY,
        })),
      };
      return newItem;
    });

    console.log("minX: ", minX);
    console.log("maxX: ", maxX);
    console.log("minY: ", minY);
    console.log("maxY: ", maxY);

    return gridData;
  };

  const getScaledCoordinates = (data, userLatitude, userLongitude) => {
    //calculate the rows and cols equivalents of the coordinates relative to the user's location
    //DISNTANCE is applied from the center of the grid

    const userGridY = Math.floor(numCols / 2);
    const userGridX = Math.floor(numRows / 2);

    //Determine the scaling factor
    const maxDistanceX = data.reduce((max, item) => {
      const latitude = item.location.coordinates;
      const distance = haversineDistance(
        userLatitude,
        userLongitude,
        latitude,
        userLongitude
      );
      return Math.max(max, distance);
    }, 0);

    //Determine the scaling factor
    const maxDistanceY = data.reduce((max, item) => {
      const longitude = item.location.coordinates;
      const distance = haversineDistance(
        userLatitude,
        userLongitude,
        userLatitude,
        longitude
      );
      return Math.max(max, distance);
    }, 0);

    const scalingFactorX = maxDistanceX / userGridX;
    const scalingFactorY = maxDistanceY / userGridY;
    const scale = Math.max(scalingFactorX, scalingFactorY);

    setScaleY(scalingFactorY);
    setScaleX(scalingFactorX);
    setCellSizeX(scalingFactorX);
    setCellSizeY(scalingFactorY);

    /**LOG DATA */
    console.log("________________________");
    console.log("userGridX: ", userGridX);
    console.log("userGridY: ", userGridY);
    console.log("scalingFactorX: ", scalingFactorX);
    console.log("scalingFactorY: ", scalingFactorY);
    console.log("scale: ", scale);
    console.log("userLatitude: ", userLatitude);
    console.log("userLongitude: ", userLongitude);
    console.log("________________________");

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

      console.log("________________________");
      if (userLatitude < latitude) {
        console.log("Right");
        multY - 1;
      } else {
        console.log("Left");
      }
      if (userLongitude > longitude) {
        console.log("Down");
        multX = -1;
      } else {
        console.log("Up");
      }

      const gridX = userGridX + multX * Math.floor(scalingFactorX / distanceX);
      const gridY = userGridY + multY * Math.floor(scalingFactorY / distanceY);
      console.log("latitude: " + latitude);
      console.log("longitude: " + longitude);
      console.log("added at: ", gridX, gridY);
      console.log("distanceX: ", distanceX);
      console.log("distanceY: ", distanceY);
      console.log("________________________");

      const newItem = {
        CA: item.CA.map((ca) => ({
          ...ca,
          x: gridY,
          y: gridX,
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
      <View
        style={{
          width: cellWidth,
          height: cellWidth,
          backgroundColor: "rgba(255, 0, 0, 0.5)",
          //place in the middle of the screen
          position: "absolute",
          borderWidth: 0.5,
          left: 195,
          top: 370.5,
          zIndex: 100,
        }}
      />
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
