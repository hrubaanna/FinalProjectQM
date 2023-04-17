import React, { useCallback, useEffect } from "react";
import { Button, View, Dimensions, TouchableOpacity } from "react-native";
import produce from "immer";

const CAComp = (props) => {
  const { width } = Dimensions.get("window");
  const myPatterns = require("./patterns");
  const Color = require("color");
  const simulationSpeed = 200;

  const [grid, setGrid] = React.useState(() => {
    const rows = [];
    for (let i = 0; i < props.numRows; i++) {
      //setup random grid
      rows.push(
        Array.from(Array(props.numCols), () =>
          //populate the grid with cells that are object with a random value and a color
          ({
            //value: Math.random() > 0.7 ? 1 : 0,
            value: 0,
            color: Math.random() > 0.7 ? "rgb(255,0,0)" : "rgb(0,0,255)",
          })
        )
      );
    }

    return rows;
  });

  const [running, setRunning] = React.useState(false);
  const runningRef = React.useRef(running);
  //current value of runningRef is whatever the value of running is
  runningRef.current = running;

  runSimulation = useCallback(() => {
    //simulation function from: https://medium.com/swlh/cellular-automata-using-react-a8caeaa375e6
    //make sure to use current value of runningRef
    if (!runningRef.current) {
      return;
    } else {
      //simulate
      //go through all cells in grid

      setGrid((g) => {
        //immer is a library that allows you to mutate a copy of data
        //here, we are creating a copy of the grid and then mutating it
        return produce(g, (gridCopy) => {
          //now we can perform a mutaiton on gridCopy
          //and it will set the state on the grid
          for (let i = 0; i < props.numRows; i++) {
            for (let j = 0; j < props.numCols; j++) {
              //check every value in the grid
              //figure out how many neighbors it has
              let neighbors = 0;
              //collect the colors of the neighbors
              let neighborColors = [];
              neighborColors.push(g[i][j].color);
              myPatterns.operations.forEach(([x, y]) => {
                const newI = i + x;
                const newJ = j + y;
                if (
                  newI >= 0 &&
                  newI < props.numRows &&
                  newJ >= 0 &&
                  newJ < props.numCols
                ) {
                  neighbors += g[newI][newJ].value;
                  if (g[newI][newJ].value === 1) {
                    neighborColors.push(g[newI][newJ].color);
                  }
                }
              });

              //apply the rules of the game to the cell
              if (neighbors < 2 || neighbors > 3) {
                //cell dies
                gridCopy[i][j].value = 0;
              } else if (g[i][j].value === 0 && neighbors === 3) {
                //cell is born or continues to live
                gridCopy[i][j].value = 1;

                //calculate the average color of alive neighbors
                let red = 0;
                let green = 0;
                let blue = 0;

                neighborColors.forEach((color) => {
                  const colorObj = Color(color);
                  red += colorObj.red();
                  green += colorObj.green();
                  blue += colorObj.blue();
                });

                const numColors = neighborColors.length;
                red = Math.floor(red / numColors);
                green = Math.floor(green / numColors);
                blue = Math.floor(blue / numColors);

                //set the new color for gridCopy[i][j]
                gridCopy[i][j].color = `rgb(${red}, ${green}, ${blue})`;
              }
            }
          }
        });
      });

      //run the simulation again after 1 second, checking if running is true
      setTimeout(runSimulation, simulationSpeed);
    }
  }, []);

  const loadPatterns = () => {
    //load patterns passed in from props
    if (props.patterns) {
      console.log("patterns: " + props.patterns);
      props.patterns.forEach((pat) => {
        console.log(
          "Adding pattern: " + pat.pattern + " at " + pat.x + ", " + pat.y + ""
        );
        addPattern(pat.y, pat.x, myPatterns[pat.pattern], pat.color);
      });
    }
  };

  const addPattern = (i, j, pattern, color) => {
    //add a pattern to the grid
    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let x = 0; x < pattern.length; x++) {
          for (let y = 0; y < pattern[x].length; y++) {
            gridCopy[i + x][j + y].value = pattern[x][y];
            gridCopy[i + x][j + y].color = color;
          }
        }
      });
    });
  };

  const [patterns, setPatterns] = React.useState(() => {
    //set up patterns to be added to the grid
    loadPatterns();
  });

  return (
    <TouchableOpacity
      onPress={() => {
        //if running is true, run the simulation
        if (!running) {
          runningRef.current = true;
          runSimulation();
        }
        //toggle running
        running ? setRunning(false) : setRunning(true);
      }}
      // style={gridStyle()}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {grid.map((rows, i) =>
          rows.map((cols, k) => (
            <View
              key={`${i}-${k}`}
              style={{
                width: props.cellWidth,
                height: props.cellWidth,
                backgroundColor: grid[i][k].value
                  ? grid[i][k].color
                  : "rgb(255,255,255)",
                borderWidth: 0,
              }}
            />
          ))
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CAComp;
