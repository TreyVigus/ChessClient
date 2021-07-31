//Handles attacking squares, etc by piece
import { clone, itemAt } from "../utils/helpers.js";
import { MoveEvent } from "../view/boardView.js";
import { ChessState, Piece, Square } from "./models.js";

export function isLegal(move: MoveEvent, state: ChessState): boolean {
    if(!itemAt(state.board, move.startPos).piece) {
        return false;
    }
    return true;
}

export function makeMove(legalMove: MoveEvent, oldState: ChessState): ChessState {
    const copy = clone(oldState);
    //pieceToMove will be defined since we've assumed a legalMove
    const pieceToMove = itemAt(copy.board, legalMove.startPos).piece!;
    itemAt(copy.board, legalMove.startPos).piece = undefined;
    itemAt(copy.board, legalMove.endPos).piece = pieceToMove;
    return copy;
}


/**
 * Return the squares currently attacked by the given piece.
 */
function attackedSquares(piece: Piece, state: ChessState): Square[] {
    throw 'not done';
}