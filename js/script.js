/*----- constants -----*/

/*----- state variables -----*/
let setHeight = 3;
let setWidth = 3;
let setMines = 3;
let boardArr;
let firstClick;

/*----- cached elements  -----*/
const board = document.getElementById('board');
const resetBtn = document.getElementById('reset');
/*----- event listeners -----*/
board.addEventListener('mouseup', leftClick);

/*----- functions -----*/

init();

function init() {
    firstClick = 0;
    changeBoardSize(setHeight, setWidth);
    boardArr = [];
    for (let i = 0; i < (setHeight); i++) {
        boardArr.push([]);
        for (let j = 0; j < (setWidth); j++) {
            boardArr[i].push(0);
        }
    };
    placeMines(setMines);
    render();
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
    let targetId = evt.target.getAttribute('id');
    if (targetId[0] === 'c') {
        clearCover(targetId)
    } else {
        return
    }
}

function clearCover(Id) {
    document.querySelector(`#${Id}`).style.visibility = 'hidden';
};

function placeMines(mines) {
    let boardSize = [];
    for (let i = 0; i < (setHeight * setWidth); i++) {
        boardSize.push(i);
    }
    for (let j = 0; j < mines; j++) {
        let randIdx = Math.floor(Math.random() * ((setHeight * setWidth) - j));
        randNum = boardSize[randIdx];
        boardSize.splice(randIdx, 1);
        let mineRow = Math.floor(randNum/setWidth);
        let mineCol = ((randNum)%setWidth);
        boardArr[mineRow][mineCol] = -1;
    }
}

function countAdj(x, y) {
    if (boardArr[x][y] === -1) {
        console.log('mine')
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
    }
}

function render() {
    renderBoard();
    renderMessage();
}

function renderBoard() {
    for (let i = 0; i < setHeight; i++)  {
        for (let j = 0; j < setWidth; j++)  {
            countAdj(i, j);
        }
    }
    for (let i = 0; i < setHeight; i++)  {
        for (let j = 0; j < setWidth; j++)  {
            document.getElementById(`bx${j}y${i}`).firstChild.innerHTML = boardArr[i][j]
        }
    }
    console.log(boardArr)
}

function renderMessage() {

}



