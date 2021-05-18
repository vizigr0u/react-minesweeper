import React from 'react';
import PropTypes from 'prop-types';
import Cell from './cell';
import { Levels } from '../gameConstants';

class GameField extends React.Component {
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

GameField.defaultProps = {
    height: Levels.Easy.height, width: Levels.Easy.width
}
GameField.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
}

export default GameField;
