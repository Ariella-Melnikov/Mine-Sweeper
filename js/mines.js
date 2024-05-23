'use strict'

function setMinesNegsCount(cellI, cellJ, mat) {
    var count = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue
            if (i === cellI && j === cellJ) continue
            if (mat[i][j].gameElement === MINE) count++
        }
    }
    return count
}

function initMinesInBoard(cellI, cellJ) {
    if (gGame.isOn) {
        return
    }

    addMines(gLevel.mines, gBoard)
    var currCell = gBoard[cellI][cellJ]
    if (currCell.isMine) {
        gMinesCount = 0
        gFlagCount = 0
        gBoard = buildBoard()
        return initMinesInBoard(cellI, cellJ)
    }


    gGame.isOn = true
    gStartTime = Date.now()
    gTimerInterval = setInterval(updateTimer, 1000)
    // addHintBtns()
}

function handleMineClicked(cellI, cellJ) {
    if (gLivesCount !== 0) {
        updateLivesCount(-1)
        updateMineCount(-1)
        renderMineCell({ i: cellI, j: cellJ })

    }
    if (gLivesCount === 0) {
        gGame.isOn = false
        renderMineCell({ i: cellI, j: cellJ })
        revelAllMines()
        gameOver()
        return
    }

}

function renderMineCell(location) {
    const cellSelector = `.${getClassName(location)}`
    const elCell = document.querySelector(cellSelector)
    elCell.innerHTML = MINE
    elCell.style.backgroundColor = 'red'
}

function revelAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMine && !gBoard[i][j].isShown) {
                gBoard[i][j].isShown = true
                renderCell({ i: i, j: j }, MINE)
            }
        }
    }
    return gBoard
}

function updateMineCount(diff) {
    gMinesCount += diff
    console.log('gMinesCount', gMinesCount)
}

function placeMine(board, i, j) {
    board[i][j].gameElement = MINE
    board[i][j].isMine = true
    updateMineCount(1)
    updateFlagCount(1)
}

function addMines(amountOfMinesToAdd, board) {
    for (var i = 0; i < amountOfMinesToAdd; i++) {
        var emptyCell = findEmptyPos(board)
        if (!emptyCell) return
        placeMine(board, emptyCell.i, emptyCell.j)
    }
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            board[i][j].minesAroundCount=setMinesNegsCount(i, j, board)
        }
    }
}


function findEmptyPos(board) {
    var emptyPoss = []

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (!board[i][j].isMine) {
                var pos = { i: i, j: j }
                emptyPoss.push(pos)
            }
        }
    }
    var randIdx = getRandomInt(0, emptyPoss.length) // 0 , 1
    var randPos = emptyPoss[randIdx]
    return randPos
}

