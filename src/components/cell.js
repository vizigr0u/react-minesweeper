import propTypes from "prop-types";

const Cell = (props) => {
    let className = "square";
    let value = props.value;
    const isNumber = Number.isInteger(value) && value > 0 && value <= 9;
    if (isNumber)
        className += " square_number_" + value;
    if (value === "🚩💣") {
        value = '🚩';
        className += " square_bad_flag";
    }
    if (isNumber || value === ""
        || value === '💥'
        || (className === "square" && props.peekedAt && value !== '🚩'))
        className += " square_revealed";
    return (
        <button
            className={className}
            onClick={props.onClick}
            onContextMenu={props.onContextMenu}
            onMouseDown={props.onMouseDown}
            onMouseUp={props.onMouseUp}
        >
            {value}
        </button>
    );
}

Cell.defaultProps = {
    peekedAt: false,
}

Cell.propTypes = {
    peekedAt: propTypes.bool,
}

export default Cell;
