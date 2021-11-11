//Handles attacking squares, etc by piece
import { addPositions, cloneSquare, cloneState, flat, flatten, itemAt, oppositeColor, posEquals, } from "../utils/helpers.js";
import { MoveEvent } from "../view/boardView.js";
import { sameRow } from "./attackVectors.js";
import { ChessState, Color, Piece, Position, Square } from "./models.js";
import { classifyMove, isPawnMoveType, PawnMoveType } from "./moveClassifier.js";
import { containsPiece, hasAttackers, inCheck, isBackRank, pieceAttacks } from "./stateQueries.js";

export type EditedSquares = Square[];

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
    } else if(isPawnMoveType(moveType) && !legalPawnMove(currentState, attemptedMove, piece, moveType)) {
        return false;
    }

    const edited = makeMove(undefined, currentState, attemptedMove);
    const checked = inCheck(currentState, piece.color);
    revertMove(currentState, edited);
    return !checked;
}

/** 
 * Expects legalMove to have passed the isLegal() checks.
 * Apply legalMove to prevState and return the changed squares so the edit can be reversed if necessary.
 * */
export function makeMove(precedingMove: MoveEvent | undefined, prevState: ChessState, legalMove: MoveEvent): EditedSquares {
    let modifiedSquares: Square[] = [];

    const kingColor = itemAt(prevState.board, legalMove.startPos).piece!.color;
    const moveType = classifyMove(precedingMove, prevState, legalMove);

    const startSquare = itemAt(prevState.board, legalMove.startPos);
    const endSquare = itemAt(prevState.board, legalMove.endPos);

    modifiedSquares.push(cloneSquare(startSquare));
    modifiedSquares.push(cloneSquare(endSquare));


    movePiece(startSquare, endSquare);

    if(endSquare.piece!.name === 5 && isBackRank(endSquare.piece!.color, endSquare.position)) {
        endSquare.piece!.name = 2;
        return modifiedSquares;
    }

    if(moveType === 'pawnPassantCapture') {
        const precedingEndSquare = itemAt(prevState.board, precedingMove!.endPos);
        modifiedSquares.push(cloneSquare(precedingEndSquare));
        precedingEndSquare.piece = undefined;
    } else if(moveType === 'castle') {
        const side = sideOfKing(kingStartPos(kingColor), legalMove.endPos);

        const rookSquare = itemAt(prevState.board, rookStartPos(kingColor, side));
        const newRookPos = side === 'right' ? addPositions(legalMove.endPos, [0, -1]) : addPositions(legalMove.endPos, [0, 1]);
        const besideKingSquare = itemAt(prevState.board, newRookPos);

        modifiedSquares.push(cloneSquare(rookSquare));
        modifiedSquares.push(cloneSquare(besideKingSquare));
        movePiece(rookSquare, besideKingSquare);
    }

    return modifiedSquares;
}

/**
 * Reverse makeMove().
 */
export function revertMove(currentState: ChessState, prevSquares: EditedSquares) {
    for(const prev of prevSquares) {
        const [i, j] = prev.position;
        currentState.board[i][j] = prev;
    }
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
    return pieceAttacks(piece, attemptedMove.startPos, attemptedMove.endPos, currentState);
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
    const kingSideSquares = sameRow(kingStart, currentState).filter(s => {
        if(side === 'left') {
            return rookStart[1] < s.position[1] && s.position[1] < kingStart[1];
        } else {
            return kingStart[1] < s.position[1] && s.position[1] < rookStart[1];
        }
    });

    for(let s of kingSideSquares) {
        if(s.piece) {
            return false;
        }
    }

    for(let s of kingSideSquares) {
        if(hasAttackers(s, oppositeColor(piece.color), currentState)) {
            return false;
        }
    }

    return true;
}

function legalPawnMove(currentState: ChessState, attemptedMove: MoveEvent, piece: Piece, moveType: PawnMoveType): boolean {
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
    const [row, col] = attemptedMove.startPos

    const firstPawnMove = (piece.color === 1 && row === 1) || (piece.color === 2 && row === 6);
    if(!firstPawnMove) {
        return false;
    }

    const oneForward: Position = piece.color === 1 ? [row + 1, col] : [row - 1, col];
    return !containsPiece(currentState, oneForward, attemptedMove.endPos);
}

function kingStartPos(kingColor: Color): Position  {
    return kingColor === 2 ? [7, 4] : [0, 4];
}

function rookStartPos(rookColor: Color, side: KingSide): Position {
    if(rookColor == 2) {
        return side === 'right' ? [7, 7] : [7, 0];
    } else {
        return side === 'right' ? [0, 7] : [0, 0];
    }
}

function sideOfKing(kingPos: Position, targetPos: Position): KingSide {
    return kingPos[1] < targetPos[1] ? 'right' : 'left';
}