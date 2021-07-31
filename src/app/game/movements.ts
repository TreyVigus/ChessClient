//Handles attacking squares, etc by piece
import { clone, itemAt } from "../utils/helpers.js";
import { MoveEvent } from "../view/boardView.js";
import { ChessState, Piece, Square } from "./models.js";

//Typically, a piece can only move to the squares that it attacks.
//Special cases: 
//  King cannot move into check (need to know what squares the other pieces are attacking, including the enemy king)
//  A piece cannot move if it places the king into check (can combine with the above rule and just see if the resulting state would place the king in check.)
//  Castling (just check the touched property of the relevant Square objects)
//  Pawns:
//      can move forward unless blocked.
//      can move two squares forward on first move (determine based on touched property of Square)
//      en passant (need to know if the previous move was a pawn move. See lastMove parameter.)
//      queening (check forward movement for back rank)
export function isLegal(lastMove: MoveEvent | undefined, currentState: ChessState, attemptedMove: MoveEvent): boolean {
    const piece = itemAt(currentState.board, attemptedMove.startPos).piece;
    if(!piece) {
        return false;
    }
    return true;
}

export function makeMove(legalMove: MoveEvent, prevState: ChessState): ChessState {
    const copy = clone(prevState);
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