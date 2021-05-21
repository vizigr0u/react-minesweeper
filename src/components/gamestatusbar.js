import React from 'react';
import PropTypes from 'prop-types';
import Timer from './timer';
import { GameState } from '../gameConstants';

const getEmoji = (gameState) => {
    switch (gameState) {
        case GameState.Loss:
            return '💀';
        case GameState.Win:
            return '😎';
        default:
            return'🙂';
    };
}

const GameStatusBar = (props) => {
    const emoji = getEmoji(props.gameState);
    return (
        <div className="game-status">
            <div className="mine-counter status_button">
                {props.minesLeft}
            </div>
            <div className="emoji status_button" onClick={props.gameReset}>
                {emoji}
            </div>
            <Timer className="timer status_button"
                isRunning={props.gameState === GameState.Ongoing}
                startTime={props.startTime}
            />
        </div>
    );
}

GameStatusBar.defaultProps = {
    minesLeft: 0,
    startTime: undefined,
    gameState: GameState.NewGame
}

GameStatusBar.propTypes = {
    minesLeft: PropTypes.number,
    gameState: PropTypes.number,
    startTime: PropTypes.instanceOf(Date)
}

export default GameStatusBar;
