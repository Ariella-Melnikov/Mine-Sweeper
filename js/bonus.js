'use strict'

function addHint() {
    var hintButtons = document.querySelectorAll('.hints button')

    hintButtons.forEach(function (hintButton) {
        hintButton.innerText = HINT;
        hintButton.addEventListener('click', handleHintClick);
    })
}

function handleHintClick() {
    if (gHintCount <= 0) return
    this.style.backgroundColor = 'yellow'
    gGame.hintActive = true
    gHintCount--

    setTimeout(() => {
        this.style.display = 'none'
    }, 1000)

}

function revealCellAndNeighbors(cellI, cellJ) {
    var cellsToHide = []
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i >= 0 && i < gLevel.size && j >= 0 && j < gLevel.size) {
                var neighborCell = gBoard[i][j]
                if (!neighborCell.isShown) {
                    neighborCell.isShown = true
                    renderCell({ i: i, j: j }, neighborCell.gameElement)
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
    }, 3000)
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
