import { addPositions, flat, itemAt, posEquals, validPosition } from "../utils/helpers.js";
import { ChessState, Position, Square } from "./models.js";

export type Direction = 'north' | 'northEast' | 'east' | 'southEast' | 'south' | 'southWest' | 'west' | 'northWest';

export type VerticalDirection = 'north' | 'south';

//TODO: these should probably return Position[], not Square[]. (wouldn't need any knowledge of the state if we did this, which is elegant)
//TODO: after doing the above, name this 'relativePositions.ts' May want to move filterBlockedSquares somewhere else as well (maybe state queries?)

export function sameRow(piecePos: Position, state: ChessState): Square[] {
    return state.board[piecePos[0]];
}

export function sameColumn(piecePos: Position, state: ChessState): Square[] {
    return [...flat(state.board)].filter(sq => sq.index[1] === piecePos[1]).map(sq => sq.value);
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
 * Given the piecePos [i, j] 
 * if direction is up, return [i-1, j-1] and [i-1, j+1]
 * if direction is down, return [i+1, j-1] and [i+1, j+1]
 * Useful for pawn movements.
 */
export function sameUnitDiagonals(piecePos: Position, state: ChessState, direction: VerticalDirection): Square[] {
    const northWest: Position = [-1, -1];
    const northEast: Position = [-1, 1];
    const southWest: Position = [1, -1];
    const southEast: Position = [1, 1];

    const adj = direction === 'north' ? [northWest, northEast] : [southWest, southEast];
    return adj.map(pos => addPositions(piecePos, pos)).filter(pos => validPosition(pos)).map(pos => itemAt(state.board, pos));
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
        throw 'piecePos was not found in squares array.';
    }

    const pieceIndices = squares.map((s, index) => {
        return {piece: s.piece, index}
    });

    const leftBlocker = pieceIndices.slice(0, piecePosIndex).filter(p => !!p.piece).pop()?.index ?? 0;
    const rightBlocker = pieceIndices.slice(piecePosIndex + 1).filter(p => !!p.piece).shift()?.index ?? squares.length - 1;
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