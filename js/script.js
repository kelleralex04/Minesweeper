/*----- constants -----*/

/*----- state variables -----*/
let setHeight = 9;
let setWidth = 9;
let setMines = 10;
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
    render();
};

function changeBoardSize(height, width) {
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${width}, 32px)`;
    board.style.gridTemplateRows = `repeat(${height}, 32px)`;
    for (let i = 0; i < (height); i++)  {
        for (let j = 0; j < (width); j++)  {
            board.appendChild(document.createElement('div'));
            board.lastChild.setAttribute('id', `bx${j}y${i}`);
            board.lastChild.appendChild(document.createElement('img'));
            document.getElementById(`bx${j}y${i}`).lastChild.setAttribute('src', 'https://i.imgur.com/mnoKuwe.png');
            board.lastChild.appendChild(document.createElement('div'));
            document.getElementById(`bx${j}y${i}`).lastChild.classList.add('covers');
            document.getElementById(`bx${j}y${i}`).lastChild.setAttribute('id', `cx${j}y${i}`);
        }
    };
};

function leftClick(evt) {
    let targetId = evt.target.getAttribute('id');
    if (targetId[0] === 'c') {
        clearCover(targetId)
    }
}

function clearCover(Id) {
    document.querySelector(`#${Id}`).style.visibility = 'hidden';
};

function render() {
    renderBoard();
    renderMessage();
}

function renderBoard() {

}

function renderMessage() {

}



