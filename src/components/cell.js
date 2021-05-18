const Cell = (props) => {
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

export default Cell;