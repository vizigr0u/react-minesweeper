import React from 'react';
import PropTypes from 'prop-types';
import Timer from './timer';

const GameStatusBar = (props) => {
   return (
        <div className="game-status">
            <div className="mine-counter status_button">
                {props.minesLeft}
            </div>
            <div className="emoji status_button" onClick={props.gameReset}>
                {props.emoji}
            </div>
            <Timer className="timer status_button"
                isRunning={props.timeRunning}
                startTime={props.startTime}
            />
        </div>
    );
}

GameStatusBar.defaultProps = {
    minesLeft: 0,
    timeRunning: false,
    startTime: undefined
}

GameStatusBar.propTypes = {
    minesLeft: PropTypes.number,
    emoji: PropTypes.string,
    timeRunning: PropTypes.bool,
    startTime: PropTypes.instanceOf(Date)
}


export default GameStatusBar;
