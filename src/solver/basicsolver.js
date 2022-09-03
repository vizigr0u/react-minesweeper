import * as gameutils from '../gameutils';

class BasicSolver {
    constructor(guesses, width, onSolve) {
        this.guesses = guesses;
        this.width = width;
        this.height = guesses.length / width;
        this.onSolve = onSolve;
    }

    solve() {
        let hints = [];
        this.categorizeCells();
        this.guessedNearEmpty.forEach(cell => {
            
        });
        return hints;
    }

    categorizeCells() {
        this.unguessedCells = [];
        this.unguessedNearHints = [];
        this.guessedCells = [];
        this.guessedNearEmpty = [];
        for (let i = 0; i < this.guesses.length; i++) {
            const cell = this.guesses[i];
            const neighbours = Array.from(gameutils.getIndexesAround(i, this.width, this.height));
            const countNeighbours = ((match) => {
                let num = 0;
                neighbours.forEach(i => {
                    if (match(this.guesses[i]))
                        num++;
                });
                return num;
            });
            if (cell === null) {
                this.unguessedCells.push(i);
                const hintsAround = countNeighbours(e => Number.isInteger(e));
                if (hintsAround > 0)
                    this.unguessedNearHints.push(i);
            }
            else if (Number.isInteger(cell)) {
                this.guessedCells.push(i);
                const unguessedAround = countNeighbours(e => e === null);
                if (unguessedAround > 0)
                    this.guessedNearEmpty.push(i);
            }
        }
        console.log("guesses categorized: guessed: %d (with empty neighbors: %d), unguessed: %d (with hint neighbours: %d)",
        this.guessedCells.length, this.guessedNearEmpty.length, this.unguessedCells.length, this.unguessedNearHints.length);
    }
}

BasicSolver.solve = (guesses, width, onSolve) => {
    const solver = new BasicSolver(guesses, width, onSolve);
    return solver.solve();
}

export default BasicSolver;
