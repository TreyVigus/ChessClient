//Handles attacking squares, etc by piece
import { clone, flat, itemAt } from "../utils/helpers.js";
import { MoveEvent } from "../view/boardView.js";
import { ChessState, Piece, Position, Square } from "./models.js";

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

    if(selfInCheck(piece, currentState, attemptedMove)) {
        return false;
    }

    if(!canPieceMove(piece, lastMove, currentState, attemptedMove)) {
        return false;
    }

    return true;
}

export function makeMove(legalMove: MoveEvent, prevState: ChessState): ChessState {
    const copy = clone(prevState);
    const startSquare = itemAt(copy.board, legalMove.startPos);
    const endSquare = itemAt(copy.board, legalMove.endPos);

    endSquare.touched = true;
    endSquare.piece = startSquare.piece; //piece will be defined since we've assumed a legalMove
    startSquare.touched = true;
    startSquare.piece = undefined;

    return copy;
}

/** Check if the move would put the player's own king in check. */
function selfInCheck(piece: Piece, currentState: ChessState, attemptedMove: MoveEvent): boolean {
    const playerColor = piece.color; //TODO: this just assumes the player's color is the same as the last moved piece.
    return false;
}

function canPieceMove(piece: Piece, lastMove: MoveEvent | undefined, currentState: ChessState, attemptedMove: MoveEvent): boolean {
    if(piece.name === 'rook') {
        return canRookMove(currentState, attemptedMove);
    } else if(piece.name === 'bishop') {
        return canBishopMove(currentState, attemptedMove);
    } else if(piece.name === 'pawn') {
        return canPawnMove(lastMove, currentState, attemptedMove);
    } else if(piece.name === 'queen') {
        return canQueenMove(currentState, attemptedMove);
    } else if(piece.name === 'knight') {
        return canKnightMove(currentState, attemptedMove);
    } else {
        return canKingMove(currentState, attemptedMove);
    }
}

//TODO: should account for blockers.
function canRookMove(currentState: ChessState, attemptedMove: MoveEvent): boolean {
    return false;
}

function canBishopMove(currentState: ChessState, attemptedMove: MoveEvent): boolean {
    return false;
}

function canPawnMove(lastMove: MoveEvent | undefined, currentState: ChessState, attemptedMove: MoveEvent): boolean {
    return false;
}

function canQueenMove(currentState: ChessState, attemptedMove: MoveEvent): boolean {
    return false;
}

function canKingMove(currentState: ChessState, attemptedMove: MoveEvent): boolean {
    return false;
}

function canKnightMove(currentState: ChessState, attemptedMove: MoveEvent): boolean {
    return false;
}

/** Return all squares in the same row as piecePos. */
function sameRow(piecePos: Position, state: ChessState): Square[] {
    return state.board[piecePos[0]];
}

/** Return all squares in the same col as piecePos. */
function sameColumn(piecePos: Position, state: ChessState): Square[] {
    let col: Square[] = [];
    for(const item of flat(state.board)) {
        if(item.index[1] === piecePos[1]) {
            col.push(item.value);
        }
    }
    return col;
}

function samePositiveDiagonal(piecePos: Position, state: ChessState): Square[] {
    return [];
}

function sameNegativeDiagonal(piecePos: Position, state: ChessState): Square[] {
    return [];
}