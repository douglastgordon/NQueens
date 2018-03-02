const SIDE_LENGTH = 8

Array.prototype.sum = function () {
  const add = (a, b) => a + b
  if (!this.length) { return 0 }
  return this.reduce(add)
}

Array.prototype.containsLoop = function () {
  const flattenedMoves = this.map((move) => {
    return move.map((position) => {
      return position.join("")
    }).join("")
  })
  return (new Set(flattenedMoves)).size !== flattenedMoves.length
}

class Board {
  constructor() {
    this.tiles = Array.from(new Array(SIDE_LENGTH), () => Array.from(new Array(SIDE_LENGTH), () => 0))
  }

  moveQueen(from, to) {
    this.removeQueen(from)
    this.addQueen(to)
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

  isQueen(position) {
    const [x, y] = position
    return this.tiles[x][y]
  }

  findMostConflictedQueen() {
    let mostConflictedQueenPosition = [null, null]
    let mostConflicts = 0
    this.tiles.forEach((row, x) => {
      row.forEach((tile, y) => {
        if (tile) {
          const position = [x, y]
          const conflicts = this.totalConflicts(position)
          if (conflicts > mostConflicts) {
            mostConflictedQueenPosition = position
            mostConflicts = conflicts
          }
        }
      })
    })
    return mostConflictedQueenPosition
  }

  // populateTiles() {
  //   // add one queen per row, picking position with minimum conflicts
  //   this.tiles.forEach((row, x) => {
  //     this.addQueen(this.leastConflictedTileInRow(row, x))
  //   })
  // }



  randomlyPopulateTiles() {
    this.tiles.forEach((row, x) => {
      const randomY = Math.floor(Math.random() * SIDE_LENGTH)
      this.addQueen([x, randomY])
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

  isSolved() {
    return this.findMostConflictedQueen === [null, null]
  }

  shareDiagonal(positionA, positionB) {
    const [[xA, yA], [xB, yB]] = [positionA, positionB]
    return Math.abs(xA - xB) === Math.abs(yA - yB)
  }

  printBoard() {
    console.log(this.tiles)
  }

  // makeInitialHtml() {
  //   const ul = document.getElementById("board")
  //   board.tiles.forEach((row, x) => {
  //     row.forEach((el, y) => {
  //       const li = document.createElement("li")
  //       li.id = `${x}-${y}`
  //       const fileClass = x % 2 === 0 ? "even-file" : "odd-file"
  //       const rankClass = y % 2 === 0 ? "even-rank" : "odd-rank"
  //       li.classList.add(fileClass)
  //       li.classList.add(rankClass)
  //       if (this.isQueen([x, y])) {
  //         const queen = document.createElement("img")
  //         queen.src = "queen.png"
  //         li.appendChild(queen)
  //       }
  //       ul.appendChild(li)
  //     })
  //   })
  // }

  // changeQueensHtml(from, to) {
  //   const [[fromX, fromY], [toX, toY]] = [from, to]
  //   const fromNode = document.getElementById(`${fromX}-${fromY}`)
  //   console.log(fromNode)
  //   fromNode.innerHTML = ""
  //   const toNode =  document.getElementById(`${toX}-${toY}`)
  //   const queen = document.createElement("img")
  //   queen.src = "queen.png"
  //   toNode.appendChild(queen)
  // }

  run() {
    this.randomlyPopulateTiles()
    // this.makeInitialHtml()


    let moves = []
    while (!this.isSolved() && moves.length < 10) {
      const [x, y] = this.findMostConflictedQueen()
      const leastConflictedTileInRow = this.leastConflictedTileInRow(this.tiles[x], x)
      this.moveQueen([x, y], leastConflictedTileInRow)
      moves.push([[x, y], leastConflictedTileInRow])
      if (moves.containsLoop()) {
        this.randomlyPopulateTiles()
        // this.makeInitialHtml()
      }
    }
    console.log(moves)


    // moves.forEach((move, i) => {
    //   const [from, to] = move
    //   setTimeout(() => {
    //     this.changeQueensHtml(from, to)
    //   }, 1000 * (i + 1))
    // })


  }
}

const board = new Board
board.run()
