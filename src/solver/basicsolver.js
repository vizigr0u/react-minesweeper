// import * as gameutils from '../gameutils';

class BasicSolver {
    constructor(guesses, width, onSolve) {
        this.guesses = guesses;
        this.width = width;
        this.height = guesses.length / width;
        this.onSolve = onSolve;
    }
    solve() {
        console.log("solving for %d×%d on %d guesses", this.width, this.height, this.guesses.length);
    }
}

BasicSolver.solve = (guesses, width, onSolve) => {
    const solver = new BasicSolver(guesses, width, onSolve);
    return solver.solve();
}

export default BasicSolver;
