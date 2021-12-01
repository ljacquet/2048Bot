tiles = new Array(4 * 4).fill(0);
currentScore = 0;
aiMode = false;

window.onload = () => {
  let highScore = localStorage.getItem("HighScore");
  if (highScore == null) {
    localStorage.setItem("HighScore", 0);
  }

  $("#highScore").text(highScore);
};

// Preset Tiles
startTile1X = Math.floor(Math.random() * 4);
startTile1Y = Math.floor(Math.random() * 4);
startTile2X = startTile1X;
startTile2Y = startTile1Y;

while (startTile1X == startTile2X && startTile1Y == startTile2Y) {
  startTile2X = Math.floor(Math.random() * 4);
  startTile2Y = Math.floor(Math.random() * 4);
}

function getTileIndex(x, y) {
  if (x < 0 || x > 3) {
    console.log("ERROR GETTING COORDS" + x + ":" + y);
    return -1;
  }

  if (y < 0 || y > 3) {
    console.log("ERROR GETTING COORDS" + x + ":" + y);
    return -1;
  }

  return y * 4 + x;
}

function getTileValue(x, y) {
  return tiles[getTileIndex(x, y)];
}

function updateTile(x, y, data) {
  let tile = $("#" + x + "" + y);
  let oldValue = getTileValue(x, y);
  let newValue = data;

  tile.children()[0].innerHTML = newValue == 0 ? "" : newValue;

  tile.removeClass("gameBox-" + oldValue);
  tile.addClass("gameBox-" + newValue);

  tiles[getTileIndex(x, y)] = data;
}

function resetGame() {
  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 4; y++) {
      updateTile(x, y, 0);
    }
  }

  spawnBlock();
  spawnBlock();

  updateScore(0);
}

function checkForValidMoves() {
  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 4; y++) {
      let tile = getTileValue(x, y);
      if (
        tile == getTileValue(x + 1, y) ||
        tile == getTileValue(x - 1, y) ||
        tile == getTileValue(x, y - 1) ||
        tile == getTileValue(x, y + 1)
      ) {
        return true;
      }
    }
  }

  // No valid moves, reset game (if in AI let ai code handle it)
  if (!aiMode) {
    resetGame();
  }
  return false;
}

function updateHighScore(score) {
  let currentHighScore = localStorage.getItem("HighScore");
  if (currentHighScore == null || currentHighScore < score) {
    localStorage.setItem("HighScore", score);
    $("#highScore").text(score);
  }
}

function updateScore(score) {
  currentScore = score;
  $("#currentScore").text(score);

  updateHighScore(currentScore);
}

function addToScore(score) {
  updateScore(currentScore + score);
}

// Update Game Board
updateTile(startTile1X, startTile1Y, 2);
updateTile(startTile2X, startTile2Y, 2);

function spawnBlock() {
  let spawn = [0, 0];
  do {
    spawn[0] = Math.floor(Math.random() * 4);
    spawn[1] = Math.floor(Math.random() * 4);
  } while (getTileValue(spawn[0], spawn[1]) != 0);

  updateTile(spawn[0], spawn[1], 2);
  return spawn;
}

function handleColumn(column) {
  updatedColumns = false;
  score = 0;

  for (let i = 1; i < 4; i++) {
    let mainElement = column[i];
    let modElement = column[i - 1];

    if (mainElement == null || modElement == null) {
      console.error("NULL COLUMNS");
      console.log(column);
      continue;
    }

    // Check that main exists, main cannot match with mod, and mod has not already combined
    if (mainElement.value <= 0 || modElement.combined) {
      continue;
    }

    if (mainElement.value == modElement.value) {
      updatedColumns = true;

      // Update Score
      addToScore(mainElement.value + modElement.value);
      score += mainElement.value + modElement.value;

      updateTile(
        modElement.x,
        modElement.y,
        mainElement.value + modElement.value
      );
      modElement.value = modElement.value + mainElement.value;
      modElement.combined = true;

      updateTile(mainElement.x, mainElement.y, 0);
      mainElement.value = 0;
      continue;
    }

    if (modElement.value == 0) {
      updatedColumns = true;

      updateTile(modElement.x, modElement.y, mainElement.value);
      modElement.value = mainElement.value;
      modElement.combined = mainElement.combined;

      updateTile(mainElement.x, mainElement.y, 0);
      mainElement.value = 0;
      mainElement.combined = false;

      i -= 2;
      continue;
    }
  }

  return { updatedColumns, score };
}

function handleArrowUp() {
  let shouldSpawnBlock = false;
  let scoreIncrease = 0;

  for (let x = 0; x < 4; x++) {
    // build column object (0 is end being pushed into)
    let columnData = [];
    for (let y = 0; y < 4; y++) {
      columnData.push({ x, y, value: getTileValue(x, y), combined: false });
    }

    let columnResponse = handleColumn(columnData);

    if (columnResponse.updatedColumns) {
      shouldSpawnBlock = true;
    }

    scoreIncrease += columnResponse.score;
  }

  if (shouldSpawnBlock) {
    spawnBlock();

    // We moved something, check board still valid
    checkForValidMoves();
  }

  return { validMove: shouldSpawnBlock, scoreIncrease };
}

function handleArrowRight() {
  let shouldSpawnBlock = false;
  let scoreIncrease = 0;

  for (let y = 0; y < 4; y++) {
    // build column object (0 is end being pushed into)
    let columnData = [];
    for (let x = 3; x >= 0; x--) {
      columnData.push({ x, y, value: getTileValue(x, y), combined: false });
    }

    let columnResponse = handleColumn(columnData);

    if (columnResponse.updatedColumns) {
      shouldSpawnBlock = true;
    }

    scoreIncrease += columnResponse.score;
  }

  if (shouldSpawnBlock) {
    spawnBlock();

    // We moved something, check board still valid
    checkForValidMoves();
  }

  return { validMove: shouldSpawnBlock, scoreIncrease };
}

function handleArrowDown() {
  let shouldSpawnBlock = false;
  let scoreIncrease = 0;

  for (let x = 0; x < 4; x++) {
    // build column object (0 is end being pushed into)
    let columnData = [];
    for (let y = 3; y >= 0; y--) {
      const element = getTileValue(x, y);
      columnData.push({ x, y, value: getTileValue(x, y), combined: false });
    }

    let columnResponse = handleColumn(columnData);

    if (columnResponse.updatedColumns) {
      shouldSpawnBlock = true;
    }

    scoreIncrease += columnResponse.score;
  }

  if (shouldSpawnBlock) {
    spawnBlock();

    // We moved something, check board still valid
    checkForValidMoves();
  }

  return { validMove: shouldSpawnBlock, scoreIncrease };
}

function handleArrowLeft() {
  let shouldSpawnBlock = false;
  let scoreIncrease = 0;

  for (let y = 0; y < 4; y++) {
    // build column object (0 is end being pushed into)
    let columnData = [];
    for (let x = 0; x < 4; x++) {
      columnData.push({ x, y, value: getTileValue(x, y), combined: false });
    }

    let columnResponse = handleColumn(columnData);

    if (columnResponse.updatedColumns) {
      shouldSpawnBlock = true;
    }

    scoreIncrease += columnResponse.score;
  }

  if (shouldSpawnBlock) {
    spawnBlock();

    // We moved something, check board still valid
    checkForValidMoves();
  }

  return { validMove: shouldSpawnBlock, scoreIncrease };
}

function checkKey(e) {
  switch (e.key) {
    case "ArrowUp":
      return handleArrowUp();
    case "ArrowRight":
      return handleArrowRight();
    case "ArrowDown":
      return handleArrowDown();
    case "ArrowLeft":
      return handleArrowLeft();
  }

  return { validMove: false, scoreIncrease: 0 };
}

document.onkeydown = checkKey;

// AI HANDLING
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

function getAIMove(reward, training) {
  return new Promise((resolve, reject) => {
    $.ajax("/tick", {
      data: JSON.stringify({
        state: tiles,
        reward: reward,
        training: training,
      }),
      type: "POST",
      success: (data) => {
        resolve(data);
      },
      error: (err) => {
        reject(err);
      },
    });
  });
}

let training = true;
async function startAILoop() {
  let lastReward = -1;
  while (aiMode) {
    let move = await getAIMove(lastReward, training);
    console.log(move.direction);

    let actionResponse = checkKey({ key: "Arrow" + move.direction });

    if (!actionResponse.validMove) {
      if (!checkForValidMoves()) {
        resetGame();
      }

      lastReward = -4;
    } else {
      lastReward = actionResponse.scoreIncrease;
    }
  }
}

function activateAI() {
  if ($("#flexSwitchCheckDefault").prop("checked")) {
    aiMode = true;
    startAILoop();
  } else {
    aiMode = false;
  }
}
