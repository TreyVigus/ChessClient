import { ChessState, Piece, Position, Square } from "../app/game/models.js";
import { constructBoard, itemAt, posEquals, posSequence } from "../app/utils/helpers.js";

/** Check if two array's elements are equal. If equal function is not provided, will just use === */
export function arrayEquals<T>(a: T[], b: T[], equal?: (aEl: T, bEl: T) => boolean): boolean {
    if(a.length !== b.length) {
        return false;
    }
    for(let i = 0; i < a.length; i++) {
        if(equal) {
            if(!equal(a[i], b[i])) {
                return false;
            }
        } else {
            if(a[i] !== b[i]) {
                return false;
            }
        }
    }
    return true;
}

/** Useful for comparing positions in arrayEquals() */
export function positionComparator() {
    return (a: Position, b: Position) => { return posEquals(a, b); }
}

/** Returns a state where there are no pieces on any squares. */
export function emptyState(): ChessState {
    const board = constructBoard<Square>((pos: Position) => {
        return { 
            position: pos,
            piece: undefined
         };
    });

    return { board };
}

/** Useful for adding pieces to the state returned by emptyState(). */
export function setPiece(state: ChessState, pos: Position, piece: Piece) {
    itemAt(state.board, pos).piece = piece;
}

/** Check if two states are equal. */
export function stateEquals(state1: ChessState, state2: ChessState): boolean {
    let equal = true;
    posSequence().forEach(pos => {
        try {
            const stateSq = itemAt(state1.board, pos);
            const cloneSq = itemAt(state2.board, pos);
            if(
                stateSq.piece?.color !== cloneSq.piece?.color ||
                stateSq.piece?.name !== cloneSq.piece?.name ||
                stateSq.position[0] !== cloneSq.position[0] ||
                stateSq.position[1] !== cloneSq.position[1] ||
                stateSq.touched !== cloneSq.touched
            ) {
                equal = false;
            }
        } catch(e) {
            equal = false;
        }
    });
    return equal;
}