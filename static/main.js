const canvas = document.getElementById("canvas");
const controls = document.getElementById("controls");
const select = document.getElementById("starting-options");

const ctx = canvas.getContext("2d");

const gridWidth = 120;
const gridHeight = 80;

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function getNeighboringPoints(point) {
    const x = point.x;
    const y = point.y;
    return [
        new Point(x-1, y-1),
        new Point(x-1, y),
        new Point(x-1, y+1),
        new Point(x, y-1),
        new Point(x, y+1),
        new Point(x+1, y-1),
        new Point(x+1, y),
        new Point(x+1, y+1)
    ];
}

class Grid {
    constructor() {
        this.tiles = new Map();
    }
    
    clear() {
        this.tiles.clear();
    }

    setState(point, isAlive) {
        let row = this.tiles.get(point.x);
        if (row === undefined) {
            row = new Set();
            this.tiles.set(point.x, row);
        }

        if (isAlive) {
            row.add(point.y);
        } else {
            row.delete(point.y);
        }
    }

    toggleState(point) {
        this.setState(point, !this.isAlive(point));
    }

    getAlivePoints() {
        const result = [];
        for (const entry of this.tiles.entries()) {
            const x = entry[0];
            const row = entry[1];
            for (const y of row.values()) {
                result.push(new Point(x, y));
            }
        }
        return result;
    }

    isAlive(point) {
        const row = this.tiles.get(point.x);
        return (
            row !== undefined &&
            row.has(point.y)
        );
    }
}

class GameOfLife {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.grid = new Grid();
    }

    clear() {
        this.grid.clear();
    }

    numAliveNeighbors(point) {
        let result = 0;
        for (const neighborPoint of getNeighboringPoints(point)) {
            if (this.grid.isAlive(neighborPoint)) {
                result += 1;
            }
        }
        return result;
    }

    addAlivePoints(points) {
        for (const point of points) {
            this.grid.setState(point, true);
        }
    }
}

const gol = new GameOfLife(gridWidth, gridHeight);

let isPlaying = false;

const startingOptions = {
    "Empty": [],
    "Glider": [ [0, 1], [1, 2], [2, 0], [2, 1], [2, 2] ],
    "Toad": [ [ 9, 7 ], [ 10, 7 ], [ 11, 7 ], [ 8, 8 ], [ 9, 8 ], [ 10, 8 ] ],
    "Beacon": [ [ 11, 10 ], [ 12, 10 ], [ 11, 11 ], [ 12, 11 ], [ 13, 12 ], [ 14, 12 ], [ 13, 13 ], [ 14, 13 ] ],
    "R-Pentomino": [ [ 15, 11 ], [ 16, 11 ], [ 14, 12 ], [ 15, 12 ], [ 15, 13 ] ],
    "Diehard": [ [ 17, 11 ], [ 11, 12 ], [ 12, 12 ], [ 12, 13 ], [ 16, 13 ], [ 17, 13 ], [ 18, 13 ] ],
    "Acorn": [ [ 12, 9 ], [ 14, 10 ], [ 11, 11 ], [ 12, 11 ], [ 15, 11 ], [ 16, 11 ], [ 17, 11 ] ],
    "Gosper glider gun": [ [ 26, 2 ], [ 24, 3 ], [ 26, 3 ], [ 14, 4 ], [ 15, 4 ], [ 22, 4 ], [ 23, 4 ], [ 13, 5 ], [ 17, 5 ], [ 22, 5 ], [ 23, 5 ], [ 2, 6 ], [ 3, 6 ], [ 12, 6 ], [ 18, 6 ], [ 22, 6 ], [ 23, 6 ], [ 2, 7 ], [ 3, 7 ], [ 12, 7 ], [ 16, 7 ], [ 18, 7 ], [ 19, 7 ], [ 24, 7 ], [ 26, 7 ], [ 12, 8 ], [ 18, 8 ], [ 26, 8 ], [ 13, 9 ], [ 17, 9 ], [ 14, 10 ], [ 15, 10 ], [ 36, 4 ], [ 37, 5 ], [ 37, 4 ], [ 36, 5 ] ],
    "Brick Layer 1": [ [ 19, 22 ], [ 21, 22 ], [ 21, 21 ], [ 23, 20 ], [ 23, 19 ], [ 23, 18 ], [ 25, 19 ], [ 25, 18 ], [ 25, 17 ], [ 26, 18 ] ],
    "Brick Layer 2": [ [ 21, 13 ], [ 22, 13 ], [ 23, 13 ], [ 25, 13 ], [ 21, 14 ], [ 24, 15 ], [ 25, 15 ], [ 25, 16 ], [ 23, 16 ], [ 22, 16 ], [ 21, 17 ], [ 23, 17 ], [ 25, 17 ] ],
    "Thin Brick Layer": [ [ 15, 20 ], [ 16, 20 ], [ 17, 20 ], [ 18, 20 ], [ 19, 20 ], [ 20, 20 ], [ 21, 20 ], [ 22, 20 ], [ 24, 20 ], [ 25, 20 ], [ 26, 20 ], [ 27, 20 ], [ 28, 20 ], [ 32, 20 ], [ 33, 20 ], [ 34, 20 ], [ 41, 20 ], [ 42, 20 ], [ 43, 20 ], [ 45, 20 ], [ 44, 20 ], [ 46, 20 ], [ 47, 20 ], [ 49, 20 ], [ 50, 20 ], [ 51, 20 ], [ 52, 20 ], [ 53, 20 ] ],
    "Space Rake": [ [ 18, 5 ], [ 19, 5 ], [ 21, 4 ], [ 20, 4 ], [ 21, 6 ], [ 21, 5 ], [ 22, 5 ], [ 18, 6 ], [ 20, 6 ], [ 19, 6 ], [ 19, 7 ], [ 20, 7 ], [ 26, 5 ], [ 27, 4 ], [ 28, 4 ], [ 29, 4 ], [ 30, 4 ], [ 30, 5 ], [ 30, 6 ], [ 29, 7 ], [ 26, 7 ], [ 17, 9 ], [ 17, 10 ], [ 16, 10 ], [ 15, 11 ], [ 16, 12 ], [ 17, 12 ], [ 18, 12 ], [ 20, 12 ], [ 19, 12 ], [ 17, 13 ], [ 20, 13 ], [ 18, 13 ], [ 19, 13 ], [ 20, 14 ], [ 26, 10 ], [ 27, 10 ], [ 25, 11 ], [ 28, 11 ], [ 28, 12 ], [ 25, 12 ], [ 24, 13 ], [ 25, 13 ], [ 28, 13 ], [ 27, 13 ], [ 26, 14 ], [ 25, 14 ], [ 26, 19 ], [ 27, 18 ], [ 26, 21 ], [ 28, 18 ], [ 29, 18 ], [ 30, 18 ], [ 30, 20 ], [ 30, 19 ], [ 29, 21 ], [ 13, 21 ], [ 13, 20 ], [ 12, 19 ], [ 13, 22 ], [ 12, 22 ], [ 11, 22 ], [ 10, 22 ], [ 9, 21 ], [ 9, 19 ] ]
};

function drawGrid() {
    ctx.save();
    ctx.fillStyle = "gray";
    const tileWidth = canvas.width / gridWidth;
    const tileHeight = canvas.height / gridHeight;

    for (let i = 1; i < gridHeight; i++) {
        ctx.fillRect(0, tileHeight * i, canvas.width, 1);
    }
    for (let i = 1; i < gridWidth; i++) {
        ctx.fillRect(tileWidth * i, 0, 1, canvas.height);
    }
    ctx.restore();
}

function draw() {
    ctx.fillStyle = "black";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const tileWidth = canvas.width / gridWidth;
    const tileHeight = canvas.height / gridHeight;
    for (const point of gol.grid.getAlivePoints()) {
        if (point.x > 0 && point.x < gridWidth && point.y > 0 && point.y < gridHeight) {
            ctx.fillRect(tileWidth * point.x, tileHeight * point.y, tileWidth, tileHeight);
        }
    }

    drawGrid();
}


function updateGrid() {
    let toCheck = [];
    for (const point of gol.grid.getAlivePoints()) {
        toCheck.push(point);
        for (const neighboringPoint of getNeighboringPoints(point)) {
            toCheck.push(neighboringPoint);
        }
    }
    toCheck = toCheck.filter((v, i, a) => a.indexOf(v) === i);

    const newAlivePoints = [];
    for (const point of toCheck.values()) {
        const numAliveNeighbors = gol.numAliveNeighbors(point);
        let aliveNext;
        if (gol.grid.isAlive(point)) {
            aliveNext = numAliveNeighbors == 2 || numAliveNeighbors == 3;
        } else {
            aliveNext = numAliveNeighbors == 3;
        }
        if (aliveNext) {
            newAlivePoints.push(point);
        }
    }

    gol.grid.clear();
    gol.addAlivePoints(newAlivePoints);
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
    gol.toggleState(new Point(gridX, gridY));
    draw();
});

function step() {
    updateGrid();
    draw();
}
function runAnimation() {
    if (!isPlaying) {
        return;
    }
    step();
}
setInterval(runAnimation, 10);

function next() { step(); }
function play() {
    isPlaying = true;
}
function pause() {
    isPlaying = false;
}
function selectStart() {
    const name = select.value;
    pause();

    gol.clear();
    let points = [];
    for (const coords of startingOptions[name]) {
        points.push(new Point(coords[0], coords[1]));
    }
    gol.addAlivePoints(points);

    draw();
}

// Create the list of options and load button
for (const name in startingOptions) {
    const opt = document.createElement("option");
    opt.value = name;
    opt.innerHTML = name;
    select.appendChild(opt);
}

draw();

// Set up for flier
select.value = "Gosper glider gun";
selectStart();
play();
