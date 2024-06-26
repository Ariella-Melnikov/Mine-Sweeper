"use strict";

function addHintBtns(numHints) {
  var hintContainer = document.querySelector(".hints");
  hintContainer.innerHTML = ""; // Clear existing buttons

  for (var i = 0; i < numHints; i++) {
    var elHintButton = document.createElement("button" + i + 1);
    elHintButton.innerText = HINT;
    elHintButton.classList.add("hint-button");
    elHintButton.addEventListener("click", handleHintClick);
    hintContainer.appendChild(elHintButton);
  }
}

function handleHintClick() {
  if (gGame <= 0) return;
  this.style.backgroundColor = "yellow";
  gGame.hintActive = true;
}

function revealCellAndNeighbors(cellI, cellJ) {
  hintRevealCellsInRange(cellI - 1, cellJ - 1, cellI + 1, cellJ + 1);
}

function hintRevealCellsInRange(startI, startJ, endI, endJ) {
  var cellsToHide = [];
  for (var i = startI; i <= endI; i++) {
    for (var j = startJ; j <= endJ; j++) {
      if (i < 0 || i >= gLevel.size || j < 0 || j >= gLevel.size) {
        continue;
      }

      var currCell = gBoard[i][j];
      if (currCell.isShown) {
        continue;
      }

      currCell.isShown = true;

      var cellValue = currCell.gameElement;
      if (cellValue != MINE && currCell.minesAroundCount > 0) {
        cellValue = currCell.minesAroundCount;
      }

      renderCell({ i: i, j: j }, cellValue);
      cellsToHide.push({ i: i, j: j });
    }
  }
  setTimeout(() => {
    cellsToHide.forEach((cell) => {
      const currCell = gBoard[cell.i][cell.j];
      if (!currCell.isMarked) {
        currCell.isShown = false;
        renderCell(cell, EMPTY);
      }
    });
  }, 2000);
}

function storeUserInfo() {
  var victoryTime = updateTimer();
  if (!victoryTime) return;

  var username = document.querySelector(".username").value;
  if (!username) {
    username = makeId();
  } else {
    var toBeStoredPlayInfo = {
      username: username,
      time: victoryTime,
    }

    var storedInfo = localStorage.getItem("playInfo")
    var playInfoByLevel = storedInfo ? JSON.parse(storedInfo) : {}

    if (playInfoByLevel[gLevel.difficulty]) {
      var existingInfo = playInfoByLevel[gLevel.difficulty]
      if (existingInfo.time < victoryTime) {
        toBeStoredPlayInfo = existingInfo;
      }
    }

    playInfoByLevel[gLevel.difficulty] = toBeStoredPlayInfo
    localStorage.setItem("playInfo", JSON.stringify(playInfoByLevel))
  }
  document.querySelector(
    ".result"
  ).innerHTML = `Level: ${gLevel.difficulty}, Username: ${username}, Time: ${victoryTime} seconds`
}

function displayStoredUserInfo() {
  var storedInfo = localStorage.getItem("playInfo")
  if (storedInfo) {
    var playInfo = JSON.parse(storedInfo)
    if (playInfoByLevel[gLevel.difficulty]) {
      var playInfo = playInfoByLevel[gLevel.difficulty]
      document.querySelector(
        ".result"
      ).innerHTML = `Last Game -  Level ${gLevel.difficulty} - Username: ${playInfo.username}, Time: ${playInfo.time} seconds`
    } else {
      document.querySelector(
        ".result"
      ).innerHTML = `No game info stored for Level ${gLevel.difficulty}`
    }
  } else {
    document.querySelector(".result").innerHTML = `No game info stored`
  }
}

function fullExpand(cellI, cellJ) {
  console.log("is it enter the full Expand?", cellI, cellJ);

  if (cellI < 0 || cellI >= gLevel.size || cellJ < 0 || cellJ >= gLevel.size)
    return;
  var cell = gBoard[cellI][cellJ]

  if (cell.isExpended) return

  cell.isShown = true
  cell.isExpended = true
  saveGameState(cellI, cellJ, cell)
  renderCell(
    { i: cellI, j: cellJ },
    cell.minesAroundCount === 0 ? EMPTY : cell.minesAroundCount
  );
  if (cell.minesAroundCount !== 0) return

  for (var i = cellI - 1; i <= cellI + 1; i++) {
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i !== cellI || j !== cellJ) {
        fullExpand(i, j)
      }
    }
  }
}

function safeClickBtn() {
  if (gGame.safeClickCounter === 0) return

  gGame.safeClickCounter--
  document.querySelector("p.safe-click-counter span").innerText =
    gGame.safeClickCounter

  var safeSpot = findEmptyPos(gBoard)
  console.log("safeSpot", safeSpot)

  var elCell = document.querySelector(`.cell-${safeSpot.i}-${safeSpot.j}`)
  elCell.style.border = "2px solid #103d91"

  setTimeout(() => {
    elCell.style.border = ""
  }, 2000);
}

function toggleDarkMode() {
  const darkModeStylesheet = document.querySelector(".dark-mode-link")
  const darkModeToggleButton = document.querySelector(".dark-mode-toggle")
  const isEnabled = !darkModeStylesheet.disabled;

  darkModeStylesheet.disabled = isEnabled

  if (isEnabled) {
    darkModeToggleButton.innerText = "Dark Mode"
  } else {
    darkModeToggleButton.innerText = "Light Mode"
  }

  if (darkModeStylesheet.disabled) {
    localStorage.removeItem(".dark-mode-link")
  } else {
    localStorage.setItem(".dark-mode-link", "enabled")
  }
}

document
  .querySelector(".dark-mode-toggle")
  .addEventListener("click", toggleDarkMode)

if (localStorage.getItem(".dark-mode-link") === "enabled") {
  document.querySelector(".dark-mode-link").disabled = false
}

function megaHintBtnClick() {
  if (gGame.isMegaHintUsed) {
    console.log("magaHint already used")
    return;
  }
  gGame.isMegaHintOn = true
  gGame.isMegaHintUsed = true
}

function saveGameState(cellI, cellJ, currCell) {
  gGameStateHistory.push({ cellI, cellJ, currCell })
}

function undo() {
  if (gGameStateHistory.length > 0) {
    var undoToCell = gGameStateHistory.pop()
    gBoard[undoToCell.cellI][undoToCell.cellJ].isShown = false
    var location = { i: undoToCell.cellI, j: undoToCell.cellJ }
    if (undoToCell.currCell.isMine) {
      renderMineCell(location, false)
    }
    renderCell(location, EMPTY)
  } else {
    console.log("Cannot undo further.")
  }
}
