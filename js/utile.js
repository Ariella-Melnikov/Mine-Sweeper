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

function getRandomColor() { //from specific colors
    const COLORS = ['#f33a10', '#33FF57', '#3357FF', '#FF33A6', '#A633FF', '#33FFF3', '#dffc3f']
    const randomIndex = Math.floor(Math.random() * COLORS.length)
    const color = COLORS[randomIndex]
    COLORS.splice(randomIndex, 1) // Remove the chosen color from the array
    return color
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

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]] // Swap elements
    }
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

function openModal(msg) {
    const elModal = document.querySelector('.modal')
    const elMsg = elModal.querySelector('.msg')
    elMsg.innerText = msg
    elModal.style.display = 'block'
}

function closeModal() {
    const elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
}

function getNextLocation(eventKeyboard) {
    const nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }
    switch (eventKeyboard.code) {
        case 'ArrowUp':
            nextLocation.i--
            break;
        case 'ArrowRight':
            nextLocation.j++
            break;
        case 'ArrowDown':
            nextLocation.i++
            break;
        case 'ArrowLeft':
            nextLocation.j--
            break;
    }
    return nextLocation
}

function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerText = value
    // elCell.classList.add('revealed')
}

function countInPrimaryDiagonal(mat, symbol) {
    var count = 0
    for (var i = 0; i < mat.length; i++) {
        var currCell = mat[i][i]
        if (currCell === symbol) count++
    }
    return count
}

function getPos(strPos) {
    const parts = strPos.split(',')
    console.log('parts:', parts)
    var pos = {
        i: +parts[0],
        j: +parts[1]
    }
    return pos
}