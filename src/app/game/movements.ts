//Handles attacking squares, etc by piece
import { clone, flat, itemAt, oppositeColor, posEquals, validPosition } from "../utils/helpers.js";
import { BOARD_SIZE, MoveEvent } from "../view/boardView.js";
import { ChessState, Color, Piece, Position, Square } from "./models.js";
import { classifyMove, PawnMoveType } from "./moveClassifier.js";

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

    if(capturesOwnPiece(currentState, attemptedMove, piece)) {
        return false;
    }

    const moveType = classifyMove(precedingMove, currentState, attemptedMove);
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
    if(moveType === 'normal' || moveType === 'pawnNormalCapture') {
        const startSquare = itemAt(copy.board, legalMove.startPos);
        const endSquare = itemAt(copy.board, legalMove.endPos);
        endSquare.piece = startSquare.piece; //piece will be defined since we've assumed a legalMove
        startSquare.piece = undefined;
        endSquare.touched = true;
        startSquare.touched = true;
    }

    return copy;
}




/** Player cannot capture their own piece.  */
function capturesOwnPiece(currentState: ChessState, attemptedMove: MoveEvent, piece: Piece): boolean {
    const playerColor = piece.color;
    const targetPiece = itemAt(currentState.board, attemptedMove.endPos).piece;
    if(!targetPiece) {
        return false;
    }
    return targetPiece.color === playerColor;
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

//TODO: implement attackedSquares before doing this to determine appropriate abstractions.
function isLegalPawnMove(precedingMove: MoveEvent | undefined, currentState: ChessState, attemptedMove: MoveEvent, piece: Piece, moveType: PawnMoveType): boolean {
    const targetSquare = itemAt(currentState.board, attemptedMove.endPos);
    if(moveType === 'pawnSingleForward') {
        return false
    } else if(moveType === 'pawnDoubleForward') {
        return false;
    } else if(moveType === 'pawnNormalCapture') {
        return isLegalNormalMove(currentState, attemptedMove, piece);
    } else if(moveType === 'pawnPassantCapture') {
        return false;
    } else if(moveType === 'pawnPromote') {
        return false;
    }

    return false;
}

/** Is the king in check in the given state? */
function inCheck(state: ChessState, kingColor: Color): boolean {
    //king is in check if any piece of the opposite color attacks the king's square.
    const kingSquare = findKing(state, kingColor);
    return hasAttackers(kingSquare, oppositeColor(kingColor), state);
}

/** Return the Square of the king of the given color in the given state. */
function findKing(state: ChessState, color: Color): Square {
    return [...flat(state.board)].map(sq => sq.value).filter(s => s.piece).find(s => s.piece!.name === 'king' && s.piece!.color === color)!;
}

/** Return true if the given square has pieces of the given color attacking it. */
function hasAttackers(targetSquare: Square, attackingColor: Color, state: ChessState): boolean {
    for(const sq of flat(state.board)) {
        const piece = sq.value.piece;
        if(piece && piece.color === attackingColor) {
            const attacked = attackedSquares(piece, sq.index, state);
            const attacksTarget = attacked.findIndex(a => posEquals(a.position, targetSquare.position)) > -1;
            if(attacksTarget) {
                return true;
            }
        }
    }

    return false;
}

/** Return a list of all squares attacked by the given piece. */
function attackedSquares(piece: Piece, piecePos: Position, state: ChessState): Square[] {
    //This should include pawn & king as well.
    if(piece.name === 'rook') {
        return rookAttackedSquares(piecePos, state)
    } else if(piece.name === 'bishop') {
        return bishopAttackedSquares(piecePos, state);
    } else if(piece.name === 'queen') {
        return rookAttackedSquares(piecePos, state).concat(bishopAttackedSquares(piecePos, state));
    } else if(piece.name === 'pawn') {
        return pawnAttackedSquares(piecePos, state, piece);
    } else if(piece.name === 'king') {
        return kingAttackedSquares(piecePos, state, piece);
    }
    return [];
}

function rookAttackedSquares(rookPos: Position, state: ChessState): Square[] {  
    const row = sameRow(rookPos, state);
    const col = sameColumn(rookPos, state);
    return filterBlockedSquares(rookPos, row).concat(filterBlockedSquares(rookPos, col));
}

function bishopAttackedSquares(bishopPos: Position, state: ChessState): Square[] {
    const posDiag = samePositiveDiagonal(bishopPos, state);
    const negDiag = sameNegativeDiagonal(bishopPos, state);
    return filterBlockedSquares(bishopPos, posDiag).concat(filterBlockedSquares(bishopPos, negDiag));
}

function pawnAttackedSquares(pawnPos: Position, state: ChessState, pawn: Piece): Square[] {
    //a pawn on the back rank attacks no squares. TODO: will this condition ever be met since the pawn will become queen anyway.
    if( (pawn.color === 'white' && pawnPos[0] === 0) || (pawn.color === 'black' && pawnPos[0] === BOARD_SIZE - 1) ) {
        return [];
    }

    if(pawn.color === 'white') {
        const northWest: Position = [pawnPos[0] - 1, pawnPos[1] - 1];
        const northEast: Position = [pawnPos[0] - 1, pawnPos[1] + 1];
        return [itemAt(state.board, northWest), itemAt(state.board, northEast)];
    } else {
        const southWest: Position = [pawnPos[0] + 1, pawnPos[1] - 1];
        const southEast: Position = [pawnPos[0] + 1, pawnPos[1] + 1];
        return [itemAt(state.board, southWest), itemAt(state.board, southEast)];
    }
}

function kingAttackedSquares(kingPos: Position, state: ChessState, king: Piece): Square[] {
    const adjacent: Position[] = [
        [kingPos[0] - 1, kingPos[1] - 1], //northwest
        [kingPos[0] - 1, kingPos[1]], //north
        [kingPos[0] - 1, kingPos[1] + 1], //northEast
        [kingPos[0], kingPos[1] + 1], //east
        [kingPos[0] + 1, kingPos[1] + 1], //sourthEast
        [kingPos[0] + 1, kingPos[1]], //south
        [kingPos[0] + 1, kingPos[1] - 1] //southWest
    ];

    return adjacent.filter(pos => validPosition(pos)).map(pos => itemAt(state.board, pos));
}

/** Return all squares in the same row as piecePos. */
//TODO: remove export once parent function has testing.
export function sameRow(piecePos: Position, state: ChessState): Square[] {
    return state.board[piecePos[0]];
}

/** Return all squares in the same col as piecePos. */
//TODO: remove export once parent function has testing.
export function sameColumn(piecePos: Position, state: ChessState): Square[] {
    let col: Square[] = [];
    for(const item of flat(state.board)) {
        if(item.index[1] === piecePos[1]) {
            col.push(item.value);
        }
    }
    return col;
}

//TODO: remove export once parent function has testing.
export function samePositiveDiagonal(piecePos: Position, state: ChessState): Square[] {
    //a positive diagonal consists of all squares with the same sum of coordinates.
    const diagSum = piecePos[0] + piecePos[1];
    return [...flat(state.board)].map(sq => sq.value).filter(s => (s.position[0] + s.position[1]) === diagSum);
}

//TODO: remove export once parent function has testing.
export function sameNegativeDiagonal(piecePos: Position, state: ChessState): Square[] {
    //a positive diagonal consists of all squares with the same difference of coordinates.
    const diagDiff = piecePos[0] - piecePos[1];
    return [...flat(state.board)].map(sq => sq.value).filter(s => (s.position[0] - s.position[1]) === diagDiff);
}

/** 
 * Assume squares is either the row, col, or diagonal containing piecePos.
 * Assume the piece at piecePos would attack all given squares if all squares were empty (no pieces present)
 * Define leftBlocker as the first piece's pos to the left of piecePos in squares or 0 if none exists
 * Define rightBlocker as the first piece's pos to the right of piecePos in squares or squares.length - 1 if none exists.
 * Return squares[leftBlocker...rightBlocker].
 */
//TODO: remove export once parent function has testing.
export function filterBlockedSquares(piecePos: Position, squares: Square[]): Square[] {
    const piecePosIndex = squares.findIndex(s => posEquals(s.position, piecePos));
    if(piecePosIndex === -1) {
        throw 'piecePos was not found in squares array.'
    }

    let leftBlocker = 0;
    for(let i = piecePosIndex - 1; i > -1; i--) {
        if(squares[i].piece) {
            leftBlocker = i;
            break;
        }
    }

    let rightBlocker = squares.length - 1;
    for(let i = piecePosIndex + 1; i < squares.length; i++) {
        if(squares[i].piece) {
            rightBlocker = i;
            break;
        }
    }

    return squares.slice(leftBlocker, rightBlocker + 1);
}