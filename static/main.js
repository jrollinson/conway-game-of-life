const canvas = document.getElementById("canvas");
const select = document.getElementById("starting-options");
const speedElem = document.getElementById("speed");

const gridWidth = 120;
const gridHeight = 80;

/** A simple point class */
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

/** An infinite 2-dimensional grid of "pixels" that are
 *  either alive of dead.
 *
 *  Data is stored in as a map of x coordinates -> the set of alive y coordinates.
 *  The grid is mutable.
 */
class Grid {
    constructor() {
        this.tiles = new Map();
    }
    
    /** Marks all pixels as dead. */
    clear() {
        this.tiles.clear();
    }

    /** Sets the state of one pixel. */
    setState(point, isAlive) {
        let rowMap = this.tiles.get(point.x);
        if (rowMap === undefined) {
            rowMap = new Map();
            this.tiles.set(point.x, rowMap);
        }

        if (isAlive) {
            rowMap.set(point.y, true);
        } else {
            rowMap.delete(point.y);
        }
    }

    /** Toggles the state of a pixel. */
    toggleState(point) {
        this.setState(point, !this.isAlive(point));
    }

    /** Returns a list of the alive points */
    getAlivePoints() {
        const result = [];
        for (const entry of this.tiles.entries()) {
            const x = entry[0];
            const rowMap = entry[1];
            for (const rowEntry of rowMap.entries()) {
                if (rowEntry[1]) {
                    const y = rowEntry[0];
                    result.push(new Point(x, y));
                }
            }
        }
        return result;
    }

    /** Returns whether the given pixel is alive. */
    isAlive(point) {
        const rowMap = this.tiles.get(point.x);
        return (
            rowMap !== undefined &&
            rowMap.get(point.y)
        );
    }
    
    /** Returns the number of the pixels in the given 
     * column that match the y-coordinates that are alive.
     */
    numAliveInColumn(x, ys) {
        const rowMap = this.tiles.get(x);
        if (rowMap === undefined) {
            return 0;
        }

        let count = 0;
        for (let y of ys) {
            if (rowMap.get(y)) {
                count += 1;
            }
        }
        return count;
    }
}

/** Code to support game of life */
class GameOfLife {
    constructor() {
        this.grid = new Grid();
    }

    /** Clears the grid of alive pieces */
    clear() {
        this.grid.clear();
    }

    /** Counds the number of alive neighbors a point has. */
    numAliveNeighbors(point) {
        return (
            this.grid.numAliveInColumn(point.x - 1, [point.y - 1, point.y, point.y + 1]) +
            this.grid.numAliveInColumn(point.x, [point.y - 1, point.y + 1]) +
            this.grid.numAliveInColumn(point.x + 1, [point.y - 1, point.y, point.y + 1])
        );
    }

    /** Adds the points to the grid. */
    addAlivePoints(points) {
        for (const point of points) {
            this.grid.setState(point, true);
        }
    }

    /** Performs a step. */
    update() {
        const newGrid = new Grid();
        // This grid is used to track which tiles should be checked.
        const checkedPoints = new Grid();

        for (const entry of this.grid.tiles.entries()) {
            const x = entry[0];
            const yMap = entry[1];
            for (const yEntry of yMap.entries()) {
                const y = yEntry[0];
                if (!yEntry[1]) {
                    continue;
                }

                for (const dx of [-1, 0, 1]) {
                    for (const dy of [-1, 0, 1]) {
                        const pointToCheck = new Point(x + dx, y + dy);
                        if (checkedPoints.isAlive(pointToCheck)) { continue; }
                        checkedPoints.setState(pointToCheck, true);

                        const numAliveNeighbors = this.numAliveNeighbors(pointToCheck);
                        const wasAlive = this.grid.isAlive(pointToCheck);

                        const isAlive = (
                            (wasAlive && (numAliveNeighbors <= 3 && numAliveNeighbors >= 2)) ||
                            (!wasAlive && (numAliveNeighbors === 3))
                        )
                        if (isAlive) {
                            newGrid.setState(pointToCheck, true);
                        }
                    }
                }
            }
        }
        this.grid = newGrid;
    }
}


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
    ctrl.toggle(new Point(gridX, gridY));
});

class GridView {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    }

    drawGrid() {
        this.ctx.save();
        this.ctx.fillStyle = "gray";
        const tileWidth = canvas.width / gridWidth;
        const tileHeight = canvas.height / gridHeight;

        for (let i = 1; i < gridHeight; i++) {
            this.ctx.fillRect(0, tileHeight * i, canvas.width, 1);
        }
        for (let i = 1; i < gridWidth; i++) {
            this.ctx.fillRect(tileWidth * i, 0, 1, canvas.height);
        }
        this.ctx.restore();
    }

    draw(gol) {
        this.ctx.fillStyle = "black";
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        const tileWidth = canvas.width / gridWidth;
        const tileHeight = canvas.height / gridHeight;
        for (const point of gol.grid.getAlivePoints()) {
            if (point.x > 0 && point.x < gridWidth && point.y > 0 && point.y < gridHeight) {
                this.ctx.fillRect(tileWidth * point.x, tileHeight * point.y, tileWidth, tileHeight);
            }
        }

        this.drawGrid();
    }
}


class Controller {
    constructor(gol, view, startingInterval) {
        this.gol = gol;
        this.view = view;
        this.isPlaying = false;
        this.interval = startingInterval
        this.lastRun = new Date().getTime();
        window.requestAnimationFrame(() => this.runAnimation());
    }

    draw() {
        this.view.draw(this.gol);
    }

    toggle(point) {
        this.gol.grid.toggleState(point);
        this.view.draw(this.gol);
    }

    step() {
        this.gol.update();
        this.draw();
    }

    runAnimation() {
        if (this.isPlaying) {
            const now = new Date().getTime();
            if (now > (this.lastRun + this.interval)) {
                this.step();
                this.lastRun = now;
            }
        }
        window.requestAnimationFrame(() => this.runAnimation());
    }

    play() { this.isPlaying = true; }
    pause() { this.isPlaying = false; }
}

ctrl = new Controller(
    new GameOfLife(),
    new GridView(canvas),
    20
);


const next = () => ctrl.step();
const play = () => ctrl.play();
const pause = () => ctrl.pause();

function selectStart() {
    const name = select.value;
    pause();

    ctrl.gol.grid.clear();
    let points = [];
    for (const coords of startingOptions[name]) {
        points.push(new Point(coords[0], coords[1]));
    }
    ctrl.gol.addAlivePoints(points);

    ctrl.draw();
}

// Create the list of options and load button
function buildStartingOptionsList() {
    for (const name in startingOptions) {
        const opt = document.createElement("option");
        opt.value = name;
        opt.innerHTML = name;
        select.appendChild(opt);
    }
}
buildStartingOptionsList();

speedElem.addEventListener('change', (e) => {
    ctrl.interval = 1000 / parseInt(e.target.value);
});

speedElem.value = 1000 / ctrl.interval;

// Set up for flier
select.value = "Gosper glider gun";
selectStart();
play();
