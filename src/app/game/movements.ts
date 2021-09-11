//Handles attacking squares, etc by piece
import { addPositions, clone, itemAt, oppositeColor, posEquals, } from "../utils/helpers.js";
import { MoveEvent } from "../view/boardView.js";
import { sameRow } from "./attackVectors.js";
import { ChessState, Color, Piece, Position, Square } from "./models.js";
import { classifyMove, isPawnMoveType, PawnMoveType } from "./moveClassifier.js";
import { attackedSquares, containsPiece, hasAttackers, inCheck, isBackRank } from "./stateQueries.js";

export type KingSide = 'left' | 'right';

export function isLegal(precedingMove: MoveEvent | undefined, currentState: ChessState, attemptedMove: MoveEvent): boolean {
    const piece = itemAt(currentState.board, attemptedMove.startPos).piece;

    if(!piece || targetsOwnPiece(currentState, attemptedMove, piece)) {
        return false;
    }

    const moveType = classifyMove(precedingMove, currentState, attemptedMove);
    if(moveType === 'normal' && !legalNormalMove(currentState, attemptedMove, piece)) {
        return false;
    } else if(moveType === 'castle' && !legalCastle(currentState, attemptedMove, piece)) {
        return false;
    } else if(isPawnMoveType(moveType) && !legalPawnMove(precedingMove, currentState, attemptedMove, piece, moveType)) {
        return false;
    }

    const futureState = makeMove(undefined, currentState, attemptedMove);
    if(inCheck(futureState, piece.color)) {
        return false;
    }

    return true;
}

/** 
 * Expects legalMove to have passed the isLegal() checks.
 * Return the state that would follow if legalMove occured on prevState.
 * */
export function makeMove(precedingMove: MoveEvent | undefined, prevState: ChessState, legalMove: MoveEvent): ChessState {
    const copy = clone(prevState);
    const moveType = classifyMove(precedingMove, prevState, legalMove);

    const startSquare = itemAt(copy.board, legalMove.startPos);
    const endSquare = itemAt(copy.board, legalMove.endPos);

    movePiece(startSquare, endSquare);

    if(endSquare.piece!.name === 'pawn' && isBackRank(endSquare.piece!.color, endSquare.position)) {
        endSquare.piece!.name = 'queen';
        return copy;
    }

    if(moveType === 'pawnPassantCapture') {
        itemAt(copy.board, precedingMove!.endPos).piece = undefined;
    } else if(moveType === 'castle') {
        const kingColor = itemAt(prevState.board, legalMove.startPos).piece!.color;
        const side = sideOfKing(kingStartPos(kingColor), legalMove.endPos);

        const rookSquare = itemAt(copy.board, rookStartPos(kingColor, side));
        const newRookPos = side === 'right' ? addPositions(legalMove.endPos, [0, -1]) : addPositions(legalMove.endPos, [0, 1]);
        const besideKingSquare = itemAt(copy.board, newRookPos);

        movePiece(rookSquare, besideKingSquare);
    }

    return copy;
}

/** 
 * Move the piece at startSquare to endSquare. 
 * If there is a piece already at endSquare, remove it. 
 * */
function movePiece(startSquare: Square, endSquare: Square) {
    endSquare.piece = startSquare.piece;
    startSquare.piece = undefined;
    endSquare.touched = true;
    startSquare.touched = true;
}

function targetsOwnPiece(currentState: ChessState, attemptedMove: MoveEvent, piece: Piece): boolean {
    const playerColor = piece.color;
    const targetPiece = itemAt(currentState.board, attemptedMove.endPos).piece;
    if(!targetPiece) {
        return false;
    }
    return targetPiece.color === playerColor;
}

/** Assumes attemptedMove is of type 'normal'. */
function legalNormalMove(currentState: ChessState, attemptedMove: MoveEvent, piece: Piece): boolean {
    const targetSquare = itemAt(currentState.board, attemptedMove.endPos);
    //does the piece attack the target square?
    const legalTarget = attackedSquares(piece, attemptedMove.startPos, currentState).find(square => posEquals(square.position, targetSquare.position));
    if(!legalTarget) {
        return false;
    }
    return true;
}

function legalCastle(currentState: ChessState, attemptedMove: MoveEvent, piece: Piece): boolean {
    if(inCheck(currentState, piece.color)) {
        return false;
    }

    const kingStart = kingStartPos(piece.color);
    const side = sideOfKing(kingStart, attemptedMove.endPos);
    const rookStart = rookStartPos(piece.color, side);

    if(itemAt(currentState.board, kingStart).touched || itemAt(currentState.board, rookStart).touched) {
        return false;
    }

    //cannot castle if there are pieces between king and rook or pieces attacking squares between king and rook
    return sameRow(kingStart, currentState).filter(s => {
        if(side === 'left') {
            return rookStart[1] < s.position[1] && s.position[1] < kingStart[1];
        } else {
            return kingStart[1] < s.position[1] && s.position[1] < rookStart[1];
        }
    }).every(s => {
        return !s.piece && !hasAttackers(s, oppositeColor(piece.color), currentState);
    });
}

function legalPawnMove(precedingMove: MoveEvent | undefined, currentState: ChessState, attemptedMove: MoveEvent, piece: Piece, moveType: PawnMoveType): boolean {
    if(moveType === 'pawnSingleForward') {
        return !containsPiece(currentState, attemptedMove.endPos);
    } else if(moveType === 'pawnDoubleForward') {
        return legalDoubleForward(currentState, attemptedMove, piece);
    } else if(moveType === 'pawnNormalCapture') {
        return containsPiece(currentState, attemptedMove.endPos) && legalNormalMove(currentState, attemptedMove, piece);
    } else if(moveType === 'pawnPassantCapture') {
        //an illegal pawn move will always be of type 'pawnNormalCapture'
        return true;
    } else if(moveType === 'pawnPromote') {
        return !containsPiece(currentState, attemptedMove.endPos);
    }

    return false;
}

function legalDoubleForward(currentState: ChessState, attemptedMove: MoveEvent, piece: Piece): boolean {
    const row = attemptedMove.startPos[0];
    const col = attemptedMove.startPos[1];

    const firstPawnMove = (piece.color === 'black' && row === 1) || (piece.color === 'white' && row === 6);
    if(!firstPawnMove) {
        return false;
    }

    const oneForward: Position = piece.color === 'black' ? [row + 1, col] : [row - 1, col];
    return !containsPiece(currentState, oneForward, attemptedMove.endPos);
}

function kingStartPos(kingColor: Color): Position  {
    return kingColor === 'white' ? [7, 4] : [0, 4];
}

function rookStartPos(rookColor: Color, side: KingSide): Position {
    if(rookColor == 'white') {
        return side === 'right' ? [7, 7] : [7, 0];
    } else {
        return side === 'right' ? [0, 7] : [0, 0];
    }
}

function sideOfKing(kingPos: Position, targetPos: Position): KingSide {
    return kingPos[1] < targetPos[1] ? 'right' : 'left';
}