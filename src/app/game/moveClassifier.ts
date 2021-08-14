import { itemAt } from "../utils/helpers.js";
import { MoveEvent } from "../view/boardView.js";
import { ChessState, Piece } from "./models.js";

/** Note: a 'normal' move is one that could not be classified as castle or a PawnMoveType. */
export type MoveType = 'castle' |  PawnMoveType | 'normal';

export type PawnMoveType = 'pawnPromote' | 'pawnSingleForward' | 'pawnDoubleForward' | 'pawnNormalCapture' | 'pawnPassantCapture';

export function isPawnMoveType(moveType: MoveType): boolean {
    return [
        'pawnPromote', 
        'pawnSingleForward', 
        'pawnDoubleForward', 
        'pawnNormalCapture', 
        'pawnPassantCapture'
    ].includes(moveType);
}

/** 
 * Determine the type of attemptedMove. This has nothing to do with its legality. 
 * Assumes there is a piece at attemptedMove.startPos.
 * */
export function classifyMove(precedingMove: MoveEvent | undefined, currentState: ChessState, attemptedMove: MoveEvent): MoveType {
    //e.g. a move can be classified as 'castle' if the king attempts to move right two squares from start pos.
    const piece = itemAt(currentState.board, attemptedMove.startPos).piece!;
    if(piece.name === 'pawn') {
        if(isPawnSingleForward(piece, attemptedMove)) {
            return 'pawnSingleForward';
        } else if(isPawnDoubleForward(piece, attemptedMove)) {
            return 'pawnDoubleForward';
        } else if(isPawnNormalCapture(piece, attemptedMove)) {
            return 'pawnNormalCapture';
        }
    }
    return 'normal';
}

function isPawnSingleForward(pawn: Piece, attemptedMove: MoveEvent): boolean {
    //must be same col
    if(attemptedMove.startPos[1] !== attemptedMove.endPos[1]) {
        return false;
    }

    //must advance one square
    //TODO: may be able to create a 'moveDistance' function that takes a direction & calcs number of squares moved.
    if(pawn.color === 'white') {
        return attemptedMove.startPos[0] - 1 === attemptedMove.endPos[0];
    } else {
        return attemptedMove.startPos[0] + 1 === attemptedMove.endPos[0];
    }
}

function isPawnDoubleForward(pawn: Piece, attemptedMove: MoveEvent): boolean {
    //must be same col
    if(attemptedMove.startPos[1] !== attemptedMove.endPos[1]) {
        return false;
    }

    //must advance two squares
    if(pawn.color === 'white') {
        return attemptedMove.startPos[0] - 2 === attemptedMove.endPos[0];
    } else {
        return attemptedMove.startPos[0] + 2 === attemptedMove.endPos[0];
    }
}

function isPawnNormalCapture(pawn: Piece, attemptedMove: MoveEvent): boolean {
    return false;
}