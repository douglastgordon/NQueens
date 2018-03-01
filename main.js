const SIDE_LENGTH = 8


class Board {
  constructor() {
    this.tiles = Array.from(new Array(SIDE_LENGTH), () => Array.from(new Array(SIDE_LENGTH), () => 0))
  }

  addQueen(position) {
    this._setTile(position, 1)
  }

  removeQueen(position) {
    this._setTile(position, 0)
  }

  _setTile(position, val) {
    const [x, y] = position
    this.tiles[x][y] = val
  }

  populateTiles() {
    // add one queen per row, picking position with minimum conflicts
    this.tiles.forEach((row, x) => {
      this.addQueen(this.leastConflictedTileInRow(row, x))
    })
  }

  leastConflictedTileInRow(row, x) {
    return row.map((_, y) => {
      const position = [x, y]
      return {
        position,
        conflicts: this.totalConflicts(position),
      }
    }).sort((a, b) => {
      return a.conflicts - b.conflicts
    })[0].position
  }

  totalConflicts(position) {
    return (
      this.rowConflicts(position) +
      this.columnConflicts(position) +
      this.diagonalConflicts(position)
    )
  }

  rowConflicts(position) {
    const [x, _] = position
    const row = this.tiles[x]
    return row.sum() - 1
  }

  columnConflicts(position) {
    const [_, y] = position
    return this.tiles.map(row => row[y]).sum() - 1
  }

  diagonalConflicts(position) {
    return this.tiles.map((row, x) => {
      return row.filter((_, y) => {
        return this.shareDiagonal(position, [x, y])
      }).sum()
    }).sum() - 1
  }

  shareDiagonal(positionA, positionB) {
    const [[xA, yA], [xB, yB]] = [positionA, positionB]
    return Math.abs(xA - xB) === Math.abs(yA - yB)
  }
}


Array.prototype.sum = function () {
  const add = (a, b) => a + b
  if (!this.length) { return 0 }
  return this.reduce(add)
}


const board = new Board
console.log(board.tiles)
board.populateTiles()
console.log(board.tiles)
// board.addQueen([0, 0])
// board.addQueen([1, 0])
// board.addQueen([0, 4])
// board.addQueen([7, 0])
// board.addQueen([5, 4])
// board.addQueen([5, 5])

// console.log(board.rowConflicts([0, 0])) // 1
// console.log(board.columnConflicts([0, 0])) // 2
// console.log(board.diagonalConflicts([0, 0])) // 1
// console.log(board.totalConflicts([0, 0])) // 4
