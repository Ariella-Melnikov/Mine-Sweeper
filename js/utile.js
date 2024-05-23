'use strict'

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function getRandomColor() {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

function getClassName(location) {
    const cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}

function copyMat(mat) {
    var newMat = []
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = []
        for (var j = 0; j < mat[0].length; j++) {
            newMat[i][j] = mat[i][j]
        }
    }
    return newMat
}

function createMat(rows, cols = rows) {
    var board = []
    for (var i = 0; i < rows; i++) {
        board.push([])
        for (var j = 0; j < cols; j++) {
            board[i][j] = []
        }
    }
    return board
}

function findEmptyPos() {
    // var emptyPoss = [{i:0,j:0},{i:0,j:1}]
    var emptyPoss = []

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j]
            if (!cell) {
                // console.log('cell:', cell)
                var pos = { i: i, j: j }
                emptyPoss.push(pos)
            }
        }
    }
    // console.log('emptyPoss:', emptyPoss)
    var randIdx = getRandomInt(0, emptyPoss.length) // 0 , 1
    // console.log('randIdx:', randIdx)
    var randPos = emptyPoss[randIdx] //{}
    // console.log('randPos:', randPos)
    return randPos
}

function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerText = value
    // elCell.classList.add('revealed')
}


