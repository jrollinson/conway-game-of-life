# Conway's Game of Life

A web-based implementation of John Conway's Game of Life, created primarily as a learning exercise for JavaScript, HTML Canvas, and web development concepts.

## Live Demo

You can try the simulation live at: [http://conway.josephrollinson.com](http://conway.josephrollinson.com)

## Features

*   Visual simulation of Conway's Game of Life on an HTML Canvas.
*   **Interactive Controls:**
    *   Play/Pause the simulation.
    *   Step through the simulation one generation at a time.
    *   Adjust the simulation speed using a slider.
    *   Select from various classic predefined starting patterns (Glider, Gosper Glider Gun, etc.).
    *   Click on cells within the grid to toggle their state (alive/dead).
*   **Efficient Grid Implementation:** Uses a JavaScript `Map` where keys are column indices (`x`) and values are `Set`s of alive row indices (`y`) for that column. This efficiently represents potentially sparse and large grids.
*   Optimized update logic that only checks cells that could potentially change state (alive cells and their immediate neighbors).

## How to Run Locally

1.  Clone this repository or download the source code.
2.  Navigate to the `static` directory.
3.  Open the `index.html` file directly in your web browser. No local web server is required.

## Deployment

The static files (`index.html`, `main.js`, `style.css`) are deployed to AWS S3 and served as a static website. The deployment process is handled by the `deploy.sh` script, which uses the AWS CLI to sync the `static/` directory with the S3 bucket.
