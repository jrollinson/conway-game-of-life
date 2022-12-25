const canvas = document.getElementById("canvas");
const controls = document.getElementById("controls");
const select = document.getElementById("starting-options");

const ctx = canvas.getContext("2d");

const gridWidth = 60;
const gridHeight = 40;

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

class GameOfLife {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.aliveTiles = [];
    }

    clear() {
        this.aliveTiles = [];
    }

    getIsAlivePointIndex(point) {
        return this.aliveTiles.find(elem => this.eq(elem, point));
    }

    getAlivePoints() {
        return Array.from(this.aliveTiles);
    }

    isAlive(point) {
        return this.getIsAlivePointIndex(point) !== undefined;
    }

    eq(pointa, pointb) {
        return pointa.x === pointb.x && pointa.y === pointb.y;
    }

    setState(point, isAlive) {
        const index = this.getIsAlivePointIndex(point);
        if ((index !== undefined) === isAlive) {
            return;
        }

        if (isAlive) {
            this.aliveTiles.push(point);
        } else {
            this.aliveTiles = this.aliveTiles.filter(item => !this.eq(item, point));
        }
    }

    toggleState(point) {
        this.setState(point, !this.isAlive(point));
    }

    numAliveNeighbors(point) {
        let result = 0;
        for (const neighborPoint of getNeighboringPoints(point)) {
            if (this.isAlive(neighborPoint)) {
                result += 1;
            }
        }
        return result;
    }

    addAlivePoints(points) {
        for (const point of points) {
            this.setState(point, true);
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
    "Gosper glider gun": [ [ 26, 2 ], [ 24, 3 ], [ 26, 3 ], [ 14, 4 ], [ 15, 4 ], [ 22, 4 ], [ 23, 4 ], [ 13, 5 ], [ 17, 5 ], [ 22, 5 ], [ 23, 5 ], [ 2, 6 ], [ 3, 6 ], [ 12, 6 ], [ 18, 6 ], [ 22, 6 ], [ 23, 6 ], [ 2, 7 ], [ 3, 7 ], [ 12, 7 ], [ 16, 7 ], [ 18, 7 ], [ 19, 7 ], [ 24, 7 ], [ 26, 7 ], [ 12, 8 ], [ 18, 8 ], [ 26, 8 ], [ 13, 9 ], [ 17, 9 ], [ 14, 10 ], [ 15, 10 ] ]
};

function drawGrid() {
    ctx.save();
    ctx.fillStyle = "gray";
    const tileWidth = canvas.width / gridWidth;
    const tileHeight = canvas.height / gridHeight;

    for (let i = 0; i < gridHeight; i++) {
        ctx.fillRect(0, tileHeight * i, canvas.width, 1);
    }
    for (let i = 0; i < gridWidth; i++) {
        ctx.fillRect(tileWidth * i, 0, 1, canvas.height);
    }
    ctx.restore();
}

function draw() {
    ctx.fillStyle = "black";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const tileWidth = canvas.width / gridWidth;
    const tileHeight = canvas.height / gridHeight;
    for (const point of gol.getAlivePoints()) {
        ctx.fillRect(tileWidth * point.x, tileHeight * point.y, tileWidth, tileHeight);
    }

    drawGrid();
}


function updateGrid() {
    let toCheck = [];
    for (const point of gol.getAlivePoints()) {
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
        if (gol.isAlive(point)) {
            aliveNext = numAliveNeighbors == 2 || numAliveNeighbors == 3;
        } else {
            aliveNext = numAliveNeighbors == 3;
        }
        if (aliveNext) {
            newAlivePoints.push(point);
        }
    }

    gol.clear();
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
setInterval(runAnimation, 100);

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
