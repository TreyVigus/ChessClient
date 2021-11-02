import { allLegalMoves } from "../ai/moveGenerator.js";
import { addPositions, itemAt, oppositeColor, posEquals, validPosition } from "../utils/helpers.js";
import { BOARD_SIZE, MoveEvent } from "../view/boardView.js";
import { filterBlockedSquares, sameColumn, sameNegativeDiagonal, samePositiveDiagonal, sameRow, sameUnitDiagonals } from "./attackVectors.js";
import { ChessState, Color, Piece, Position, Square } from "./models.js";

/** 
 * Return a list of all squares attacked by the given piece. 
 * Note: this is slow and pieceAttacks() should be preferred.
 * */

export function attackedPositions(piece: Piece, piecePos: Position, state: ChessState): Position[] {
    if(piece.name === 6) {
        return rookAttackedSquares(piecePos, state)
    } else if(piece.name === 3) {
        return bishopAttackedSquares(piecePos, state);
    } else if(piece.name === 2) {
        return rookAttackedSquares(piecePos, state).concat(bishopAttackedSquares(piecePos, state));
    } else if(piece.name === 5) {
        return pawnAttackedSquares(piecePos, state, piece);
    } else if(piece.name === 1) {
        return kingAttackedSquares(piecePos, state);
    } else if(piece.name === 4) {
        return knightAttackedSquares(piecePos, state);
    }
    return [];
}

export function pieceAttacks(piece: Piece, piecePos: Position, targetPos: Position, state: ChessState): boolean {
    if(piece.name === 6) {
        return rookAttacks(piecePos, targetPos, state);
    } else if(piece.name === 3) {
        return bishopAttacks(piecePos, targetPos, state); 
    } else if(piece.name === 2) {
        return rookAttacks(piecePos, targetPos, state) || bishopAttacks(piecePos, targetPos, state);
    }
    return attackedPositions(piece, piecePos, state).findIndex(pos => posEquals(pos, targetPos)) > -1;
}

/** Return true if the given square has pieces of the given color attacking it. */
export function hasAttackers(targetSquare: Square, attackingColor: Color, state: ChessState): boolean {
    for(let i = 0; i < BOARD_SIZE; i++) {
        for(let j = 0; j < BOARD_SIZE; j++) {
            const pos: Position = [i, j];
            const s = itemAt(state.board, pos);
            if(s.piece && s.piece.color === attackingColor) {
                const attacks = pieceAttacks(s.piece, pos, targetSquare.position, state);
                if(attacks) {
                    return true;
                }
            }
        }
    }

    return false;
}

/** Return the Square of the king of the given color in the given state. */
export function findKing(state: ChessState, color: Color): Square {
    //TODO: make a 'fast-search' helper to handle searching a board in this style
    for(let i = 0; i < BOARD_SIZE; i++) {
        for(let j = 0; j < BOARD_SIZE; j++) {
            const pos: Position = [i, j];
            const s = itemAt(state.board, pos);
            if(s.piece && s.piece.name === 1 && s.piece.color === color) {
                return s;
            }
        }
    }

    //unreachable
    return null as unknown as Square;
}

/** Is the king in check in the given state? */
export function inCheck(state: ChessState, kingColor: Color): boolean {
    //king is in check if any piece of the opposite color attacks the king's square.
    return hasAttackers(findKing(state, kingColor), oppositeColor(kingColor), state);
}

/** Is the king in checkmate in the given state? */
export function inCheckMate(precedingMove: MoveEvent | undefined, state: ChessState, kingColor: Color): boolean {
    return inCheck(state, kingColor) && allLegalMoves(precedingMove, state, kingColor).length === 0;
}

/** Is the king in stalemate in the given state? */
export function inStaleMate(precedingMove: MoveEvent | undefined, state: ChessState, kingColor: Color): boolean {
    return !inCheck(state, kingColor) && allLegalMoves(precedingMove, state, kingColor).length === 0;
}

/** Do the given positions contain a piece in the given state? */
export function containsPiece(state: ChessState, ...positions: Position[]): boolean {
    return positions.findIndex(pos => !!itemAt(state.board, pos).piece) > -1;
}

/** Is the given position located on the opposite color's back rank? */
export function isBackRank(pawnColor: Color, pos: Position): boolean {
    return pawnColor === 'white' && pos[0] === 0 || pawnColor === 'black' && pos[0] === BOARD_SIZE - 1;
}

export function rookAttackedSquares(rookPos: Position, state: ChessState): Position[] {  
    const row = sameRow(rookPos, state);
    const col = sameColumn(rookPos, state);
    return filterBlockedSquares(rookPos, row).concat(filterBlockedSquares(rookPos, col)).map(s => s.position);
}

function rookAttacks(rookPos: Position, targetPos: Position, state: ChessState): boolean {
    if(rookPos[0] === targetPos[0]) {
        const row = sameRow(rookPos, state);
        return filterBlockedSquares(rookPos, row).findIndex(s => posEquals(s.position, targetPos)) > -1;
    }
    
    if(rookPos[1] === targetPos[1]) {
        const col = sameColumn(rookPos, state);
        return filterBlockedSquares(rookPos, col).findIndex(s => posEquals(s.position, targetPos)) > -1;
    }

    return false;
}

function bishopAttacks(bishopPos: Position, targetPos: Position, state: ChessState): boolean {
    if((bishopPos[0] + bishopPos[1]) === (targetPos[0] + targetPos[1])) {
        const posDiag = samePositiveDiagonal(bishopPos, state);
        return filterBlockedSquares(bishopPos, posDiag).findIndex(s => posEquals(s.position, targetPos)) > -1;
    }
    
    if((bishopPos[0] - bishopPos[1]) === (targetPos[0] - targetPos[1])) {
        const negDiag = sameNegativeDiagonal(bishopPos, state);
        return filterBlockedSquares(bishopPos, negDiag).findIndex(s => posEquals(s.position, targetPos)) > -1;
    }

    return false;
}

export function bishopAttackedSquares(bishopPos: Position, state: ChessState): Position[] {
    const posDiag = samePositiveDiagonal(bishopPos, state);
    const negDiag = sameNegativeDiagonal(bishopPos, state);
    return filterBlockedSquares(bishopPos, posDiag).concat(filterBlockedSquares(bishopPos, negDiag)).map(s => s.position);
}

export function pawnAttackedSquares(pawnPos: Position, state: ChessState, pawn: Piece): Position[] {
    return sameUnitDiagonals(pawnPos, state, pawn.color).map(s => s.position);
}

export function kingAttackedSquares(kingPos: Position, state: ChessState): Position[] {
    const vectors: Position[] =  [[-1, -1],[-1, 0],[-1, 1],[0, 1],[1, 1],[1, 0],[1, -1],[0, -1]];
    return relativeAttackedSquares(kingPos, vectors, state);
}

export function knightAttackedSquares(knightPos: Position, state: ChessState): Position[] {  
    const vectors: Position[] =  [[-2, -1],[-2, 1],[2, -1],[2, 1],[1, 2],[1, -2],[-1, 2],[-1, -2]];
    return relativeAttackedSquares(knightPos, vectors, state);
}

function relativeAttackedSquares(piecePos: Position, vectors: Position[], state: ChessState): Position[] {
    return vectors.map(pos => addPositions(pos, piecePos))
                  .filter(pos => validPosition(pos))
}