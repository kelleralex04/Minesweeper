/*----- constants -----*/

/*----- state variables -----*/
let setHeight = 16;
let setWidth = 30;
let setMines = 99;
let boardArr;
let firstClick;
let winner;
let clearQueue;
let clearedSquares;
let mineCount;

/*----- cached elements  -----*/
const board = document.getElementById('board');
const resetBtn = document.getElementById('reset');
/*----- event listeners -----*/
board.addEventListener('mouseup', leftClick);

/*----- functions -----*/

init();

function init() {
    winner = null;
    firstClick = 1;
    changeBoardSize(setHeight, setWidth);
    boardArr = [];
    clearQueue = [];
    clearedSquares = [];
    for (let i = 0; i < (setHeight); i++) {
        boardArr.push([]);
        for (let j = 0; j < (setWidth); j++) {
            boardArr[i].push(0);
        }
    };
    console.log(boardArr)
};

function changeBoardSize(height, width) {
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${width}, 32px)`;
    board.style.gridTemplateRows = `repeat(${height}, 32px)`;
    for (let i = 0; i < height; i++)  {
        for (let j = 0; j < width; j++)  {
            board.appendChild(document.createElement('div'));
            board.lastChild.setAttribute('id', `bx${j}y${i}`);
            board.lastChild.appendChild(document.createElement('div'));
            document.getElementById(`bx${j}y${i}`).lastChild.setAttribute('style', 'border: 1px solid black; font-size: 20px; text-align: center; padding-top: 3px; user-select: none');
            board.lastChild.appendChild(document.createElement('div'));
            document.getElementById(`bx${j}y${i}`).lastChild.classList.add('covers');
            document.getElementById(`bx${j}y${i}`).lastChild.setAttribute('id', `cx${j}y${i}`);
            document.getElementById(`cx${j}y${i}`).appendChild(document.createElement('img'));
            document.getElementById(`cx${j}y${i}`).lastChild.setAttribute('src', 'https://i.imgur.com/Y60Mhuq.gif');
            document.getElementById(`cx${j}y${i}`).lastChild.setAttribute('style', 'height: 32px; width: 32px; margin-top: -3px; margin-left: -3px; visibility: hidden');
        }
    };
};

function leftClick(evt) {
    if (winner) {
        return
    };
    let targetId = evt.target.getAttribute('id');
    if (firstClick) {
        firstClickCheck(targetId);
    }
    if (!targetId) {
        return;
    } else if (targetId[0] === 'c') {
        clearCover(targetId);
    } else {
        return;
    };
};

function firstClickCheck(Id) {
    let IdNums = Id.match(/\d+/g);
    let x = parseInt(IdNums[0]);
    let y = parseInt(IdNums[1]);
    placeMines(setMines, x, y);
    firstClick = 0;
}

function clearCover(Id) {
    document.querySelector(`#${Id}`).style.visibility = 'hidden';
    let IdNums = Id.match(/\d+/g);
    let x = parseInt(IdNums[0]);
    let y = parseInt(IdNums[1]);
    if (boardArr[y][x] === -1) {
        loseGame();
    }
    if (boardArr[y][x] === 0) {
        if (boardArr[y-1] !== undefined && boardArr[y-1][x-1] !== undefined) {
            document.getElementById(`cx${x-1}y${y-1}`).setAttribute('style', 'visibility: hidden');
            if (boardArr[y-1][x-1] === 0 && !clearQueue.includes(`x${x-1}y${y-1}`) && !clearedSquares.includes(`x${x-1}y${y-1}`)) {
                clearQueue.push(`x${x-1}y${y-1}`);
            }
        };
        if (boardArr[y][x-1] !== undefined) {
            document.getElementById(`cx${x-1}y${y}`).setAttribute('style', 'visibility: hidden');
            if (boardArr[y][x-1] === 0 && !clearQueue.includes(`x${x-1}y${y}`) && !clearedSquares.includes(`x${x-1}y${y}`)) {
                clearQueue.push(`x${x-1}y${y}`);
            }
        };
        if (boardArr[y+1] !== undefined && boardArr[y+1][x-1] !== undefined) {
            document.getElementById(`cx${x-1}y${y+1}`).setAttribute('style', 'visibility: hidden');
            if (boardArr[y+1][x-1] === 0 && !clearQueue.includes(`x${x-1}y${y+1}`) && !clearedSquares.includes(`x${x-1}y${y+1}`)) {
                clearQueue.push(`x${x-1}y${y+1}`);
            }
        };
        if (boardArr[y-1] !== undefined && boardArr[y-1][x] !== undefined) {
            document.getElementById(`cx${x}y${y-1}`).setAttribute('style', 'visibility: hidden');
            if (boardArr[y-1][x] === 0 && !clearQueue.includes(`x${x}y${y-1}`) && !clearedSquares.includes(`x${x}y${y-1}`)) {
                clearQueue.push(`x${x}y${y-1}`);
            }
        };
        if (boardArr[y+1] !== undefined && boardArr[y+1][x] !== undefined) {
            document.getElementById(`cx${x}y${y+1}`).setAttribute('style', 'visibility: hidden');
            if (boardArr[y+1][x] === 0 && !clearQueue.includes(`x${x}y${y+1}`) && !clearedSquares.includes(`x${x}y${y+1}`)) {
                clearQueue.push(`x${x}y${y+1}`);
            }
        };
        if (boardArr[y-1] !== undefined && boardArr[y-1][x+1] !== undefined) {
            document.getElementById(`cx${x+1}y${y-1}`).setAttribute('style', 'visibility: hidden');
            if (boardArr[y-1][x+1] === 0 && !clearQueue.includes(`x${x+1}y${y-1}`) && !clearedSquares.includes(`x${x+1}y${y-1}`)) {
                clearQueue.push(`x${x+1}y${y-1}`);
            }
        };
        if (boardArr[y][x+1] !== undefined) {
            document.getElementById(`cx${x+1}y${y}`).setAttribute('style', 'visibility: hidden');
            if (boardArr[y][x+1] === 0 && !clearQueue.includes(`x${x+1}y${y}`) && !clearedSquares.includes(`x${x+1}y${y}`)) {
                clearQueue.push(`x${x+1}y${y}`);
            }
        };
        if (boardArr[y+1] !== undefined && boardArr[y+1][x+1] !== undefined) {
            document.getElementById(`cx${x+1}y${y+1}`).setAttribute('style', 'visibility: hidden');
            if (boardArr[y+1][x+1] === 0 && !clearQueue.includes(`x${x+1}y${y+1}`) && !clearedSquares.includes(`x${x+1}y${y+1}`)) {
                clearQueue.push(`x${x+1}y${y+1}`);
            }
        };
    };
    if (clearQueue.includes(`x${x}y${y}`)) {
        clearQueue.splice(0, 1);
    }
    if (!clearedSquares.includes(`x${x}y${y}`)) {
        clearedSquares.push(`x${x}y${y}`);
    }
    clearQueue.forEach(function(i) {
        clearCover(`c${i}`)
    });
};

function loseGame() {
    winner = -1;
    
}

function placeMines(mines, x, y) {
    for (let j = 0; j < mines; j++) {
        let randX = Math.floor(Math.random() * setHeight);
        let randY = Math.floor(Math.random() * setWidth);
        while (((x - 1 <= randX && randX <= x + 1) && (y - 1 <= randY && randY <= y + 1)) || boardArr[randX][randY] === -1) {
            randX = Math.floor(Math.random() * setHeight);
            randY = Math.floor(Math.random() * setWidth);
        }
        boardArr[randX][randY] = -1;
    }
    render();
}

function countAdj(x, y) {
    if (boardArr[x][y] === -1) {
        if (boardArr[x-1] !== undefined && boardArr[x-1][y-1] !== undefined && boardArr[x-1][y-1] !== -1) {
            boardArr[x-1][y-1]++
        }
        if (boardArr[x][y-1] !== undefined && boardArr[x][y-1] !== -1) {
            boardArr[x][y-1]++
        }
        if (boardArr[x+1] !== undefined && boardArr[x+1][y-1] !== undefined && boardArr[x+1][y-1] !== -1) {
            boardArr[x+1][y-1]++
        }
        if (boardArr[x-1] !== undefined && boardArr[x-1][y] !== undefined && boardArr[x-1][y] !== -1) {
            boardArr[x-1][y]++
        }
        if (boardArr[x+1] !== undefined && boardArr[x+1][y] !== undefined && boardArr[x+1][y] !== -1) {
            boardArr[x+1][y]++
        }
        if (boardArr[x-1] !== undefined && boardArr[x-1][y+1] !== undefined && boardArr[x-1][y+1] !== -1) {
            boardArr[x-1][y+1]++
        }
        if (boardArr[x][y+1] !== undefined && boardArr[x][y+1] !== -1) {
            boardArr[x][y+1]++
        }
        if (boardArr[x+1] !== undefined && boardArr[x+1][y+1] !== undefined && boardArr[x+1][y+1] !== -1) {
            boardArr[x+1][y+1]++
        }
    } else return;
};

function render() {
    renderBoard();
    renderMessage();
};

function renderBoard() {
    for (let i = 0; i < setHeight; i++)  {
        for (let j = 0; j < setWidth; j++)  {
            countAdj(i, j);
        }
    }
    for (let i = 0; i < setHeight; i++)  {
        for (let j = 0; j < setWidth; j++)  {
            let curNum = document.getElementById(`bx${j}y${i}`).firstChild;
            curNum.innerHTML = boardArr[i][j];
            if (curNum.textContent === '1') {
                curNum.style.color = 'rgb(1, 0, 250)';
            } else if (curNum.textContent === '2') {
                curNum.style.color = 'rgb(1, 127, 1)';
            } else if (curNum.textContent === '3') {
                curNum.style.color = 'rgb(254, 2, 0)';
            } else if (curNum.textContent === '4') {
                curNum.style.color = 'rgb(1, 0, 127)';
            } else if (curNum.textContent === '5') {
                curNum.style.color = 'rgb(127, 1, 2)';
            } else if (curNum.textContent === '6') {
                curNum.style.color = 'rgb(0, 128, 128)';
            } else if (curNum.textContent === '7') {
                curNum.style.color = 'rgb(0, 0, 0)';
            } else if (curNum.textContent === '8') {
                curNum.style.color = 'rgb(128, 128, 128)';
            };
        };
    };
};

function renderMessage() {

};



