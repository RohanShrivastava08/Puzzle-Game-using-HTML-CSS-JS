// script.js

const puzzleContainer = document.querySelector('.puzzle');
const shuffleButton = document.getElementById('shuffle');
const size = 5; // 5x5 grid
const emptyTile = size * size - 1; // Index of the empty tile

let tiles = Array.from({ length: size * size }, (_, i) => i);

function createPuzzle() {
    puzzleContainer.innerHTML = '';
    tiles.forEach((tile, index) => {
        if (tile !== emptyTile) {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.style.backgroundPosition = `${-(tile % size) * 100}px ${-Math.floor(tile / size) * 100}px`;
            piece.style.backgroundImage = 'url("img.jpg")'; // Custom image path
            piece.dataset.index = index;
            piece.addEventListener('click', () => moveTile(index));
            puzzleContainer.appendChild(piece);
        } else {
            const empty = document.createElement('div');
            empty.className = 'puzzle-piece empty';
            puzzleContainer.appendChild(empty);
        }
    });
}

function getTileIndex(index) {
    const [row, col] = [Math.floor(index / size), index % size];
    const emptyTileIndex = tiles.indexOf(emptyTile);
    const [emptyRow, emptyCol] = [Math.floor(emptyTileIndex / size), emptyTileIndex % size];
    return (Math.abs(row - emptyRow) === 1 && col === emptyCol) || 
           (Math.abs(col - emptyCol) === 1 && row === emptyRow);
}

function moveTile(index) {
    const emptyTileIndex = tiles.indexOf(emptyTile);
    if (getTileIndex(index)) {
        [tiles[emptyTileIndex], tiles[index]] = [tiles[index], tiles[emptyTileIndex]];
        createPuzzle();
        if (checkWin()) {
            showCongratsPopup();
        }
    }
}

function checkWin() {
    return tiles.every((tile, index) => tile === index);
}

function showCongratsPopup() {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <div class="popup-content">
            <h2>Congratulations!</h2>
            <p>You solved the puzzle!</p>
            <button id="close-popup">Close</button>
        </div>
    `;
    document.body.appendChild(popup);
    document.getElementById('close-popup').addEventListener('click', () => {
        document.body.removeChild(popup);
    });
}

function shufflePuzzle() {
    let shuffled;
    let emptyTileIndex;
    do {
        shuffled = tiles.slice();
        emptyTileIndex = shuffled.indexOf(emptyTile);
        // Perform a more complex shuffle
        for (let i = 0; i < 5000; i++) { // Increased shuffling iterations for more complexity
            const validMoves = [
                emptyTileIndex - size, // Up
                emptyTileIndex + size, // Down
                emptyTileIndex - 1, // Left
                emptyTileIndex + 1  // Right
            ].filter(index => index >= 0 && index < size * size && 
                (index % size === emptyTileIndex % size || Math.abs(index - emptyTileIndex) === size));
            if (validMoves.length > 0) {
                const move = validMoves[Math.floor(Math.random() * validMoves.length)];
                [shuffled[emptyTileIndex], shuffled[move]] = [shuffled[move], shuffled[emptyTileIndex]];
                emptyTileIndex = move; // Update the empty tile index
            }
        }
    } while (!canSolve(shuffled)); // Ensure the puzzle is solvable
    tiles = shuffled;
    createPuzzle();
}

function canSolve(puzzle) {
    const inversions = puzzle.reduce((invCount, tile, i) => {
        return invCount + puzzle.slice(i + 1).filter(t => t < tile).length;
    }, 0);
    return inversions % 2 === 0;
}

// Shuffle puzzle on load
window.onload = shufflePuzzle;

shuffleButton.addEventListener('click', shufflePuzzle);
