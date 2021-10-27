import { itemAt, posEquals } from "../utils/helpers.js";
import { MoveEvent } from "../view/boardView.js";
import { adjacent, sameUnitDiagonals } from "./attackVectors.js";
import { ChessState, Piece } from "./models.js";

/** Note: a 'normal' move is one that could not be classified as castle or a PawnMoveType. */
export type MoveType = 'castle' |  PawnMoveType | 'normal';

export type PawnMoveType = 'pawnSingleForward' | 'pawnDoubleForward' | 'pawnNormalCapture' | 'pawnPassantCapture';

export function isPawnMoveType(moveType: MoveType): moveType is PawnMoveType {
    return [
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
        } else if(isPawnCapture(piece, attemptedMove, currentState)) {
            return classifyPawnCapture(piece, precedingMove, attemptedMove, currentState);
        }
    }

    if(isCastle(piece, attemptedMove)) {
        return 'castle';
    }
    
    return 'normal';
}

function isPawnSingleForward(pawn: Piece, {startPos, endPos}: MoveEvent): boolean {
    //must be same col
    if(startPos[1] !== endPos[1]) {
        return false;
    }

    //must advance one square
    if(pawn.color === 'white') {
        return startPos[0] - 1 === endPos[0];
    } else {
        return startPos[0] + 1 === endPos[0];
    }
}

function isPawnDoubleForward(pawn: Piece, {startPos, endPos}: MoveEvent): boolean {
    //must be same col
    if(startPos[1] !== endPos[1]) {
        return false;
    }

    //must advance two squares
    if(pawn.color === 'white') {
        return startPos[0] - 2 === endPos[0];
    } else {
        return startPos[0] + 2 === endPos[0];
    }
}

function isPawnCapture(pawn: Piece, {startPos, endPos}: MoveEvent, state: ChessState): boolean {
    const attacked = sameUnitDiagonals(startPos, state, pawn.color).map(s => s.position);
    return attacked.findIndex(s => posEquals(s, endPos)) > -1; //TODO: searching a position array like this is so common it may be abstractable.
}

function classifyPawnCapture(pawn: Piece, precedingMove: MoveEvent | undefined, attemptedMove: MoveEvent, state: ChessState): 'pawnNormalCapture' | 'pawnPassantCapture' {
    //if the preceding move wasn't a pawn move, attemptedMove must be a normal capture.
    if(!precedingMove || itemAt(state.board, precedingMove.endPos).piece?.name !== 'pawn') {
        return 'pawnNormalCapture';
    }

    //At this point we know the preceding move was a pawn move, which must have moved either 1 or 2 squares.
    //There are two pawns, the 'precedingPawn', corresponding to precedingMove, and the 'currentPawn', corresponding to attemptedMove.

    //if the preceding pawn move wasn't made from the pawn's starting position, we have a normal capture
    const precedingColor = itemAt(state.board, precedingMove.endPos).piece!.color;
    if((precedingColor === 'black' && precedingMove.startPos[0] !== 1) || (precedingColor === 'white' && precedingMove.startPos[0] !== 6)) {
        return 'pawnNormalCapture';
    }
    
    //If the preceding pawn moved one square forward, return 'pawnNormalCapture'.
    const precedingMoveDistance = Math.abs(precedingMove.startPos[1] - precedingMove.endPos[1]);
    if(precedingMoveDistance === 1) {
        return 'pawnNormalCapture';
    }

    //If current pawn attacks one square behind preceding pawn, return 'pawnPassantCapture'.
    const currPawnDirection = pawn.color === 'white' ? 'north' : 'south';
    //find the position that is one behind the preceding move's end position
    const behind = adjacent(precedingMove.endPos, currPawnDirection)!; //assumes previous pawn is opposite color as current pawn

    if(posEquals(attemptedMove.endPos, behind)) {
        return 'pawnPassantCapture';
    }

    return 'pawnNormalCapture';
} 

/** If the king stayed in the same row and tried to move two squares left or right, the move is an attemped castle. */
function isCastle(piece: Piece, {startPos, endPos}: MoveEvent): boolean {
    return piece.name === 'king' && endPos[0] === startPos[0] && Math.abs(startPos[1] - endPos[1]) === 2;
}