//Handles attacking squares, etc by piece
import { clone, itemAt } from "../utils/helpers.js";
import { MoveEvent } from "../view/boardView.js";
import { ChessState, Piece, Square } from "./models.js";

//TODO: don't forget to check if the prev square has a piece
export function isLegal(attemptedMove: MoveEvent, state: ChessState): boolean {
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