//Handles attacking squares, etc by piece

import { ChessState, Move, Piece, Square } from "./models";

export function isLegal(attemptedMove: Move, state: ChessState): boolean {
    return false;
}

export function makeMove(legalMove: Move, oldState: ChessState): ChessState {
    throw 'not done'
}



/**
 * Return the squares currently attacked by the given piece.
 */
function attackedSquares(piece: Piece, state: ChessState): Square[] {
    throw 'not done';
}