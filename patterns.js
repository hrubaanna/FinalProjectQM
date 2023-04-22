//this file contains the various patterns that are used in the game

module.exports = {
  patternNames: ["glider", "loaf", "beacon", "toad", "blinker", "boat"],
  operations: [
    //representation of the 8 cells around a cell
    [0, 1],
    [0, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
    [-1, -1],
    [1, 0],
    [-1, 0],
  ],

  glider: [
    [0, 1, 0],
    [0, 0, 1],
    [1, 1, 1],
  ],
  loaf: [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [0, 1, 0, 1],
    [0, 0, 1, 0],
  ],
  blinker: [[1], [1], [1]],
  toad: [
    [0, 1, 1, 1],
    [1, 1, 1, 0],
  ],
  beacon: [
    [1, 1, 0, 0],
    [1, 1, 0, 0],
    [0, 0, 1, 1],
    [0, 0, 1, 1],
  ],
  pentadecathlon: [
    [0, 0, 1, 1, 1, 0, 0],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [0, 0, 1, 1, 1, 0, 0],
  ],
  gliderGun: [
    [0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0],
    [1, 1, 0, 0, 0, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0],
  ],
  boat: [
    [1, 1, 0],
    [1, 0, 1],
    [0, 1, 0],
  ],
};
