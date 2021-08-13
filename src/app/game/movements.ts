//Handles attacking squares, etc by piece
import { clone, flat, itemAt, oppositeColor, posEquals, validPosition } from "../utils/helpers.js";
import { BOARD_SIZE, MoveEvent } from "../view/boardView.js";
import { ChessState, Color, Piece, Position, Square } from "./models.js";
import { classifyMove, isPawnMoveType, PawnMoveType } from "./moveClassifier.js";
import { attackedSquares, containsPiece, inCheck } from "./stateQueries.js";

//Typically, a piece can only move to the squares that it attacks.
//Special cases: 
//  King cannot move into check (need to know what squares the other pieces are attacking, including the enemy king)
//  A piece cannot move if it places the king into check (can combine with the above rule and just see if the resulting state would place the king in check.)
//  Castling (just check the touched property of the relevant Square objects) (cannot move through check)
//  Pawns:
//      can move forward unless blocked.
//      can move two squares forward on first move (determine based on touched property of Square)
//      en passant (need to know if the previous move was a pawn move. See lastMove parameter.)
//      queening (check forward movement for back rank)
export function isLegal(precedingMove: MoveEvent | undefined, currentState: ChessState, attemptedMove: MoveEvent): boolean {
    const piece = itemAt(currentState.board, attemptedMove.startPos).piece;

    //If there is no piece at the startPos, the move is immediately illegal.
    if(!piece) {
        return false;
    }

    if(targetsOwnPiece(currentState, attemptedMove, piece)) {
        return false;
    }

    if(targetsKing(currentState, attemptedMove)) {
        return false;
    }

    const moveType = classifyMove(precedingMove, currentState, attemptedMove);

    if(piece.name === 'pawn' && !isPawnMoveType(moveType)) {
        return false;
    }

    if(moveType === 'normal') {
        return isLegalNormalMove(currentState, attemptedMove, piece);
    } else if(moveType === 'castle') {
        return isLegalCastle(currentState, attemptedMove, piece);
    } else {
        return isLegalPawnMove(precedingMove, currentState, attemptedMove, piece, moveType);
    }
}

/** 
 * Expects legalMove to have passed the isLegal() checks.
 * Return the state that would follow if legalMove occured on prevState.
 * TODO: handle other moveTypes 
 * */
export function makeMove(precedingMove: MoveEvent | undefined, prevState: ChessState, legalMove: MoveEvent): ChessState {
    const copy = clone(prevState);
    const moveType = classifyMove(precedingMove, prevState, legalMove);

    //Move the piece at startSquare to endSquare. If there is a piece already at endSquare, remove it.
    if(moveType === 'normal' || moveType === 'pawnNormalCapture' || moveType === 'pawnSingleForward' || moveType === 'pawnDoubleForward') {
        const startSquare = itemAt(copy.board, legalMove.startPos);
        const endSquare = itemAt(copy.board, legalMove.endPos);
        endSquare.piece = startSquare.piece; //piece will be defined since we've assumed a legalMove
        startSquare.piece = undefined;
        endSquare.touched = true;
        startSquare.touched = true;
    } else {
        throw 'no move performed';
    }

    return copy;
}

function targetsOwnPiece(currentState: ChessState, attemptedMove: MoveEvent, piece: Piece): boolean {
    const playerColor = piece.color;
    const targetPiece = itemAt(currentState.board, attemptedMove.endPos).piece;
    if(!targetPiece) {
        return false;
    }
    return targetPiece.color === playerColor;
}

function targetsKing(currentState: ChessState, attemptedMove: MoveEvent): boolean {
    const targetPiece = itemAt(currentState.board, attemptedMove.endPos).piece;
    if(!targetPiece) {
        return false;
    }
    return targetPiece.name === 'king';
}

/** Assumes attemptedMove is of type 'normal'. */
function isLegalNormalMove(currentState: ChessState, attemptedMove: MoveEvent, piece: Piece): boolean {
    const targetSquare = itemAt(currentState.board, attemptedMove.endPos);
    //does the piece attack the target square?
    const legalTarget = attackedSquares(piece, attemptedMove.startPos, currentState).findIndex(square => posEquals(square.position, targetSquare.position)) > -1;
    if(!legalTarget) {
        return false;
    }
    const futureState = makeMove(undefined, currentState, attemptedMove);
    if(inCheck(futureState, piece.color)) {
        return false;
    }
    return true;
}

/** Assumes attemptedMove is of type 'castle'. */
function isLegalCastle(currentState: ChessState, attemptedMove: MoveEvent, piece: Piece): boolean {
    return false;
}

function isLegalPawnMove(precedingMove: MoveEvent | undefined, currentState: ChessState, attemptedMove: MoveEvent, piece: Piece, moveType: PawnMoveType): boolean {
    if(moveType === 'pawnSingleForward') {
        return !containsPiece(currentState, attemptedMove.endPos);
    } else if(moveType === 'pawnDoubleForward') {
        const oneForward: Position = piece.color === 'black' ? [attemptedMove.startPos[0] + 1, attemptedMove.startPos[1]] : 
                                                               [attemptedMove.startPos[0] - 1, attemptedMove.startPos[1]];
        return !containsPiece(currentState, oneForward, attemptedMove.endPos);
    } else if(moveType === 'pawnNormalCapture') {
        return isLegalNormalMove(currentState, attemptedMove, piece);
    } else if(moveType === 'pawnPassantCapture') {
        return false;
    } else if(moveType === 'pawnPromote') {
        return false;
    }

    return false;
}