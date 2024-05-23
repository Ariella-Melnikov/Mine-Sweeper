'use strict'

const MINE = '💣'
const FLAG = '🚩'
const EMPTY = ''
const RESTART_NORMAL = '🙂'
const RESTART_GAMEOVER = '🤯'
const RESTART_WIN = '😎'
const HINT = '💡'

var gGame
var gBoard
var gMinesCount = 0
var gLevel
var gTimerInterval
var gStartTime
var gLivesCount
var gFlagCount = 0
var gHintCount = 3


gLevel = {
    size: 4,
    mines: 1
}

function onInit() {
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    gMinesCount = 0
    updateMineCount(0)
    gFlagCount = 0
    updateFlagCount(0)
    gHintCount = 3


    gBoard = buildBoard()
    renderBoard(gBoard)
    console.table(gBoard)
    resetTimer()
    updateLivesCount(0, true)
    document.querySelector('.restart-btn').innerText = RESTART_NORMAL
    displayStoredUserInfo()
    addHint()

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
                gameElement: null,
                hintActive: false
            }

        }
    }

    // placeMine(board, 0, 0)
    // placeMine(board, 3, 3)

    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]
            const cellClass = getClassName({ i: i, j: j })

            const cellColorClass = currCell.isShown === false ? 'not-showed' : 'showed'

            strHTML += `<td class="cell ${cellClass} ${cellColorClass}" 
            data-i="${i}" data-j="${j}" 
            onclick="cellClicked(event)"
            oncontextmenu="cellClicked(event)">
            ${EMPTY}
            </td>`

            strHTML += '</td>'
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML

}

function getClassName(location) {
    return `cell-${location.i}-${location.j}`;
}

function cellClicked(event) {
    const cell = event.target
    const cellI = parseInt(cell.getAttribute('data-i'))
    const cellJ = parseInt(cell.getAttribute('data-j'))
    const buttonClicked = event.button
    console.log('buttonClicked', buttonClicked)

    // if (gGame.hintActive) {
    //     revealCellAndNeighbors(cellI, cellJ)
    //     gGame.hintActive = false
    //     return
    // }

    if (buttonClicked === 2) {
        event.preventDefault()
        onCellClicked(cellI, cellJ, "right")
    }

    if (buttonClicked === 0) {
        onCellClicked(cellI, cellJ, "left")
    }
}

function onCellClicked(cellI, cellJ, mouseButton) {
    initMinesInBoard(cellI, cellJ)
    var currCell = gBoard[cellI][cellJ]

    if (mouseButton === "left") {
        if (currCell.isMarked) return
        currCell.isShown = true
        if (currCell.gameElement === MINE) {
            handleMineClicked(cellI, cellJ)
        } else {
            currCell.minesAroundCount = setMinesNegsCount(cellI, cellJ, gBoard);
            renderCell({ i: cellI, j: cellJ }, currCell.minesAroundCount === 0 ? EMPTY : currCell.minesAroundCount)
        }
    } else if (mouseButton === "right") {
        onCellMarked(cellI, cellJ)
    }
}

function onCellMarked(cellI, cellJ) {
    var currCell = gBoard[cellI][cellJ]
    if (currCell.isShown) return

    if (!currCell.isMarked) {
        if (gFlagCount > 0) {
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
        currCell.isMarked = false
        updateFlagCount(1)
        renderCell({ i: cellI, j: cellJ }, EMPTY)
        if (currCell.gameElement === MINE) {
            updateMineCount(1)
        }
    }
}

function renderCell(location, value) {
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
    const currCell = gBoard[location.i][location.j];

    if (currCell.isShown) {
        elCell.classList.remove('not-showed')
        elCell.classList.add('showed')
    } else {
        // If the cell is not shown, remove the 'showed' class and add the 'not-showed' class
        elCell.classList.remove('showed')
        elCell.classList.add('not-showed')
    }
    elCell.innerText = value;
}

function checkVictory() {
    if (gMinesCount > 0) {
        return false
    }

    alert('Yayyyy!!! you won! What a champ!')
    document.querySelector('.restart-btn').innerText = RESTART_WIN
    revealAllCells()
    var victoryTime = updateTimer()
    console.log(victoryTime, 'victoryTime')
    storeUserInfo()
    clearInterval(gTimerInterval)
    console.log('clearInterval', clearInterval)
    return true

}

function gameOver() {
    alert('Game Over! You clicked on a mine.')
    clearInterval(gTimerInterval)
    document.querySelector('.restart-btn').innerText = RESTART_GAMEOVER

}

function updateTimer() {
    var elapsedTime = Math.floor((Date.now() - gStartTime) / 1000)
    document.getElementById('timer').innerText = elapsedTime
    return elapsedTime
}

function resetTimer() {
    clearInterval(gTimerInterval)
    document.getElementById('timer').innerText = 0
    gGame.secsPassed = 0
}

function updateLivesCount(diff, reset = false) {
    if (reset) {
        gLivesCount = 2
    } else {
        gLivesCount += diff
    }
    document.querySelector('h2.lives-left span').innerText = gLivesCount
}

function updateFlagCount(diff) {
    
    gFlagCount += diff
    console.log('flagCount', gFlagCount)
    document.querySelector('h2.total-flag span').innerText = gFlagCount
}

function revealAllCells() {
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[i].length; j++) {
            const cell = gBoard[i][j]
            if (!cell.isShown) {
                cell.isShown = true
                renderCell({ i: i, j: j }, cell.gameElement)
            }
        }
    }
}

