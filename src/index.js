import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './index.css';

const MineRatio = 0.15;
const Levels = [
    {
        name: "Easy",
        mines: 10,
        size: [9,9]
    },
    {
        name: "Medium",
        mines: 40,
        size: [16,16]
    },
    {
        name: "Expert",
        mines: 99,
        size: [30,16]
    }
];

const GameState = {
    Ongoing: '🙂',
    Loss: '💀',
    Win: '😎'
};

function Cell(props) {
    let className = "square";
    let value = props.value;
    const isNumber = Number.isInteger(value) && value > 0 && value <= 9;
    if (isNumber)
        className += " square_number_" + value;
    if (isNumber || value === "" || value === '💥')
        className += " square_revealed";
    if (value === "🚩💣") {
        value = '🚩';
        className += " square_bad_flag";
    }
    return (
        <button className={className} onClick={props.onClick} onContextMenu={props.onContextMenu}>
        {value}
        </button>
    );
}

function StepCounter(props) {
    const message = (props.maxSteps === 0) ? "" : "Steps: ";
    const counter = <input type="range" min="0" max={props.maxSteps} value={props.currentStep} onChange={props.onChange} />;
    return (
        <div id="stepcounter">
            {message}
            {(props.maxSteps === 0) ? "" : counter}
        </div>
    );
}


class Field extends React.Component {
    renderSquare(i) {
        return <Cell
            key={i}
            value={this.props.guesses[i]}
            onClick={(e) => { this.props.onClick(i); e.preventDefault(); }}
            onContextMenu={(e) => { this.props.onContextMenu(i); e.preventDefault(); }}
        />;
    }

    render() {
        return (
        <div>
            {Array.from(Array(this.props.height).keys()).map(y => {
                return (
                <div key={y} className="board-row">
                    {Array.from(Array(this.props.width).keys()).map(x => this.renderSquare(x + y * this.props.width) )}
                </div>);
                }
            )}
        </div>
        );
    }
}

Field.defaultProps = {
    height: 3, width: 3
}
Field.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.numCells = props.width * props.height;
        this.numMines = Math.floor(this.numCells * this.props.mineRatio);
        console.assert(this.numCells > 0);
        this.initialState = {
            history: [{
                guesses: Array(this.numCells).fill(null)
            }],
            stepNumber: 0,
            numFlags: 0,
            gameState: GameState.Ongoing
        };
        this.state = this.initialState;
    }

    reset() {
        this.setState(this.initialState);
    }

    handleClick(i, isFlag) {
        if (this.state.gameState !== GameState.Ongoing)
            return;
        this.stateDirty = false;
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const guesses = current.guesses.slice();
        let gameState = this.state.gameState;
        if (this.state.stepNumber === 0) {
            this.mines = initMines(this.numMines, this.props.width, this.props.height, i);
        }
        let numFlags = this.state.numFlags;
        if (isFlag === true) {
            if (guesses[i] === '🚩') {
                guesses[i] = null;
                numFlags--;
                this.stateDirty = true;
            }
            else if (guesses[i] === null) {
                guesses[i] = '🚩';
                numFlags++;
                this.stateDirty = true;
            }
            this.setState({numFlags: numFlags});
        } else {
            if (guesses[i] === null) {
                gameState = this.revealAt(guesses, i);
            } else {
                const numMinesToFind = this.mines[i];
                let numGuessedMinesAround = 0;
                let numUnguessedAround = 0;
                for (const neighbour of getIndexesAround(i, this.props.width, this.props.height)) {
                    if (guesses[neighbour] === '🚩')
                        numGuessedMinesAround++;
                    else if (guesses[neighbour] === null)
                        numUnguessedAround++;
                }
                if (numUnguessedAround > 0) {
                    if (numGuessedMinesAround >= numMinesToFind)
                    for (const neighbour of getIndexesAround(i, this.props.width, this.props.height))
                        if (guesses[neighbour] === null && (gameState = this.revealAt(guesses, neighbour)) === GameState.Loss)
                            break;
                }
            }
        }
        if (gameState === GameState.Loss) {
            this.setState({gameState: GameState.Loss});
            this.onLoss(guesses, i);
        }
        if (this.checkWin(guesses)) {
            this.setState({gameState: GameState.Win});
        }
        if (this.stateDirty === true) {
            this.setState({
                history: history.concat([{
                    guesses: guesses,
                }]),
                stepNumber: history.length,
            });
        }
    }

    checkWin(guesses) {
        for (let i = 0; i < this.numCells; i++) {
            // check that all non-mine cells are open
            if (this.mines[i] !== 9 && (guesses[i] === null || guesses[i] === '🚩')) {
                return false;
            }
        }
        return true;
    }

    onLoss(guesses, i) {
        for (let n = 0; n < this.numCells; ++n)
            if (n !== i) {
                // reveal unseen bombs
                if (this.mines[n] === 9) {
                    if (guesses[n] === null) {
                        guesses[n] = '💣';
                    }
                // mark bad flags
                } else if (guesses[n] === '🚩') {
                    guesses[n] = "🚩💣";
                }
            }
    }

    // recursive reveal of an unguessed cell
    revealAt(guesses, i) {
        if (guesses[i] !== null)
            return GameState.Ongoing;
        if (this.mines[i] === 9) {
            guesses[i] = '💥';
            this.stateDirty = true;
            return GameState.Loss;
        }
        if (this.mines[i] === 0) {
            guesses[i] = "";
            this.stateDirty = true;
            for (const neighbour of getIndexesAround(i, this.props.width, this.props.height))
                if (this.revealAt(guesses, neighbour) === GameState.Loss)
                    return GameState.Loss;
        } else {
            this.stateDirty = true;
            guesses[i] = this.mines[i];
        }
        return GameState.Ongoing;
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];

        const counter = (
                <StepCounter
                    currentStep={this.state.stepNumber}
                    maxSteps={history.length - 1}
                    onChange={(e) => this.setState({stepNumber: (e.target.value)})}
                />
        );

        return (
        <div className="game">
            <div className="game-status">
                <div className="mine-counter status_button">
                    {this.numMines - this.state.numFlags}
                </div>
                <div className="emoji status_button" onClick={() => this.reset()}>
                    {this.state.gameState}
                </div>
            </div>
            <div className="game-board">
                <Field
                    width={this.props.width}
                    height={this.props.height}
                    guesses={current.guesses}
                    onClick={(i) => this.handleClick(i, false)}
                    onContextMenu={(i) => {this.handleClick(i, true);}}
                />
            </div>
            <div className="game-info">
                {counter}
            </div>
        </div>
        );
    }
}

Game.defaultProps = {
    height: 3, width: 3, mineRatio: MineRatio
}
Game.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    mineRatio: PropTypes.number
}

function initMines(numMines, width, height, startCell) {
    const numCells = width * height;
    var mines = Array(numCells).fill(0);
    for (let i = 1; i <= numMines; ++i) {
        let lastCell = numCells - i;
        let j = Math.floor(Math.random() * lastCell);
        while (j === startCell || mines[j] === 9) {
            j = lastCell++;
        }
        console.assert(mines[j] !== 9);
        mines[j] = 9;
        const neighbourIndices = Array.from(getIndexesAround(j, width, height));
        for (const neighbour of neighbourIndices)
            mines[neighbour] = mines[neighbour] === 9 ? 9 : mines[neighbour] + 1;
    }
    return mines;
}

function IndexToPos(index, width) {
    return [index % width, (index / width) >> 0]; // integer division hack
}

// Enumerate indexes around another index
function* getIndexesAround(pos, width, height) {
    const [x,y] = IndexToPos(pos, width);
    const minX = x === 0 ? 0 : x - 1;
    const minY = y === 0 ? 0 : y - 1;
    const maxX = x === width - 1 ? x : x + 1;
    const maxY = y === height - 1 ? y : y + 1;
    for (let i = minX; i <= maxX; ++i)
        for (let j = minY; j <= maxY; ++j)
            if (x !== i || y !== j) {
                yield i + j * width;
            }
}

// ========================================

ReactDOM.render(
<Game width={10} height={10} settings={Levels.Easy} />,
document.getElementById('root')
);
