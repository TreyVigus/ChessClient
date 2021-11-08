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
        return pawnAttackedSquares(piecePos, state, piece.color);
    } else if(piece.name === 1) {
        return kingAttackedSquares(piecePos);
    } else {
        return knightAttackedSquares(piecePos);
    }
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
    const row = targetSquare.position[0];
    const col = targetSquare.position[1];


    //TODO: DRY these up
    
    //north east
    for(let iterator = [row - 1, col + 1] as Position; validPosition(iterator); iterator = addPositions(iterator, [-1, 1])) {
        const s = itemAt(state.board, iterator);
        if(s.piece) {
            if(s.piece.color === attackingColor && (s.piece.name === 3 || s.piece.name === 2)) {
                return true;
            } else {
                break;
            }
        }
    }

    //south east
    for(let iterator = [row + 1, col + 1] as Position; validPosition(iterator); iterator = addPositions(iterator, [1, 1])) {
        const s = itemAt(state.board, iterator);
        if(s.piece) {
            if(s.piece.color === attackingColor && (s.piece.name === 3 || s.piece.name === 2)) {
                return true;
            } else {
                break;
            }
        }
    }

    //south west
    for(let iterator = [row + 1, col - 1] as Position; validPosition(iterator); iterator = addPositions(iterator, [1, -1])) {
        const s = itemAt(state.board, iterator);
        if(s.piece) {
            if(s.piece.color === attackingColor && (s.piece.name === 3 || s.piece.name === 2)) {
                return true;
            } else {
                break;
            }
        }
    }

    //north west
    for(let iterator = [row - 1, col - 1] as Position; validPosition(iterator); iterator = addPositions(iterator, [-1, -1])) {
        const s = itemAt(state.board, iterator);
        if(s.piece) {
            if(s.piece.color === attackingColor && (s.piece.name === 3 || s.piece.name === 2)) {
                return true;
            } else {
                break;
            }
        }
    }
    
    //ROOK/QUEEN
    for(let j = col - 1; j >= 0; j--) {
        const pos: Position = [row, j];
        const s = itemAt(state.board, pos);
        if(s.piece) {
            if(s.piece.color === attackingColor && (s.piece.name === 6 || s.piece.name === 2)) {
                return true;
            } else {
                break;
            }
        }
    }

    for(let j = col + 1; j < BOARD_SIZE; j++) {
        const pos: Position = [row, j];
        const s = itemAt(state.board, pos);
        if(s.piece) {
            if(s.piece.color === attackingColor && (s.piece.name === 6 || s.piece.name === 2)) {
                return true;
            } else {
                break;
            }
        }
    }

    for(let i = row - 1; i >= 0; i--) {
        const pos: Position = [i, col];
        const s = itemAt(state.board, pos);
        if(s.piece) {
            if(s.piece.color === attackingColor && (s.piece.name === 6 || s.piece.name === 2)) {
                return true;
            } else {
                break;
            }
        }
    }

    for(let i = row + 1; i < BOARD_SIZE; i++) {
        const pos: Position = [i, col];
        const s = itemAt(state.board, pos);
        if(s.piece) {
            if(s.piece.color === attackingColor && (s.piece.name === 6 || s.piece.name === 2)) {
                return true;
            } else {
                break;
            }
        }
    }

    const knight = knightAttackedSquares(targetSquare.position);
    if(hasPiece(knight, [4], attackingColor, state)) {
        return true;
    }

    const pawn = pawnAttackedSquares(targetSquare.position, state, oppositeColor(attackingColor));
    if(hasPiece(pawn, [5], attackingColor, state)) {
        return true;
    }

    const king = kingAttackedSquares(targetSquare.position);
    if(hasPiece(king, [1], attackingColor, state)) {
        return true;
    }

    return false;
}

/** Return the Square of the king of the given color in the given state. */
export function findKing(state: ChessState, color: Color): Square {

    //black king is more likely to be at top of the board
    if(color == 1) {
        for(let i = 0; i < BOARD_SIZE; i++) {
            for(let j = 0; j < BOARD_SIZE; j++) {
                const pos: Position = [i, j];
                const s = itemAt(state.board, pos);
                if(s.piece && s.piece.name === 1 && s.piece.color === color) {
                    return s;
                }
            }
        }
    }

    //white king is more likely to be at bottom of the board
    for(let i = BOARD_SIZE - 1; i > -1; i--) {
        for(let j = BOARD_SIZE - 1; j > -1; j--) {
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
    return pawnColor === 2 && pos[0] === 0 || pawnColor === 1 && pos[0] === BOARD_SIZE - 1;
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

export function pawnAttackedSquares(pawnPos: Position, state: ChessState, pawnColor: Color): Position[] {
    return sameUnitDiagonals(pawnPos, state, pawnColor).map(s => s.position);
}

const kingVectors: readonly Position[] =  [[-1, -1],[-1, 0],[-1, 1],[0, 1],[1, 1],[1, 0],[1, -1],[0, -1]];
export function kingAttackedSquares(kingPos: Position): Position[] {
    return relativeAttackedSquares(kingPos, kingVectors);
}

const knightVectors: readonly Position[] =  [[-2, -1],[-2, 1],[2, -1],[2, 1],[1, 2],[1, -2],[-1, 2],[-1, -2]];
export function knightAttackedSquares(knightPos: Position): Position[] {  
    return relativeAttackedSquares(knightPos, knightVectors);
}

function relativeAttackedSquares(piecePos: Position, vectors: readonly Position[]): Position[] {
    return vectors.map(pos => addPositions(pos, piecePos))
                  .filter(pos => validPosition(pos))
}

function hasPiece(positions: Position[], pieceNames: Piece['name'][], attackingColor: Color, state: ChessState): boolean {
    for(let i = 0; i < positions.length; i++) {
        const pos = positions[i];
        const s = itemAt(state.board, pos);
        if(s.piece && s.piece.color === attackingColor && pieceNames.includes(s.piece.name)) {
            return true;
        }
    }

    return false;
}