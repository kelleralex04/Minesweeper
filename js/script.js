/*----- constants -----*/

/*----- state variables -----*/
let setHeight = 9;
let setWidth = 9;
let setMines = 10;
let boardArr;
let firstClick;
let winner;
let clearQueue;
let clearedSquares;
let mineCount;
let rowNum;
let colNum;
let totalSeconds;
let timerId;
let bestTimesBeginner = Array(10).fill(999);
let topPlayersBeginner = Array(10).fill('anonymous')
let bestTimesIntermediate = Array(10).fill(999);
let topPlayersIntermediate = Array(10).fill('anonymous')
let bestTimesExpert = Array(10).fill(999);
let topPlayersExpert = Array(10).fill('anonymous')

/*----- cached elements  -----*/
const board = document.getElementById('board');
const resetBtn = document.getElementById('smiley');
const timer = document.getElementById('timer');
const sizeSelect = document.getElementById('board-size-list');

/*----- event listeners -----*/
board.addEventListener('mouseup', leftClick);
board.addEventListener('contextmenu', rightClick)
resetBtn.addEventListener('click', init);
sizeSelect.addEventListener('change', init)

/*----- functions -----*/

init();

function init() {
    winner = null;
    firstClick = 1;
    clearInterval(timerId);
    totalSeconds = 0;
    timer.innerHTML = totalSeconds.toString().padStart(3, '0');
    if (sizeSelect[0].selected) {
        setHeight = 9;
        setWidth = 9;
        setMines = 10;
    } else if (sizeSelect[1].selected) {
        setHeight = 16;
        setWidth = 16;
        setMines = 40;
    } else {
        setHeight = 16;
        setWidth = 30;
        setMines = 99;
    }
    changeBoardSize(setHeight, setWidth);
    boardArr = [];
    clearQueue = [];
    clearedSquares = [];
    for (let i = 0; i < (setWidth); i++) {
        boardArr.push([]);
        for (let j = 0; j < (setHeight); j++) {
            boardArr[i].push(0);
        };
    };
    document.getElementById('smiley').src = 'https://i.imgur.com/aXF2BmY.png'
};

function changeBoardSize(height, width) {
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${width}, 32px)`;
    board.style.gridTemplateRows = `repeat(${height}, 32px)`;
    for (let i = 0; i < height; i++)  {
        for (let j = 0; j < width; j++)  {
            board.appendChild(document.createElement('div'));
            let square = board.lastChild;

            square.setAttribute('id', `bx${j}y${i}`);
            square.appendChild(document.createElement('div'));
            square.appendChild(document.createElement('div'));

            let squareBG = square.firstChild;
            let squareCover = square.lastChild;

            squareBG.setAttribute('style', 'border: 1px solid black; font-size: 24px; text-align: center; padding-top: 3px; user-select: none; font-weight: bold');
            squareCover.classList.add('covers');
            squareCover.setAttribute('id', `cx${j}y${i}`);

            squareCover.appendChild(document.createElement('img'));
            let mineImg = squareCover.firstChild;

            mineImg.setAttribute('style', 'height: 32px; width: 32px; margin-top: -3px; margin-left: -3px; visibility: hidden');
            mineImg.setAttribute('src', 'https://i.imgur.com/Q16e6xh.png');

            squareCover.appendChild(document.createElement('img'));
            let flagImg = squareCover.lastChild;
            flagImg.setAttribute('style', 'height: 24px; width: 24px; position: absolute; margin-top: -32px; visibility: hidden');
            flagImg.setAttribute('class', 'flag');
            flagImg.setAttribute('src', 'https://i.imgur.com/oYEkf0c.png');
        }
    };
};

function leftClick(evt) {
    let targetId = evt.target.getAttribute('id');
    if (evt.button !== 0 || winner || evt.srcElement.lastChild.style.visibility === 'visible') {
        return
    }
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
    checkWin();
};

function rightClick(evt) {
    evt.preventDefault();
    if (winner || !evt.srcElement.className) {
        return
    };
    let targetId = evt.target.getAttribute('id');
    if (targetId) {
        document.getElementById(targetId).lastChild.style.visibility = 'visible'
    } else {
        evt.srcElement.style.visibility = 'hidden'
    }
}

function firstClickCheck(Id) {
    let IdNums = Id.match(/\d+/g);
    let x = parseInt(IdNums[0]);
    let y = parseInt(IdNums[1]);
    placeMines(setMines, x, y);
    startTimer();
    firstClick = 0;
};

function placeMines(mines, x, y) {
    let placedMines = [];
    for (let i = 0; i < mines; i++) {
        let randX = Math.floor(Math.random() * setWidth);
        let randY = Math.floor(Math.random() * setHeight);
        while (((x - 1 <= randX && randX <= x + 1) && (y - 1 <= randY && randY <= y + 1)) || placedMines.includes(`${randX},${randY}`)) {
            randX = Math.floor(Math.random() * setWidth);
            randY = Math.floor(Math.random() * setHeight);
        }
        placedMines.push(`${randX},${randY}`);
        boardArr[randX][randY] = -1;
    }
    render();
}

function startTimer() {
    timerId = setInterval(function() {
        ++totalSeconds;
        timer.innerHTML = totalSeconds.toString().padStart(3, '0');
        if (totalSeconds >= 999) {
            clearInterval(timerId);
        };
    }, 1000);
};


function clearCover(Id) {
    document.querySelector(`#${Id}`).style.visibility = 'hidden';
    let IdNums = Id.match(/\d+/g);
    let x = parseInt(IdNums[0]);
    let y = parseInt(IdNums[1]);
    if (boardArr[x][y] === -1) {
        loseGame();
    }
    if (boardArr[x][y] === 0) {
        if (boardArr[x-1] !== undefined && boardArr[x-1][y-1] !== undefined && document.getElementById(`cx${x-1}y${y-1}`).lastChild.style.visibility === 'hidden') {
            document.getElementById(`cx${x-1}y${y-1}`).setAttribute('style', 'visibility: hidden');
            if (boardArr[x-1][y-1] === 0 && !clearQueue.includes(`x${x-1}y${y-1}`) && !clearedSquares.includes(`x${x-1}y${y-1}`)) {
                clearQueue.push(`x${x-1}y${y-1}`);
            }
        };
        if (boardArr[x-1] !== undefined && boardArr[x-1][y] !== undefined && document.getElementById(`cx${x-1}y${y}`).lastChild.style.visibility === 'hidden') {
            document.getElementById(`cx${x-1}y${y}`).setAttribute('style', 'visibility: hidden');
            if (boardArr[x-1][y] === 0 && !clearQueue.includes(`x${x-1}y${y}`) && !clearedSquares.includes(`x${x-1}y${y}`)) {
                clearQueue.push(`x${x-1}y${y}`);
            }
        };
        if (boardArr[x-1] !== undefined && boardArr[x-1][y+1] !== undefined && document.getElementById(`cx${x-1}y${y+1}`).lastChild.style.visibility === 'hidden') {
            document.getElementById(`cx${x-1}y${y+1}`).setAttribute('style', 'visibility: hidden');
            if (boardArr[x-1][y+1] === 0 && !clearQueue.includes(`x${x-1}y${y+1}`) && !clearedSquares.includes(`x${x-1}y${y+1}`)) {
                clearQueue.push(`x${x-1}y${y+1}`);
            }
        };
        if (boardArr[x][y-1] !== undefined && document.getElementById(`cx${x}y${y-1}`).lastChild.style.visibility === 'hidden') {
            document.getElementById(`cx${x}y${y-1}`).setAttribute('style', 'visibility: hidden');
            if (boardArr[x][y-1] === 0 && !clearQueue.includes(`x${x}y${y-1}`) && !clearedSquares.includes(`x${x}y${y-1}`)) {
                clearQueue.push(`x${x}y${y-1}`);
            }
        };
        if (boardArr[x][y+1] !== undefined && document.getElementById(`cx${x}y${y+1}`).lastChild.style.visibility === 'hidden') {
            document.getElementById(`cx${x}y${y+1}`).setAttribute('style', 'visibility: hidden');
            if (boardArr[x][y+1] === 0 && !clearQueue.includes(`x${x}y${y+1}`) && !clearedSquares.includes(`x${x}y${y+1}`)) {
                clearQueue.push(`x${x}y${y+1}`);
            }
        };
        if (boardArr[x+1] !== undefined && boardArr[x+1][y-1] !== undefined && document.getElementById(`cx${x+1}y${y-1}`).lastChild.style.visibility === 'hidden') {
            document.getElementById(`cx${x+1}y${y-1}`).setAttribute('style', 'visibility: hidden');
            if (boardArr[x+1][y-1] === 0 && !clearQueue.includes(`x${x+1}y${y-1}`) && !clearedSquares.includes(`x${x+1}y${y-1}`)) {
                clearQueue.push(`x${x+1}y${y-1}`);
            }
        };
        if (boardArr[x+1] !== undefined && boardArr[x+1][y] !== undefined && document.getElementById(`cx${x+1}y${y}`).lastChild.style.visibility === 'hidden') {
            document.getElementById(`cx${x+1}y${y}`).setAttribute('style', 'visibility: hidden');
            if (boardArr[x+1][y] === 0 && !clearQueue.includes(`x${x+1}y${y}`) && !clearedSquares.includes(`x${x+1}y${y}`)) {
                clearQueue.push(`x${x+1}y${y}`);
            }
        };
        if (boardArr[x+1] !== undefined && boardArr[x+1][y+1] !== undefined && document.getElementById(`cx${x+1}y${y+1}`).lastChild.style.visibility === 'hidden') {
            document.getElementById(`cx${x+1}y${y+1}`).setAttribute('style', 'visibility: hidden');
            if (boardArr[x+1][y+1] === 0 && !clearQueue.includes(`x${x+1}y${y+1}`) && !clearedSquares.includes(`x${x+1}y${y+1}`)) {
                clearQueue.push(`x${x+1}y${y+1}`);
            }
        };
    };

    if (clearQueue.includes(`x${x}y${y}`)) {
        clearQueue.splice(0, 1);
    };

    if (!clearedSquares.includes(`x${x}y${y}`)) {
        clearedSquares.push(`x${x}y${y}`);
    };

    clearQueue.forEach(function(i) {
        clearCover(`c${i}`)
    });
};

function loseGame() {
    winner = -1;
    clearInterval(timerId)
    boardArr.forEach(function(row, rowNum) {
        row.forEach(function(square, colNum) {
            let curSquare = document.getElementById(`cx${rowNum}y${colNum}`);
            if (square === -1 && curSquare.lastChild.style.visibility === 'hidden') {
                curSquare.style.visibility = 'hidden'
                curSquare.firstChild.style.visibility = 'visible'
            } else if (square !== -1 && curSquare.lastChild.style.visibility === 'visible') {
                curSquare.style.visibility = 'hidden'
                curSquare.lastChild.style.visibility = 'hidden'
                curSquare.firstChild.src = 'https://i.imgur.com/ajkTjKn.png'
                curSquare.firstChild.style.visibility = 'visible'
            };
        }); 
    });
    document.getElementById('smiley').src = 'https://i.imgur.com/roW87Xa.png'
};

function checkWin() {
    let clearedCount = 0;
    boardArr.forEach(function(row, rowIdx) {
        row.forEach(function(col, colIdx) {
            if (document.getElementById(`cx${rowIdx}y${colIdx}`).style.visibility === 'hidden') {
                clearedCount++
            };
        });
    });
    if (clearedCount === (setHeight * setWidth) - setMines && winner !== -1) {
        winner = 1;
        clearInterval(timerId);
        document.getElementById('smiley').src = 'https://i.imgur.com/A8LriNS.png';
        boardArr.forEach(function(row, rowIdx) {
            row.forEach(function(col, colIdx) {
                if (document.getElementById(`cx${rowIdx}y${colIdx}`).style.visibility !== 'hidden') {
                    document.getElementById(`cx${rowIdx}y${colIdx}`).lastChild.style.visibility = 'visible'
                };
            });
        });
        if (sizeSelect[0].selected) {
            bestTimesBeginner.forEach(function(time, timeIdx) {
                if (totalSeconds < time) {
                    let person = prompt(`Enter your name to submit your score (${totalSeconds})`);
                    if (!person) {
                        person = 'anonymous'
                    };
                    bestTimesBeginner.splice(timeIdx, 0, totalSeconds);
                    bestTimesBeginner.pop();
                    topPlayersBeginner.splice(timeIdx, 0, person);
                    topPlayersBeginner.pop();
                    for (let i = 0; i < 10; i++) {
                        document.getElementById(`b${i}`).innerText = `${topPlayersBeginner[i]} - ${bestTimesBeginner[i]}`;
                    };
                    totalSeconds = 1000;
                };
            });
        } else if (sizeSelect[1].selected) {
            bestTimesIntermediate.forEach(function(time, timeIdx) {
                if (totalSeconds < time) {
                    let person = prompt(`Enter your name to submit your score (${totalSeconds})`);
                    if (!person) {
                        person = 'anonymous'
                    };
                    bestTimesIntermediate.splice(timeIdx, 0, totalSeconds);
                    bestTimesIntermediate.pop();
                    topPlayersIntermediate.splice(timeIdx, 0, person);
                    topPlayersIntermediate.pop();
                    for (let i = 0; i < 10; i++) {
                        document.getElementById(`i${i}`).innerText = `${topPlayersIntermediate[i]} - ${bestTimesIntermediate[i]}`;
                    };
                    totalSeconds = 1000;
                };
            });
        } else {
            bestTimesExpert.forEach(function(time, timeIdx) {
                if (totalSeconds < time) {
                    let person = prompt(`Enter your name to submit your score (${totalSeconds})`);
                    if (!person) {
                        person = 'anonymous'
                    };
                    bestTimesExpert.splice(timeIdx, 0, totalSeconds);
                    bestTimesExpert.pop();
                    topPlayersExpert.splice(timeIdx, 0, person);
                    topPlayersExpert.pop();
                    for (let i = 0; i < 10; i++) {
                        document.getElementById(`e${i}`).innerText = `${topPlayersExpert[i]} - ${bestTimesExpert[i]}`;
                    };
                    totalSeconds = 1000;
                };
            });
        };
    };
};

function render() {
    renderBoard();
};

function renderBoard() {
    for (let i = 0; i < setWidth; i++)  {
        for (let j = 0; j < setHeight; j++)  {
            countAdj(i, j);
        }
    }
    for (let i = 0; i < setWidth; i++)  {
        for (let j = 0; j < setHeight; j++)  {
            let curNum = document.getElementById(`bx${i}y${j}`).firstChild;
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
            } else if (curNum.textContent === '-1') {
                curNum.style.color = 'rgba(0, 0, 0, 0)'
            }
        };
    };
};

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


