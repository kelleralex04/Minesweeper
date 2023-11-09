/*----- constants -----*/

/*----- state variables -----*/
let setHeight = 9;
let setWidth = 9;
let boardArr

/*----- cached elements  -----*/
const board = document.getElementById('board');
const covers = document.getElementById('covers');
const mines = document.getElementById('mines');
const resetBtn = document.getElementById('reset');

/*----- event listeners -----*/

/*----- functions -----*/

init();

function init() {
    changeBoardSize(setHeight, setWidth);
    boardArr = [];
    for (let i = 0; i < (setHeight * setWidth); i++) {
        boardArr.push(0);
    };
    // placeMines(setHeight, setWidth, setMines);
    render();
};

function changeBoardSize(height, width) {
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${width}, 32px)`;
    board.style.gridTemplateRows = `repeat(${height}, 32px)`;
    for (let i = 0; i < (width * height); i++)  {
        board.appendChild(document.createElement('div'));
        board.lastChild.setAttribute('id', 'b' + i);
    };
    
    covers.innerHTML = '';
    covers.style.gridTemplateColumns = `repeat(${width}, 32px)`;
    covers.style.gridTemplateRows = `repeat(${height}, 32px)`;
    for (let i = 0; i < (width * height); i++)  {
        covers.appendChild(document.createElement('div'));
        covers.lastChild.setAttribute('id', 'c' + i);
    };

    covers.style.marginTop = `-${(height + 1) * 32}px`
};

function render() {

}





