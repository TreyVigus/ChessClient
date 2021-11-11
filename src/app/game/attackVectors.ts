import { addPositions, flatten, itemAt, posEquals, validPosition } from "../utils/helpers.js";
import { BOARD_SIZE } from "../view/boardView.js";
import { ChessState, Color, Position, Square } from "./models.js";

export type Direction = 'north' | 'northEast' | 'east' | 'southEast' | 'south' | 'southWest' | 'west' | 'northWest';

export type VerticalDirection = 'north' | 'south';

export function sameRow(piecePos: Position, state: ChessState): Square[] {
    return state.board[piecePos[0]];
}

export function sameColumn(piecePos: Position, state: ChessState): Square[] {
    let col: Square[] = [];
    for(let i = 0; i < BOARD_SIZE; i++) {
        col.push(state.board[i][piecePos[1]]);
    }
    return col;
}

export function samePositiveDiagonal(piecePos: Position, state: ChessState): Square[] {
    //a positive diagonal consists of all squares with the same sum of coordinates.
    const diagSum = piecePos[0] + piecePos[1];
    let diag: Square[] = [];
    let iterator: Position = diagSum <= 7 ? [0, diagSum] : [diagSum - 7, 7];
    while(iterator[0] <= 7 && iterator[1] >= 0) {
        diag.push(itemAt(state.board, iterator));
        iterator = addPositions(iterator, [1, -1]);
    }
    return diag;
}

export function sameNegativeDiagonal(piecePos: Position, state: ChessState): Square[] {
    //a negative diagonal consists of all squares with the same difference of coordinates.
    const diagDiff = piecePos[0] - piecePos[1];
    let diag: Square[] = [];
    let iterator: Position = diagDiff >= 0 ? [diagDiff, 0] : [0, -1*diagDiff];
    while(iterator[0] <= 7 && iterator[1] <= 7) {
        diag.push(itemAt(state.board, iterator));
        iterator = addPositions(iterator, [1, 1]);
    }
    return diag;
}

/** 
 * Given the piecePos [i, j] 
 * if color is white, return [i-1, j-1] and [i-1, j+1]
 * if color is white, return [i+1, j-1] and [i+1, j+1]
 * Useful for pawn movements.
 */
export function sameUnitDiagonals(piecePos: Position, state: ChessState, color: Color): Square[] {
    const adj = color === 2 ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];
    return adj.map(pos => addPositions(piecePos, pos as Position)).filter(pos => validPosition(pos)).map(pos => itemAt(state.board, pos));
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

    let leftBlocker = 0;
    for(let i = piecePosIndex - 1; i > 0; i--) {
        if(squares[i].piece) {
            leftBlocker = i;
            break;
        }
    }

    let rightBlocker = squares.length - 1;
    for(let i = piecePosIndex + 1; i < squares.length - 1; i++) {
        if(squares[i].piece) {
            rightBlocker = i;
            break;
        }
    }

    return squares.slice(leftBlocker, rightBlocker + 1);
}

/** 
 * Find a position one square from the given position in the given direction.
*/
export function adjacent(pos: Position, direction: VerticalDirection): Position | undefined {
    const vec: Position = direction === 'north' ? [-1, 0] : [1, 0];
    const adj = addPositions(pos, vec);
    return validPosition(adj) ? adj : undefined;
}