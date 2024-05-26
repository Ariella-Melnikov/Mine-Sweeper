"use strict"

const MINE = "💣"
const FLAG = "🚩"
const EMPTY = ""
const RESTART_NORMAL = "🙂"
const RESTART_GAMEOVER = "🤯"
const RESTART_WIN = "😎"
const HINT = "💡"

var gBoard
var gLevel
var gTimerInterval
var gStartTime
var gGame
var gGameStateHistory = []

gLevel = {
  difficulty: '',
  size: 0,
  mines: 0,
}

function onInit() {
  gGame = {
    isMineInit: false,
    minesCount: 0,
    flagCount: 0,
    livesCount: 3,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    numOfHints: 3,
    hintActive: false,
    safeClickCounter: 3,
    isOn: true,
    isMegaHintUsed: false,
    isMegaHintOn: false,
    megaHintCells: [],
  }
  updateMineCount(0)
  updateFlagCount(0)

  gBoard = buildBoard()
  renderBoard(gBoard)
  console.table(gBoard)
  resetTimer()
  updateLivesCount(0, true)
  changeRestartGameBtn(RESTART_NORMAL)

  displayStoredUserInfo()
  addHintBtns(gGame.numOfHints)
}

function gameDifficulty(difficulty, size, mines) {
  gLevel.difficulty = difficulty
  gLevel.mines = mines
  gLevel.size = size
  onInit()
}

function buildBoard() {
  const board = createMat(gLevel.size)

  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
        isExpended: false,
        gameElement: null,
      }
    }
  }
  return board
}

function renderBoard(board) {
  var strHTML = ""
  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>"
    for (var j = 0; j < board[0].length; j++) {
      const currCell = board[i][j]
      const cellClass = getClassName({ i: i, j: j })

      const cellColorClass =
        currCell.isShown === false ? "not-showed" : "showed"

      strHTML += `<td class="cell ${cellClass} ${cellColorClass}" 
            data-i="${i}" data-j="${j}" 
            onclick="cellClicked(event)"
            oncontextmenu="cellClicked(event)">
            ${EMPTY}
            </td>`

      strHTML += "</td>"
    }
    strHTML += "</tr>"
  }
  const elBoard = document.querySelector(".board")
  elBoard.innerHTML = strHTML
}

function getClassName(location) {
  return `cell-${location.i}-${location.j}`
}

function cellClicked(event) {
  if (!gGame.isOn) return

  const cell = event.target;
  const cellI = parseInt(cell.getAttribute("data-i"))
  const cellJ = parseInt(cell.getAttribute("data-j"))
  const buttonClicked = event.button

  if (buttonClicked === 2) {
    event.preventDefault()
    onCellMarked(cellI, cellJ)
  }

  if (buttonClicked === 0) {
    onCellClicked(cellI, cellJ)
  }
}

function onCellClicked(cellI, cellJ) {
  initMinesInBoard(cellI, cellJ)
  var currCell = gBoard[cellI][cellJ]

  saveGameState(cellI, cellJ, currCell)

  if (!gGame.isMineInit) return
  if (currCell.isMarked) return

  if (gGame.hintActive) {
    gGame.numOfHints--
    revealCellAndNeighbors(cellI, cellJ)
    addHintBtns(gGame.numOfHints)
    gGame.hintActive = false
    return
  }

  if (gGame.isMegaHintOn) {
    var currCellIdx = { i: cellI, j: cellJ }
    gGame.megaHintCells.push(currCellIdx)
    if (gGame.megaHintCells.length == 2) {
      let startI = gGame.megaHintCells[0].i
      let startJ = gGame.megaHintCells[0].j
      let endI = gGame.megaHintCells[1].i
      let endJ = gGame.megaHintCells[1].j
      hintRevealCellsInRange(startI, startJ, endI, endJ)
    }
  }

  currCell.isShown = true
  if (currCell.gameElement === MINE) {
    handleMineClicked(cellI, cellJ)
  } else {
    renderCell(
      { i: cellI, j: cellJ },
      currCell.minesAroundCount === 0 ? EMPTY : currCell.minesAroundCount
    )

    if (currCell.minesAroundCount === 0) {
      fullExpand(cellI, cellJ)
    }
  }
}

function onCellMarked(cellI, cellJ) {
  var currCell = gBoard[cellI][cellJ]
  if (currCell.isShown) return

  if (!currCell.isMarked) {
    if (gGame.flagCount > 0) {
      currCell.isMarked = true
      updateFlagCount(-1)
      renderCell({ i: cellI, j: cellJ }, FLAG)
      if (currCell.gameElement === MINE) {
        updateMineCount(-1)
        if (checkVictory()) {
          return
        }
      }
    }
  } else {
    currCell.isMarked = false;
    updateFlagCount(1);
    renderCell({ i: cellI, j: cellJ }, EMPTY);
    if (currCell.gameElement === MINE) {
      updateMineCount(1);
    }
  }
}

function renderCell(location, value) {
  const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
  const currCell = gBoard[location.i][location.j]

  if (currCell.isShown) {
    elCell.classList.remove("not-showed")
    elCell.classList.add("showed")
  } else {
    elCell.classList.remove("showed")
    elCell.classList.add("not-showed")
  }
  elCell.innerText = value
}

function checkVictory() {
  if (gGame.minesCount > 0) {
    return false
  }

  clearInterval(gTimerInterval)
  changeRestartGameBtn(RESTART_WIN)
  revealAllCells()
  storeUserInfo()
  gGame.isOn = false
  return true
}

function gameOver() {
  clearInterval(gTimerInterval)
  changeRestartGameBtn(RESTART_GAMEOVER)
  revelAllMines()
  gGame.isMineInit = false
  gGame.isOn = false
  return
}

function updateTimer() {
  var elapsedTime = Math.floor((Date.now() - gStartTime) / 1000)
  document.getElementById("timer").innerText = elapsedTime
  return elapsedTime
}

function resetTimer() {
  clearInterval(gTimerInterval);
  document.getElementById("timer").innerText = 0
  gGame.secsPassed = 0
}

function updateLivesCount(diff, reset = false) {
  if (reset) {
    gGame.livesCount = 3
  } else {
    gGame.livesCount += diff
  }
  document.querySelector("h2.lives-left span").innerText = gGame.livesCount
}

function updateFlagCount(diff) {
  gGame.flagCount += diff
  document.querySelector("h2.total-flag span").innerText = gGame.flagCount
}

function revealAllCells() {
  for (let i = 0; i < gBoard.length; i++) {
    for (let j = 0; j < gBoard[i].length; j++) {
      const cell = gBoard[i][j];
      if (!cell.isShown) {
        cell.isShown = true
        renderCell({ i: i, j: j }, cell.gameElement)
      }
    }
  }
}

function changeRestartGameBtn(msg) {
  document.querySelector(".restart-btn").innerText = msg
}
