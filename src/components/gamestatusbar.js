import React from 'react';
import PropTypes from 'prop-types';

const GameStatusBar = (props) => {
   return (
        <div className="game-status">
            <div className="mine-counter status_button">
                {props.minesLeft}
            </div>
            <div className="emoji status_button" onClick={props.gameReset}>
                {props.emoji}
            </div>
        </div>
    );
}

GameStatusBar.defaultProps = {
    minesLeft: 0
}

GameStatusBar.propTypes = {
    minesLeft: PropTypes.number,
    emoji: PropTypes.string
}


export default GameStatusBar;
