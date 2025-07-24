const grid = [
    [0, 0, 0, 0, 5, 0, 0, 2, 8],
    [5, 8, 0, 0, 0, 0, 7, 6, 0],
    [0, 6, 9, 7, 3, 0, 0, 0, 5],
    [0, 9, 4, 3, 0, 2, 1, 0, 0],
    [0, 0, 0, 0, 7, 5, 0, 0, 6],
    [3, 0, 7, 9, 1, 6, 0, 0, 0],
    [1, 0, 5, 8, 9, 0, 6, 7, 2],
    [0, 0, 0, 0, 2, 0, 0, 0, 0],
    [0, 2, 0, 0, 6, 3, 5, 4, 0]
];
updateGrid();
console.log(grid);
const gridNine = updateGridNine();
console.log(gridNine);

function updateGridNine() {
    const boxGrid = [];
    for (let i = 1; i <= grid.length; i++) {
        const bigBox = document.getElementById(`big-box-${i}`);
        const boxes = bigBox.querySelectorAll('.box');
        const numbers = [];
        for (let j = 0; j < boxes.length; j++) {
            if (boxes[j].textContent !== "") {
                numbers.push(Number(boxes[j].textContent));
            }
        }
        boxGrid.push(numbers);
    }
    return boxGrid;
}

function updateGrid() {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const box = document.getElementById(`${x}${y}`);
            const num = grid[y][x]
            if (num !== 0) {
                box.textContent = grid[y][x];
            }
            else {
                box.textContent = "";
            }
        }
    }
}
const button = document.getElementById('solve-button');
button.addEventListener('click', solve);
updateGrid();

function solve() {
    function solveStep() {
        tryAll();

        if (isUnsolved()) {
            setTimeout(solveStep, 300); // Give browser time to update UI
        } else {
            console.log("Sudoku solved!");
        }
    }
    solveStep();
}

function isUnsolved() {
    return grid.some(row => row.includes(0));
}

//I know this finds 43 zeros on start
function tryAll() {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === 0) {
                checkForSolutions(x, y);

            }
        }
    }
}

function checkForSolutions(x, y) {
    console.log(`The following is for cell [${x}, ${y}]`);
    //return array of possible solutions
    const possibleSolutionsInBox = checkGridNine(x, y);
    console.log("Possible grid solutions" + possibleSolutionsInBox);
    const possibleSolutionsInRows = checkRows(x, y);
    console.log("Possible row solutions" + possibleSolutionsInRows);
    const possibleSolutionsInCols = checkCols(x);
    console.log("Possible solutions in columns " + possibleSolutionsInCols);
    const commonSolutions = getCommonSolutions(possibleSolutionsInBox, possibleSolutionsInRows, possibleSolutionsInCols);
    console.log("Here are the possible solutions: " + commonSolutions);
    if (commonSolutions.length === 1) {
        grid[y][x] = commonSolutions[0];
        updateGridNine();
        updateGrid();
    }
}

function checkGridNine(x, y) {
    //Checked with console.log(cell), this is getting the correct element with a 0 in it
    const cell = document.getElementById(`${x}${y}`);
    //console.log(cell);
    const bigBoxId = cell.parentElement.id;
    //console.log(bigBoxId);
    const bigBoxElements = document.querySelectorAll('.big-box');
    //console.log(bigBoxElements);
    let index = 0;
    for (let i = 0; i < bigBoxElements.length; i++) {
        if (bigBoxElements[i].id === bigBoxId) {
            index = i;
        }
    }
    //console.log(index); check, index is the correct index
    let possibleSolutions = [];
    for (let sol = 1; sol < 10; sol++) {
        console.log("gridNine[index] = " + gridNine[index]);
        if (!gridNine[index].includes(sol)) {
            possibleSolutions.push(sol);
        }
    }
    return possibleSolutions;
}

function checkRows(x, y) {
    let possibleSolutions = [];
    for (let i = 1; i < 10; i++) {
        if (!grid[y].includes(i)) {
            possibleSolutions.push(i);
        }
    }
    return possibleSolutions;
}
//Don't need y for this part because you check all y in x
function checkCols(x) {
    let possibleSolutions = [];
    const column = grid.map(row => row[x]);

    for (let sol = 1; sol < 10; sol++) {
        if (!column.includes(sol)) {
            possibleSolutions.push(sol);
        }
    }
    return possibleSolutions;
}

function getCommonSolutions(grid, row, col) {
    return (grid.filter((sol) => row.includes(sol) && col.includes(sol)));
}

/* In order to generate the 3x3 grids in sudoku, I used HTML ids on divs to group cells together.
   I asked ChatGPT for insight after I completed the project on how to make it better. It said
   that I should keep logical operations in js and visual/structural concerns in HTML. ChatGPT
   suggested that I use this method instead in order to have the 3x3 grid logic

   function getBoxValues(x, y) {
  const boxX = Math.floor(x / 3) * 3;
  const boxY = Math.floor(y / 3) * 3;
  const values = [];

  for (let row = boxY; row < boxY + 3; row++) {
    for (let col = boxX; col < boxX + 3; col++) {
      values.push(grid[row][col]);
    }
  }
  return values;
}

I could use this method in order to determine the index of the larger box that a cell is in

function getBoxIndex(x, y) {
  const rowBlock = Math.floor(y / 3); // 0, 1, or 2
  const colBlock = Math.floor(x / 3); // 0, 1, or 2
  return rowBlock * 3 + colBlock; // 0 to 8
}

*/