const canvas = document.getElementById("canvas");
const controls = document.getElementById("controls");
const select = document.getElementById("starting-options");

const ctx = canvas.getContext("2d");

const gridWidth = 30;
const gridHeight = 20;

let isPlaying = false;

function createGrid() {
    const grid = [];
    for (let i = 0; i < gridHeight; i++) {
        const row = [];
        for (let j = 0; j < gridWidth; j++) {
            row.push(false);
        }
        grid.push(row);
    }
    return grid
}
let grid = createGrid();

const startingOptions = {
    "Empty": [],
    "Glider": [
        [0, 1],
        [1, 2],
        [2, 0],
        [2, 1],
        [2, 2]
    ]
};

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

    for (let y = 0; y < grid.length; y++) {
        const row = grid[y];
        for (let x = 0; x < row.length; x++) {
            if (row[x]) {
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

function canvasPixelsToGridCoords(x, y) {
    const tileWidth = canvas.width / gridWidth;
    const tileHeight = canvas.height / gridHeight;
    return [Math.floor(x / tileWidth), Math.floor(y / tileHeight)];
}

canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;
    const coords = canvasPixelsToGridCoords(canvasX, canvasY);
    const gridX = coords[0];
    const gridY = coords[1];
    grid[gridY][gridX] = !grid[gridY][gridX];
    drawTiles();
});

function step() {
    updateGrid();
    drawTiles();
}
function runAnimation() {
    if (!isPlaying) {
        return;
    }
    step();
}
setInterval(runAnimation, 250);

function next() { step(); }
function play() {
    isPlaying = true;
}
function pause() {
    isPlaying = false;
}
function populateList(e) {
    console.log("Hello");
}
function selectStart() {
    const name = select.value;
    pause();

    const newGrid = createGrid();
    for (const coords of startingOptions[name]) {
        newGrid[coords[1]][coords[0]] = true;
    }
    grid = newGrid;

    drawTiles();
}

// Create the list of options and load button
for (const name in startingOptions) {
    const opt = document.createElement("option");
    opt.value = name;
    opt.innerHTML = name;
    select.appendChild(opt);
}


drawTiles();
