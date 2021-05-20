import React from 'react';
import PropTypes from 'prop-types';
import Cell from './cell';
import * as gameutils from '../gameutils';
import { Levels } from '../gameConstants';

class GameField extends React.Component {
    constructor(props) {
        super(props);
        this.state = { cellsPeaked: []};
    }

    renderSquare(i) {
        return <Cell
            key={i}
            value={this.props.guesses[i]}
            onClick={(e) => { this.props.onClick(i); e.preventDefault(); }}
            onContextMenu={(e) => { this.props.onContextMenu(i); e.preventDefault(); }}
            onMouseDown={(e) => { this.peekAt(i); e.preventDefault(); }}
            onMouseUp={(e) => { this.stopPeek(); e.preventDefault(); }}
            peekedAt={this.state.cellsPeaked.includes(i)}
        />;
    }

    peekAt(i) {
        if (Number.isInteger(this.props.guesses[i])) {
            const cellsPeaked = [];
            console.log("peek at " + i);
            for (const neighbour of gameutils.getIndexesAround(i, this.props.width, this.props.height))
                cellsPeaked.push(neighbour);
            this.setState( { cellsPeaked: cellsPeaked });
        }
    }

    stopPeek() {
        this.setState( { cellsPeaked: [] } );
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
    height: Levels.Easy.height,
    width: Levels.Easy.width
}
GameField.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
}

export default GameField;
