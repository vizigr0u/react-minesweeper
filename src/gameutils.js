export function indexToPos(index, width) {
    return [index % width, (index / width) >> 0]; // integer division hack
}

// Enumerate indexes around another index
export function* getIndexesAround(pos, width, height) {
    const [x,y] = indexToPos(pos, width);
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

export function initMines(numMines, width, height, startCell) {
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
