import React, { useCallback, useEffect } from "react";
import { Button, View, Dimensions, TouchableOpacity } from "react-native";
import produce from "immer";

const CAComp = (props) => {
  var numRows;
  var numCols;
  var cellWidth;

  const { width, height } = Dimensions.get("window");
  const myPatterns = require("./patterns");
  const simulationSpeed = 500;

  //setup sizing and number of rows and cols depending on props
  if (props.location == "Home" || props.location == "History") {
    //on home screen and history, use 20 rows and 20 cols
    numRows = 20;
    numCols = 20;

    //set the width of the cells to be 1/20th of the width of the screen
    console.log("width: " + width);
    console.log("numCols: " + numCols);

    cellWidth = 270 / numCols;
  } else {
    //on MAP screen, use 60 rows and 50 cols
    numRows = 90;
    numCols = 60;
    cellWidth = width / numCols;
  }

  gridStyle = () => {
    if (props.location == "Home") {
      return {
        //padding: 50,
        height: 300,
        width: 300,
        borderWidth: 1,
      };
    } else if (props.location == "History") {
    } else {
      return {
        padding: 0,
      };
    }
  };

  const [grid, setGrid] = React.useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      //rows.push(Array.from(Array(numCols), () => 0));
      //setup random grid
      rows.push(
        Array.from(Array(numCols), () =>
          //populate the grid with cells that are object with a random value and a color
          ({
            //value: Math.random() > 0.7 ? 1 : 0,
            value: 0,
            color: Math.random() > 0.7 ? "red" : "blue",
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
          for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
              //check every value in the grid
              //figure out how many neighbors it has
              let neighbors = 0;
              myPatterns.operations.forEach(([x, y]) => {
                const newI = i + x;
                const newJ = j + y;
                if (
                  newI >= 0 &&
                  newI < numRows &&
                  newJ >= 0 &&
                  newJ < numCols
                ) {
                  neighbors += g[newI][newJ].value;
                }
              });

              //apply the rules of the game to the cell
              if (neighbors < 2 || neighbors > 3) {
                //cell dies
                gridCopy[i][j].value = 0;
              } else if (g[i][j].value === 0 && neighbors === 3) {
                //cell is born or continues to live
                gridCopy[i][j].value = 1;
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
      props.patterns.forEach((pat) => {
        addPattern(pat.x, pat.y, myPatterns[pat.pattern]);
      });
    }
  };

  const addPattern = (i, j, pattern) => {
    //add a pattern to the grid
    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let x = 0; x < pattern.length; x++) {
          for (let y = 0; y < pattern[x].length; y++) {
            gridCopy[i + x][j + y].value = pattern[x][y];
          }
        }
      });
    });
  };

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
      style={gridStyle()}
    >
      <Button title="add patterns" onPress={() => loadPatterns()} />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <View
              key={`${i}-${k}`}
              style={{
                width: cellWidth,
                height: cellWidth,
                backgroundColor: grid[i][k].value ? grid[i][k].color : "white",
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
