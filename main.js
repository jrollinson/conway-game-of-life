const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const gridWidth = 30;
const gridHeight = 20;
let grid = [];
for (let i = 0; i < gridHeight; i++) {
    const row = [];
    for (let j = 0; j < gridWidth; j++) {
        row.push(false);
    }
    grid.push(row);
}

console.log(grid);
grid[0][1] = true;
grid[1][2] = true;
grid[2][0] = true;
grid[2][1] = true;
grid[2][2] = true;

function drawGrid() {
    const tileWidth = canvas.width / gridWidth;
    const tileHeight = canvas.height / gridHeight;

    for (let i = 0; i < gridHeight; i++) {
        ctx.fillRect(0, tileHeight * i, canvas.width, 1);
    }
    for (let i = 0; i < gridWidth; i++) {
        ctx.fillRect(tileWidth * i, 0, 1, canvas.height);
    }
}

function drawTiles() {
    ctx.fillStyle = "black";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid();
    const tileWidth = canvas.width / gridWidth;
    const tileHeight = canvas.height / gridHeight;

    for (let x = 0; x < grid.length; x++) {
        const row = grid[x];
        for (let y = 0; y < row.length; y++) {
            if (row[y]) {
                ctx.fillRect(tileWidth * x, tileHeight * y, tileWidth, tileHeight);
            }
        }
    }
}

function updateGrid() {
    function getNeighbors(x, y) {
        const allNeighbors = [
            [x-1, y-1],
            [x-1, y],
            [x-1, y+1],
            [x, y-1],
            [x, y+1],
            [x+1, y-1],
            [x+1, y],
            [x+1, y+1]
        ];

        const result = []
        for (neighbor of allNeighbors) {
            const isGood = (
                neighbor[0] >= 0 && neighbor[0] <= gridHeight - 1 &&
                neighbor[1] >= 0 && neighbor[1] <= gridWidth - 1
            );
            if (isGood) {
                result.push(neighbor);
            }
        }

        return result;
    }

    function getNumAliveNeighbors(x, y) {
        let result = 0;
        let neighbors = getNeighbors(x, y);
        for (const neighbor of neighbors) {
            if (grid[neighbor[0]][neighbor[1]]) {
                result += 1;
            }
        }
        return result;
    }


    let newGrid = []
    for (let x = 0; x < grid.length; x++) {
        let newRow = []
        let row = grid[x];
        for (let y = 0; y < row.length; y++) {
            let isAlive = row[y];
            let numAliveNeighbors = getNumAliveNeighbors(x, y);
            console.log(x, y, isAlive, numAliveNeighbors);
            let newState;
            if (isAlive) {
                newState = numAliveNeighbors == 2 || numAliveNeighbors == 3;
            } else {
                newState = numAliveNeighbors == 3;
            }
            newRow.push(newState)
        }
        newGrid.push(newRow);
    }
    grid = newGrid;
}

function step() {
    updateGrid();
    drawTiles();
}

function next() { step(); }
drawTiles();

