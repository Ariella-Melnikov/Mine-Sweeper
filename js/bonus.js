'use strict'

function addHintBtns(numHints) {
    console.log('addHints called?')
    var hintContainer = document.querySelector('.hints')
    hintContainer.innerHTML = '' // Clear existing buttons

    for (var i = 0; i < numHints; i++) {
        var elHintButton = document.createElement('button' + i + 1)
        elHintButton.innerText = HINT
        elHintButton.addEventListener('click', handleHintClick)
        hintContainer.appendChild(elHintButton)
    }
}



function handleHintClick() {
    if (gHints <= 0) return
    this.style.backgroundColor = 'yellow'
    gHints.hintActive = true

}

function revealCellAndNeighbors(cellI, cellJ) {
    var cellsToHide = []
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i >= 0 && i < gLevel.size && j >= 0 && j < gLevel.size) {
                var currCell = gBoard[i][j]
                if (!currCell.isShown) {
                    currCell.isShown = true

                    var cellValue = currCell.gameElement
                    if (cellValue != MINE && currCell.minesAroundCount > 0) {
                        cellValue = currCell.minesAroundCount
                    }

                    renderCell({ i: i, j: j }, cellValue)
                    cellsToHide.push({ i: i, j: j })
                }
            }
        }
    }
    setTimeout(() => {
        cellsToHide.forEach(cell => {
            const currCell = gBoard[cell.i][cell.j]
            if (!currCell.isMarked) {
                currCell.isShown = false
                renderCell(cell, EMPTY)
            }
        })
    }, 2000)
}

function storeUserInfo() {
    var victoryTime = updateTimer()
    if (!victoryTime) return


    var username = document.querySelector('.username').value
    if (!username) {
        username = 'user123'
    } else {
        var toBeStoredPlayInfo = {
            username: username,
            time: victoryTime
        }

        var storedInfo = localStorage.getItem('playInfo')
        if (storedInfo) {
            var parsedStoredInfo = JSON.parse(storedInfo)
            if (parsedStoredInfo.time < victoryTime) {
                toBeStoredPlayInfo = parsedStoredInfo
            }
        }
        localStorage.setItem('playInfo', JSON.stringify(toBeStoredPlayInfo))
    }
    document.querySelector('.result').innerHTML = `Username: ${username}, Time: ${victoryTime} seconds`
}

function displayStoredUserInfo() {
    var storedInfo = localStorage.getItem('playInfo')
    if (storedInfo) {
        var playInfo = JSON.parse(storedInfo)
        document.querySelector('.result').innerHTML = `Last Game - Username: ${playInfo.username}, Time: ${playInfo.time} seconds`
    }
}

function fullExpand(cellI, cellJ) {
//     console.log('is it enter the full Expand?')

//     if (cellI < 0 || cellI >= gLevel.size || cellJ < 0 || cellJ >= gLevel.size) return
//     var cell = gBoard[cellI][cellJ]

//     // console.log('do i stop? ')
//     // if (cell.isShown) return

//     // console.log('do i got here? ')


//     cell.isShown = true
//     renderCell({ i: cellI, j: cellJ }, cell.minesAroundCount === 0 ? EMPTY : cell.minesAroundCount)
//     if(cell.minesAroundCount !== 0 ) return

//     // Recursively expand to all neighboring cells
//     for (var i = cellI - 1; i <= cellI + 1; i++) {
//         for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            
//             if ( i !== cellI || j !== cellJ) {
//                 fullExpand(i, j)
//             }

//         }
//     }
    
}