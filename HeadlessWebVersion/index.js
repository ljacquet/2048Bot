/* GAME CODE */
function getTileIndex(x, y) {
  if (x < 0 || x > 3) {
    // console.log("ERROR GETTING COORDS" + x + ":" + y);
    return -1;
  }

  if (y < 0 || y > 3) {
    // console.log("ERROR GETTING COORDS" + x + ":" + y);
    return -1;
  }

  return y * 4 + x;
}

function getTileValue(x, y, tiles) {
  return tiles[getTileIndex(x, y)];
}

function updateTile(x, y, data, tiles) {
  //   let tile = $("#" + x + "" + y);
  let oldValue = getTileValue(x, y, tiles);
  let newValue = data;

  //   tile.children()[0].innerHTML = newValue == 0 ? "" : newValue;

  //   tile.removeClass("gameBox-" + oldValue);
  //   tile.addClass("gameBox-" + newValue);

  tiles[getTileIndex(x, y)] = data;
}

function getFreshState() {
  let tiles = new Array(4 * 4).fill(0);
  spawnBlock(tiles);
  spawnBlock(tiles);

  return tiles;
}

function checkForValidMoves(tiles) {
  let highestValue = 0;
  let validTiles = false;
  let won = false;
  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 4; y++) {
      let tile = getTileValue(x, y, tiles);
      if (highestValue < tile) {
        highestValue = tile;
      }

      if (tile == 2048) {
        won = true;
        // return { valid: undefined, won: true, highestValue };
      }

      if (
        tile == getTileValue(x + 1, y, tiles) ||
        tile == getTileValue(x - 1, y, tiles) ||
        tile == getTileValue(x, y - 1, tiles) ||
        tile == getTileValue(x, y + 1, tiles)
      ) {
        validTiles = true;
        // return { valid: true, won: false, highestValue };
      }
    }
  }

  //   // No valid moves, reset game (if in AI let ai code handle it)
  //   if (!aiMode) {
  //     resetGame();
  //   }
  return { valid: validTiles, won, highestValue };
}

function spawnBlock(tiles) {
  let spawn = [0, 0];
  do {
    spawn[0] = Math.floor(Math.random() * 4);
    spawn[1] = Math.floor(Math.random() * 4);
  } while (getTileValue(spawn[0], spawn[1], tiles) != 0);

  updateTile(spawn[0], spawn[1], 2, tiles);
  return spawn;
}

function handleColumn(column, tiles) {
  updatedColumns = false;
  score = 0;

  for (let i = 1; i < 4; i++) {
    let mainElement = column[i];
    let modElement = column[i - 1];

    if (mainElement == null || modElement == null) {
      continue;
    }

    // Check that main exists, main cannot match with mod, and mod has not already combined
    if (mainElement.value <= 0 || modElement.combined) {
      continue;
    }

    if (mainElement.value == modElement.value) {
      updatedColumns = true;

      // Update Score
      score += mainElement.value + modElement.value;

      updateTile(
        modElement.x,
        modElement.y,
        mainElement.value + modElement.value,
        tiles
      );
      modElement.value = modElement.value + mainElement.value;
      modElement.combined = true;

      updateTile(mainElement.x, mainElement.y, 0, tiles);
      mainElement.value = 0;
      continue;
    }

    if (modElement.value == 0) {
      updatedColumns = true;

      updateTile(modElement.x, modElement.y, mainElement.value, tiles);
      modElement.value = mainElement.value;
      modElement.combined = mainElement.combined;

      updateTile(mainElement.x, mainElement.y, 0, tiles);
      mainElement.value = 0;
      mainElement.combined = false;

      i -= 2;
      continue;
    }
  }

  return { updatedColumns, score };
}

function handleArrowUp(tiles) {
  let shouldSpawnBlock = false;
  let scoreIncrease = 0;

  for (let x = 0; x < 4; x++) {
    // build column object (0 is end being pushed into)
    let columnData = [];
    for (let y = 0; y < 4; y++) {
      columnData.push({
        x,
        y,
        value: getTileValue(x, y, tiles),
        combined: false,
      });
    }

    let columnResponse = handleColumn(columnData, tiles);

    if (columnResponse.updatedColumns) {
      shouldSpawnBlock = true;
    }

    scoreIncrease += columnResponse.score;
  }

  if (shouldSpawnBlock) {
    spawnBlock(tiles);

    // We moved something, check board still valid
    // checkForValidMoves();
  }

  return { validMove: shouldSpawnBlock, scoreIncrease };
}

function handleArrowRight(tiles) {
  let shouldSpawnBlock = false;
  let scoreIncrease = 0;

  for (let y = 0; y < 4; y++) {
    // build column object (0 is end being pushed into)
    let columnData = [];
    for (let x = 3; x >= 0; x--) {
      columnData.push({
        x,
        y,
        value: getTileValue(x, y, tiles),
        combined: false,
      });
    }

    let columnResponse = handleColumn(columnData, tiles);

    if (columnResponse.updatedColumns) {
      shouldSpawnBlock = true;
    }

    scoreIncrease += columnResponse.score;
  }

  if (shouldSpawnBlock) {
    spawnBlock(tiles);

    // We moved something, check board still valid
    // checkForValidMoves();
  }

  return { validMove: shouldSpawnBlock, scoreIncrease };
}

function handleArrowDown(tiles) {
  let shouldSpawnBlock = false;
  let scoreIncrease = 0;

  for (let x = 0; x < 4; x++) {
    // build column object (0 is end being pushed into)
    let columnData = [];
    for (let y = 3; y >= 0; y--) {
      columnData.push({
        x,
        y,
        value: getTileValue(x, y, tiles),
        combined: false,
      });
    }

    let columnResponse = handleColumn(columnData, tiles);

    if (columnResponse.updatedColumns) {
      shouldSpawnBlock = true;
    }

    scoreIncrease += columnResponse.score;
  }

  if (shouldSpawnBlock) {
    spawnBlock(tiles);

    // We moved something, check board still valid
    // checkForValidMoves();
  }

  return { validMove: shouldSpawnBlock, scoreIncrease };
}

function handleArrowLeft(tiles) {
  let shouldSpawnBlock = false;
  let scoreIncrease = 0;

  for (let y = 0; y < 4; y++) {
    // build column object (0 is end being pushed into)
    let columnData = [];
    for (let x = 0; x < 4; x++) {
      columnData.push({
        x,
        y,
        value: getTileValue(x, y, tiles),
        combined: false,
      });
    }

    let columnResponse = handleColumn(columnData, tiles);

    if (columnResponse.updatedColumns) {
      shouldSpawnBlock = true;
    }

    scoreIncrease += columnResponse.score;
  }

  if (shouldSpawnBlock) {
    spawnBlock(tiles);

    // We moved something, check board still valid
    // checkForValidMoves();
  }

  return { validMove: shouldSpawnBlock, scoreIncrease };
}

function checkKey(e, tiles) {
  switch (e) {
    case "ArrowUp":
      return handleArrowUp(tiles);
    case "ArrowRight":
      return handleArrowRight(tiles);
    case "ArrowDown":
      return handleArrowDown(tiles);
    case "ArrowLeft":
      return handleArrowLeft(tiles);
  }

  return { validMove: false, scoreIncrease: 0 };
}

/* WEB SERVER */

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

function normalize(o) {
  if (o == 0) {
    return 0;
  }

  return Math.log2(o) / 11;
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
  pingTimeout: 60,
});

io.on("connection", (socket) => {
  console.log("Socket Connection");

  socket.on("resetGame", (args, callback) => {
    state = getFreshState();
    //resetGame();
    callback({
      state: state,
    });
  });

  socket.on("tick", (data, callback) => {
    actionArray = [...data.action].sort();

    let gameResponse = checkKey(
      ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"][
        data.action.indexOf(actionArray[0])
      ],
      data.state
    );

    if (!gameResponse.validMove) {
      gameResponse = checkKey(
        ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"][
          data.action.indexOf(actionArray[1])
        ],
        data.state
      );
    }

    let gameOver = false;
    if (!gameResponse.validMove) {
      gameOver = true;
    }

    let gameValidity = checkForValidMoves(data.state);
    if (!gameValidity.valid) {
      gameOver = true;
    }

    if (gameValidity.won) {
      gameResponse.scoreIncrease += 2048;
    }

    // console.log(gameResponse.scoreIncrease);

    callback({
      reward: gameResponse.scoreIncrease,
      newState: data.state,
      gameOver: gameOver,
      largestTile: gameValidity.highestValue,
    });
  });
});

httpServer.listen(3000);

// var http = require("http");

// var http_server = http.createServer();

// var express = require("express");
// const ws = require("ws");

// // Set up a headless websocket server that prints any
// // events that come in.
// // const wsServer = new ws.Server({ noServer: true });
// // wsServer.on("connection", (socket) => {
// //   socket.on("message", (message) => {
// //     console.log(message);
// //     let req = JSON.parse(message);
// //     if (req.requestType == "reset") {
// //       resetGame();
// //       socket.send(JSON.stringify(tiles));
// //     } else {
// //       if (req.requestType == "action") {
// //         let gameResponse = checkKey(
// //           ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"][
// //             action.indexOf(Math.max(...req.action))
// //           ]
// //         );

// //         // if (!gameResponse.validMove) {
// //         //   gameResponse.scoreIncrease = -4;
// //         // }

// //         let gameOver = false;
// //         let gameValidity = checkForValidMoves();
// //         if (!gameValidity.valid) {
// //           gameResponse.scoreIncrease = -4;
// //           gameOver = true;
// //         }

// //         if (gameValidity.won) {
// //           gameResponse.scoreIncrease += 2048;
// //         }

// //         console.log(gameResponse.scoreIncrease);

// //         socket.send(
// //           JSON.stringify({
// //             reward: gameResponse.scoreIncrease,
// //             newState: tiles.map(normalize),
// //             gameOver: gameOver,
// //           })
// //         );
// //       }
// //     }
// //   });
// // });

// // // `server` is a vanilla Node.js HTTP server, so use
// // // the same ws upgrade process described here:
// // // https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server
// // const server = app.listen(3000);
// // server.on("upgrade", (request, socket, head) => {
// //   wsServer.handleUpgrade(request, socket, head, (socket) => {
// //     wsServer.emit("connection", socket, request);
// //   });
// // });

// var app = express();
// app.use(express.json());

// app.post("/resetgame", function (request, response) {
//   resetGame();
//   console.log("-- Reset Game --");
//   response.sendStatus(200);
// });

// function normalize(o) {
//   if (o == 0) {
//     return 0;
//   }

//   return Math.log2(o) / 11;
// }

// app.get("/getState", function (request, response) {
//   response.json(tiles.map(normalize));
// });

// app.post("/takeAction", function (request, response) {
//   let action = request.body;

//   let gameResponse = checkKey(
//     ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"][
//       action.indexOf(Math.max(...action))
//     ]
//   );

//   if (!gameResponse.validMove) {
//     gameResponse.scoreIncrease = -4;
//   }

//   let gameOver = false;
//   let gameValidity = checkForValidMoves();
//   if (!gameValidity.valid) {
//     gameResponse.scoreIncrease = -4;
//     gameOver = true;
//   }

//   if (gameValidity.won) {
//     gameResponse.scoreIncrease += 2048;
//   }

//   console.log(gameResponse.scoreIncrease);

//   response.json({
//     reward: gameResponse.scoreIncrease,
//     newState: tiles.map(normalize),
//     gameOver: gameOver,
//   });
// });

// // Start server and listen on 8080
// app.listen(8080, () => {
//   console.log("App Listening at http://localhost:8080");
// });
