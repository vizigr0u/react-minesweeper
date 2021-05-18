import React from 'react';
import PropTypes from 'prop-types';
import * as gameutils from '../gameutils';
import { Levels, GameState } from '../gameConstants';
import StepCounter from './stepcounter';
import GameField from './gamefield';
import GameStatusBar from './gamestatusbar';
import LevelPicker from './levelpicker';

export default class Game extends React.Component {
    constructor(props) {
        super(props);
        this.init(props.level);
        this.state = this.makeInitialState();
    }

    makeInitialState() {
        return {
            history: [{
                guesses: Array(this.numCells).fill(null)
            }],
            stepNumber: 0,
            numFlags: 0,
            gameState: GameState.Ongoing
        }
    }

    init(level) {
        console.log("init(level = %s)", JSON.stringify(level));
        this.level = level;
        this.width = level.width;
        this.height = level.height;
        this.numCells = this.width * this.height;
        this.numMines = level.mines;
        console.log("init: %d×%d cells: %d mines: %d", this.width, this.height, this.numCells, this.numMines)
        console.assert(this.numCells > 0);
    }

    reset(level) {
        console.log("RESET");
        this.init((level === undefined) ? this.level : level);
        this.setState(this.makeInitialState());
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
            this.mines = gameutils.initMines(this.numMines, this.width, this.height, i);
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
                for (const neighbour of gameutils.getIndexesAround(i, this.width, this.height)) {
                    if (guesses[neighbour] === '🚩')
                        numGuessedMinesAround++;
                    else if (guesses[neighbour] === null)
                        numUnguessedAround++;
                }
                if (numUnguessedAround > 0) {
                    if (numGuessedMinesAround >= numMinesToFind)
                    for (const neighbour of gameutils.getIndexesAround(i, this.width, this.height))
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
            for (const neighbour of gameutils.getIndexesAround(i, this.width, this.height))
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

        return (
        <div className="game">
            <GameStatusBar
                minesLeft={this.numMines - this.state.numFlags}
                gameReset={() => this.reset()}
                emoji={this.state.gameState}
            />
            <div className="game-board">
                <GameField
                    width={this.width}
                    height={this.height}
                    guesses={current.guesses}
                    onClick={(i) => this.handleClick(i, false)}
                    onContextMenu={(i) => {this.handleClick(i, true);}}
                />
            </div>
            <div className="game-info">
                <StepCounter
                    currentStep={this.state.stepNumber}
                    maxSteps={history.length - 1}
                    onChange={(e) => this.setState({stepNumber: (e.target.value)})}
                />
                <LevelPicker onChangeLevel={(level) => this.reset(level)} />
            </div>
        </div>
        );
    }
}

Game.defaultProps = {
    level: Levels.Easy
}

Game.propTypes = {
    level: PropTypes.exact({
        mines: PropTypes.number,
        width: PropTypes.number,
        height: PropTypes.number,
      })
}
