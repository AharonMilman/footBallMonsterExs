var WALL = 'WALL';

var WALL_PASS_UP = 'WALL_PASS_UP'
var WALL_PASS_BOTTOM = 'WALL_PASS_BOTTOM'
var WALL_PASS_LEFT = 'WALL_PASS_LEFT'
var WALL_PASS_RIGHT = 'WALL_PASS_RIGHT'


var FLOOR = 'FLOOR';
var BALL = 'BALL';
var GAMER = 'GAMER';

var GAMER_IMG = '<img src="img/gamer.png" />';
var BALL_IMG = '<img src="img/ball.png" />';

var board;
var gGamerPos;
var gBallColCounter = 0
var gBallsCreated = 0

var gClearInterval

function initGame() {

    gBallColCounter = 0
    gBallsCreated = 0
    gGamerPos = { i: 2, j: 9 };
    board = buildBoard();
    renderBoard(board);
    getEmptyCells(board)

    var elBallCounterText = document.querySelector('.balls-counter')
    elBallCounterText.innerHTML = `Balls Collected: ${gBallColCounter}<br/> Balls Created:  ${gBallsCreated} `


}

function startGame() {
    putRandBall()
    gClearInterval = setInterval(putRandBall, 3000)

}



function buildBoard() {
    // Create the Matrix
    var board = createMat(10, 12)


    // Put FLOOR everywhere and WALL at edges
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            // Put FLOOR in a regular cell
            var cell = { type: FLOOR, gameElement: null, i, j };

            // Place Walls at edges
            if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
                cell.type = WALL;
            }

            // Add created cell to The game board
            board[i][j] = cell;
        }
    }

    board[0][6].type = WALL_PASS_UP
    board[9][6].type = WALL_PASS_BOTTOM
    board[6][0].type = WALL_PASS_LEFT
    board[6][11].type = WALL_PASS_RIGHT


    // Place the gamer at selected position
    board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;


    console.log(board);
    return board;
}

// Render the board to an HTML table
function renderBoard(board) {

    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];

            var cellClass = getClassName({ i: i, j: j })

            // TODO - change to short if statement
            if (currCell.type === FLOOR) cellClass += ' floor';
            else if (currCell.type === WALL) cellClass += ' wall';
            else if (currCell.type === WALL_PASS_UP) cellClass += ' wall-pass-up';
            else if (currCell.type === WALL_PASS_BOTTOM) cellClass += ' wall-pass-bottom';
            else if (currCell.type === WALL_PASS_RIGHT) cellClass += ' wall-pass-right';
            else if (currCell.type === WALL_PASS_LEFT) cellClass += ' wall-pass-left';
            strHTML += `\t<td class="cell ${cellClass}"  onclick="moveTo(${i}, ${j})" >\n`;

            // TODO - change to switch case statement
            if (currCell.gameElement === GAMER) {
                strHTML += GAMER_IMG;
            } else if (currCell.gameElement === BALL) {
                strHTML += BALL_IMG;
            }

            strHTML += '\t</td>\n';
        }
        strHTML += '</tr>\n';
    }

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {

    
    if(j < 0) j = board[0].length - 1
    if(j > board[0].length - 1) j = 0
    if(i < 0) i = board.length - 1
    if(i > board.length - 1) i = 0
    


    var targetCell = board[i][j];
    if (targetCell.type === WALL) return;

    
    //console.log('type ', gBoard[gGamerPos.i][gGamerPos.j].type);

    // Calculate distance to make sure we are moving to a neighbor cell
    var iAbsDiff = Math.abs(i - gGamerPos.i);
    var jAbsDiff = Math.abs(j - gGamerPos.j);
    console.log('iAbsDiff',iAbsDiff);
    console.log('jAbsDiff',jAbsDiff);

    // If the clicked Cell is one of the four allowed
    if (
        (iAbsDiff === 1 && jAbsDiff === 0) ||
        (jAbsDiff === 1 && iAbsDiff === 0) || iAbsDiff === 9 || jAbsDiff === 11
        // (gBoard[gGamerPos.i][gGamerPos.j].type === WALL_PASS_LEFT) ||
        // (gBoard[gGamerPos.i][gGamerPos.j].type === WALL_PASS_RIGHT) ||
        // (gBoard[gGamerPos.i][gGamerPos.j].type === WALL_PASS_UP) ||
        // (gBoard[gGamerPos.i][gGamerPos.j].type === WALL_PASS_BOTTOM)) &&
        // ((iAbsDiff === 1) || (jAbsDiff === 1))
        )
        {

        if (targetCell.gameElement === BALL) {
            console.log('Collecting!');
            collectBall(i, j)
        }

        // MOVING from current position
        // Model:
        board[gGamerPos.i][gGamerPos.j].gameElement = null;
        // Dom:
        renderCell(gGamerPos, '');

        // MOVING to selected position
        // Model:
        gGamerPos.i = i;
        gGamerPos.j = j;
        board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
        // DOM:
        renderCell(gGamerPos, GAMER_IMG);

    } // else console.log('TOO FAR', iAbsDiff, jAbsDiff);

}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
    var cellSelector = '.' + getClassName(location)
    var elCell = document.querySelector(cellSelector);
    elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {

    var i = gGamerPos.i;
    var j = gGamerPos.j;


    switch (event.key) {
        case 'ArrowLeft':
            moveTo(i, j - 1);
            break;
        case 'ArrowRight':
            moveTo(i, j + 1);
            break;
        case 'ArrowUp':
            moveTo(i - 1, j);
            break;
        case 'ArrowDown':
            moveTo(i + 1, j);
            break;

    }

}


function getEmptyCells() {

    var emptyCells = []

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].type === FLOOR && board[i][j].gameElement === null) {
                emptyCells.push(board[i][j])
                //console.log('empty cell: ', i ,'x', j )
            }
        }
    }
    if (!emptyCells.length) {
        clearInterval(gClearInterval)
        return alert('Game Over! You Lost! Try Again')
    }
    return emptyCells
}

// Returns the class name for a specific cell
function getClassName(location) {
    var cellClass = `cell-${location.i}-${location.j}`;
    return cellClass;
}

function putRandBall() {

    var emptyCells = getEmptyCells()
    if (!emptyCells) return
    var randArrayLoc = getRandomInt(0, emptyCells.length)
    var randChosenCell = emptyCells[randArrayLoc]
    console.log('rand cell', randChosenCell)
    gBallsCreated++

    //update model
    board[randChosenCell.i][randChosenCell.j].gameElement = BALL
    // update DOM
    renderCell({ i: randChosenCell.i, j: randChosenCell.j }, BALL_IMG)

}

function collectBall() {

    var elBallCounterText = document.querySelector('.balls-counter')
    elBallCounterText.innerHTML = `Balls Collected: ${++gBallColCounter}<br/> Balls Created:  ${gBallsCreated} `
    play()
    if (gBallColCounter === gBallsCreated) {
        clearInterval(gClearInterval)
        return alert('Game Over! You Won! Restart the Game.')
    }
}

function restartGame() {
    initGame()
    clearInterval(gClearInterval)
}

function play() {
    var audio = new Audio(`Sound/icq-uh-oh.mp3`);
    audio.play();
}