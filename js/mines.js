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
    if (gGame.isMineInit) {
        return
    }
    var manualPlacement = confirm("Do you want to place mines manually? Click 'OK' for Yes, 'Cancel' for No.");
    if (manualPlacement) {
        addMinesManually(gLevel.mines, gBoard)
    } else {
        addMines(gLevel.mines, gBoard)
    } 

    var currCell = gBoard[cellI][cellJ]
    if (currCell.isMine) {
        gGame.minesCount = 0
        gGame.flagCount = 0
        gBoard = buildBoard()
        return initMinesInBoard(cellI, cellJ)
    }

    gGame.isMineInit = true
    gStartTime = Date.now()
    gTimerInterval = setInterval(updateTimer, 1000)
}

function handleMineClicked(cellI, cellJ) {
    if (gGame.livesCount !== 0) {
        updateLivesCount(-1)
        updateMineCount(-1)
        renderMineCell({ i: cellI, j: cellJ })

    }
    if (gGame.livesCount === 0) {
        renderMineCell({ i: cellI, j: cellJ })
        gameOver()
        return
    }

}

function renderMineCell(location, isMine = true) {
    const cellSelector = `.${getClassName(location)}`
    const elCell = document.querySelector(cellSelector)
    if(isMine) {
        elCell.innerHTML = MINE
        elCell.style.background = 'linear-gradient(to bottom right, #d94848, #d94848)'
        elCell.classList.add('mine-cell')
    } else {
        elCell.innerHTML = EMPTY
        elCell.style.background = ''
        elCell.classList.remove('mine-cell')
    }
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
    gGame.minesCount += diff
    console.log('gGame.minesCount', gGame.minesCount)
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
            board[i][j].minesAroundCount = setMinesNegsCount(i, j, board)
        }
    }
}

function addMinesManually(amountOfMinesToAdd, board) {
    for (var i = 0; i < amountOfMinesToAdd; i++) {
        var userInput = prompt("Enter mine position (format: row,column):")
        var pos = userInput.split(",")
        var row = parseInt(pos[0])-1
        var col = parseInt(pos[1])-1
        console.log(row,col)

        if (isNaN(row) || isNaN(col) || row < 0 || row >= board.length || col < 0 || col >= board[0].length) {
            alert("Invalid position! Please try again.")
            i-- 
            continue
        }

        if (board[row][col].isMine) {
            alert("Position already contains a mine! Please try again.")
            i--; 
            continue
        }

        placeMine(board, row, col)
    }

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            board[i][j].minesAroundCount = setMinesNegsCount(i, j, board)
        }
    }
}



