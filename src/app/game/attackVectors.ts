import { flat, posEquals } from "../utils/helpers.js";
import { ChessState, Position, Square } from "./models.js";

export function sameRow(piecePos: Position, state: ChessState): Square[] {
    return state.board[piecePos[0]];
}

export function sameColumn(piecePos: Position, state: ChessState): Square[] {
    let col: Square[] = [];
    for(const item of flat(state.board)) {
        if(item.index[1] === piecePos[1]) {
            col.push(item.value);
        }
    }
    return col;
}

export function samePositiveDiagonal(piecePos: Position, state: ChessState): Square[] {
    //a positive diagonal consists of all squares with the same sum of coordinates.
    const diagSum = piecePos[0] + piecePos[1];
    return [...flat(state.board)].map(sq => sq.value).filter(s => (s.position[0] + s.position[1]) === diagSum);
}

export function sameNegativeDiagonal(piecePos: Position, state: ChessState): Square[] {
    //a positive diagonal consists of all squares with the same difference of coordinates.
    const diagDiff = piecePos[0] - piecePos[1];
    return [...flat(state.board)].map(sq => sq.value).filter(s => (s.position[0] - s.position[1]) === diagDiff);
}

/** 
 * Assume squares is either the row, col, or diagonal containing piecePos.
 * Assume the piece at piecePos would attack all given squares if all squares were empty (no pieces present)
 * Define leftBlocker as the first piece's pos to the left of piecePos in squares or 0 if none exists
 * Define rightBlocker as the first piece's pos to the right of piecePos in squares or squares.length - 1 if none exists.
 * Return squares[leftBlocker...rightBlocker].
 */
export function filterBlockedSquares(piecePos: Position, squares: Square[]): Square[] {
    const piecePosIndex = squares.findIndex(s => posEquals(s.position, piecePos));
    if(piecePosIndex === -1) {
        throw 'piecePos was not found in squares array.'
    }

    let leftBlocker = 0;
    for(let i = piecePosIndex - 1; i > -1; i--) {
        if(squares[i].piece) {
            leftBlocker = i;
            break;
        }
    }

    let rightBlocker = squares.length - 1;
    for(let i = piecePosIndex + 1; i < squares.length; i++) {
        if(squares[i].piece) {
            rightBlocker = i;
            break;
        }
    }

    return squares.slice(leftBlocker, rightBlocker + 1);
}