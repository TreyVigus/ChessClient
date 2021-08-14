import { flat, itemAt, oppositeColor, posEquals, validPosition } from "../utils/helpers.js";
import { BOARD_SIZE } from "../view/boardView.js";
import { filterBlockedSquares, sameColumn, sameNegativeDiagonal, samePositiveDiagonal, sameRow, sameUnitDiagonals } from "./attackVectors.js";
import { ChessState, Color, Piece, Position, Square } from "./models.js";

/** Return a list of all squares attacked by the given piece. */
export function attackedSquares(piece: Piece, piecePos: Position, state: ChessState): Square[] {
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
    } else if(piece.name === 'knight') {
        return knightAttackedSquares(piecePos, state);
    }
    return [];
}

/** Return true if the given square has pieces of the given color attacking it. */
export function hasAttackers(targetSquare: Square, attackingColor: Color, state: ChessState): boolean {
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

/** Return the Square of the king of the given color in the given state. */
export function findKing(state: ChessState, color: Color): Square {
    return [...flat(state.board)].map(sq => sq.value).filter(s => s.piece).find(s => s.piece!.name === 'king' && s.piece!.color === color)!;
}

/** Is the king in check in the given state? */
export function inCheck(state: ChessState, kingColor: Color): boolean {
    //king is in check if any piece of the opposite color attacks the king's square.
    const kingSquare = findKing(state, kingColor);
    return hasAttackers(kingSquare, oppositeColor(kingColor), state);
}

/** Do the given positions contain a piece in the given state? */
export function containsPiece(state: ChessState, ...positions: Position[]): boolean {
    return positions.findIndex(pos => !!itemAt(state.board, pos).piece) > -1;
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
    const direction = pawn.color === 'white' ? 'up' : 'down';
    return sameUnitDiagonals(pawnPos, state, direction);
}

function kingAttackedSquares(kingPos: Position, state: ChessState, king: Piece): Square[] {
    const adjacent: Position[] = [
        [kingPos[0] - 1, kingPos[1] - 1], //northwest
        [kingPos[0] - 1, kingPos[1]], //north
        [kingPos[0] - 1, kingPos[1] + 1], //northEast
        [kingPos[0], kingPos[1] + 1], //east
        [kingPos[0] + 1, kingPos[1] + 1], //southEast
        [kingPos[0] + 1, kingPos[1]], //south
        [kingPos[0] + 1, kingPos[1] - 1], //southWest
        [kingPos[0], kingPos[1] - 1] //west
    ];

    return adjacent.filter(pos => validPosition(pos)).map(pos => itemAt(state.board, pos));
}

function knightAttackedSquares(knightPos: Position, state: ChessState): Square[] {  
    const attacked: Position[] = [
        [knightPos[0] - 2, knightPos[1] - 1],
        [knightPos[0] - 2, knightPos[1] + 1],
        [knightPos[0] + 2, knightPos[1] - 1],
        [knightPos[0] + 2, knightPos[1] + 1],

        [knightPos[0] + 1, knightPos[1] + 2],
        [knightPos[0] + 1, knightPos[1] - 2],
        [knightPos[0] - 1, knightPos[1] + 2],
        [knightPos[0] - 1, knightPos[1] - 2],
    ];

    return attacked.filter(pos => validPosition(pos)).map(pos => itemAt(state.board, pos));
}