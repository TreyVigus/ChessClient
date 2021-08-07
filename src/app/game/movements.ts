//Handles attacking squares, etc by piece
import { clone, flat, itemAt, oppositeColor } from "../utils/helpers.js";
import { MoveEvent } from "../view/boardView.js";
import { ChessState, Color, Piece, Position, Square } from "./models.js";
import { classifyMove } from "./moveClassifier.js";

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
    //If there is no piece at the startPos, the move is immediately illegal.
    const piece = itemAt(currentState.board, attemptedMove.startPos).piece;
    if(!piece) {
        return false;
    }

    const moveType = classifyMove(precedingMove, currentState, attemptedMove);

    return true;
}

/** 
 * Expects legalMove to have passed the isLegal() checks.
 * Return the state that would follow if legalMove occured on prevState. 
 * */
export function makeMove(precedingMove: MoveEvent | undefined, prevState: ChessState, legalMove: MoveEvent): ChessState {
    const copy = clone(prevState);
    const startSquare = itemAt(copy.board, legalMove.startPos);
    const endSquare = itemAt(copy.board, legalMove.endPos);

    const moveType = classifyMove(precedingMove, prevState, legalMove);
    if(moveType === 'other') {
        endSquare.piece = startSquare.piece; //piece will be defined since we've assumed a legalMove
        startSquare.piece = undefined;
        endSquare.touched = true;
        startSquare.touched = true;
    }

    return copy;
}

/** Is the king in check in the given state? */
function inCheck(state: ChessState, kingColor: Color): boolean {
    //king is in check if any piece of the opposite color attacks the king's square.
    const kingSquare = findKing(state, kingColor);
    return hasAttackers(kingSquare, oppositeColor(kingColor), state);
}

/** Return the Square of the king of the given color in the given state. */
function findKing(state: ChessState, color: Color): Square {
    throw 'unimplemented';
}

/** Return true if the given square has pieces of the given color attacking it. */
function hasAttackers(square: Square, attackingColor: Color, state: ChessState): boolean {
    return false;
}

/** Return a list of all squares attacked by the given piece. */
function attackedSquares(piece: Piece): Square[] {
    return [];
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