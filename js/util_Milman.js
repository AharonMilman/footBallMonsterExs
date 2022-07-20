'use strict'

//Numbers manipulation

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min) //The maximum is exclusive and the minimum is inclusive
}

function drawNum() {

    return +gNums.splice(getRandomInt(0, gNums.length), 1)
}

// create a numbers array
function resetNums(size) {
    gNums = []
    for (var i = 1; i < size + 1; i++) {
        gNums.push(i)
    }
    return null
}

function getNumArray(gridSize) {  //Creats a shuffled array with numbers unique from 1 - gridSize^2

    var buttonNumArrSize = gridSize ** 2
    var buttonNumArray = []
    var tempNum = 0
    var tempNum2 = 0
    var randIdx = 0

    for (var i = 0; i < buttonNumArrSize; i++) {
        buttonNumArray.push(i)
    }

    //console.log('this is the num Array sorted : ', buttonNumArray)

    for (var i = 0; i < buttonNumArrSize; i++) {
        randIdx = getRandomInt(0, buttonNumArrSize)
        tempNum = buttonNumArray[randIdx]
        tempNum2 = buttonNumArray.pop()
        //console.log('this is the num Array mixed after pop: ', buttonNumArray, 'this Rand: ', randIdx)
        buttonNumArray.push(tempNum)
        buttonNumArray.splice(randIdx, 1, tempNum2)


        //console.log('this is the num Array mixed after push and splice: ', buttonNumArray)
    }

    //console.log('this is the num Array mixed: ', buttonNumArray)
    return buttonNumArray


}

// Matrix manipulation:

function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

function sumDiag(mat) {

    var sumDiags = [0, 0]
    var matLen = mat.length
    for (var i = 0; i < matLen; i++) {

        sumDiags[0] += mat[i][i]
        sumDiags[1] += mat[i][matLen - 1 - i]
    }
    return sumDiags

}

function sumRow(mat, rowIdx) {

    var sumRow = 0
    for (var i = 0; i < mat.length; i++) {
        sumRow += mat[rowIdx][i]
    }
    return sumRow
}

function sumCol(mat, colIdx) {

    var sumCol = 0
    for (var i = 0; i < mat.length; i++) {
        sumCol += mat[i][colIdx]
    }
    return sumCol
}

function checkIfSymmetric(mat) {

    for (var i = 0; i < mat.length; i++) {
        for (var j = 0; j < mat[1].length; j++) {
            if (mat[i][j] !== mat[j][i]) return false
        }
    }

    return true

}

function getEmptyCells(board) {
    const emptyCells = []
    
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {

            if (board[i][j] === EMPTY ){
                    emptyCells.push({ i, j })
            }
        }
    }
    const idx = getRandomInt(0, emptyCells.length)
    return emptyCells[idx]
}


//HTML code rendering 

function renderButtons(gridSize) {

    var buttonNumArray = getNumArray(gridSize)
    var elTableGrid = document.querySelector('.buttonGrid')
    var strHTML = ''

    for (var i = 0; i < gridSize; i++) {
        strHTML += `<tr>\n`
        for (var j = 0; j < gridSize; j++) {
            var buttNum = buttonNumArray.pop() + 1
            strHTML += `<td>
            <button onclick="checkAnswer(${buttNum},${gridSize})" class="b${buttNum}">Button #${buttNum}</button>
            
            </td>\n`

        }
        strHTML += `</tr>\n`

    }
    //console.log(strHTML)
    elTableGrid.innerHTML = strHTML


}

// HTML JS timer:

timer()
gClearInterval = setInterval(timer, 1, new Date().getTime())
clearInterval(myInterval);

function timer(timeStart) {
    gTime = (new Date().getTime() - timeStart) / 1000
    var elTimerHtml = document.querySelector('.timer')
    elTimerHtml.innerText = `${gTime}`    
    return null
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

//creats an HTML mesh of a table with a selector where to put the table in the HTML code
function printMat(mat, selector) {

    var strHTML = '<table border="0"><tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {

            const cell = mat[i][j]
            const className = 'cell cell-' + i + '-' + j
            strHTML += `<td class="${className}">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'
    
    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}