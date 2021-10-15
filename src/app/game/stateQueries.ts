import { allLegalMoves } from "../ai/moveGenerator.js";
import { addPositions, flat, itemAt, oppositeColor, posEquals, validPosition } from "../utils/helpers.js";
import { BOARD_SIZE, MoveEvent } from "../view/boardView.js";
import { filterBlockedSquares, sameColumn, sameNegativeDiagonal, samePositiveDiagonal, sameRow, sameUnitDiagonals } from "./attackVectors.js";
import { ChessState, Color, Piece, Position, Square } from "./models.js";

/** Return a list of all squares attacked by the given piece. */
export function attackedSquares(piece: Piece, piecePos: Position, state: ChessState): Square[] {
    if(piece.name === 'rook') {
        return rookAttackedSquares(piecePos, state)
    } else if(piece.name === 'bishop') {
        return bishopAttackedSquares(piecePos, state);
    } else if(piece.name === 'queen') {
        return rookAttackedSquares(piecePos, state).concat(bishopAttackedSquares(piecePos, state));
    } else if(piece.name === 'pawn') {
        return pawnAttackedSquares(piecePos, state, piece);
    } else if(piece.name === 'king') {
        return kingAttackedSquares(piecePos, state);
    } else if(piece.name === 'knight') {
        return knightAttackedSquares(piecePos, state);
    }
    return [];
}

/** Return true if the given square has pieces of the given color attacking it. */
export function hasAttackers(targetSquare: Square, attackingColor: Color, state: ChessState): boolean {
    return [...flat(state.board)].some(sq => {
        const piece = sq.value.piece;
        if(piece && piece.color === attackingColor) {
            const attacked = attackedSquares(piece, sq.index, state);
            const attacksTarget = attacked.find(a => posEquals(a.position, targetSquare.position));
            return !!attacksTarget;
        }
    });
}

/** Return the Square of the king of the given color in the given state. */
export function findKing(state: ChessState, color: Color): Square {
    return [...flat(state.board)].map(sq => sq.value).filter(s => s.piece).find(s => s.piece!.name === 'king' && s.piece!.color === color)!;
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
    const direction = pawn.color === 'white' ? 'north' : 'south';
    return sameUnitDiagonals(pawnPos, state, direction);
}

function kingAttackedSquares(kingPos: Position, state: ChessState): Square[] {
    const vectors: Position[] =  [[-1, -1],[-1, 0],[-1, 1],[0, 1],[1, 1],[1, 0],[1, -1],[0, -1]];
    return relativeAttackedSquares(kingPos, vectors, state);
}

function knightAttackedSquares(knightPos: Position, state: ChessState): Square[] {  
    const vectors: Position[] =  [[-2, -1],[-2, 1],[2, -1],[2, 1],[1, 2],[1, -2],[-1, 2],[-1, -2]];
    return relativeAttackedSquares(knightPos, vectors, state);
}

function relativeAttackedSquares(piecePos: Position, vectors: Position[], state: ChessState) {
    return vectors.map(pos => addPositions(pos, piecePos))
                  .filter(pos => validPosition(pos))
                  .map(pos => itemAt(state.board, pos));
}