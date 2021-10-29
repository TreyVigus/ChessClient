import { adjacent } from "../game/attackVectors.js";
import { ChessState, Color, Piece, Position } from "../game/models.js";
import { isLegal } from "../game/movements.js";
import { bishopAttackedSquares, kingAttackedSquares, knightAttackedSquares, pawnAttackedSquares, rookAttackedSquares } from "../game/stateQueries.js";
import { addPositions, flatten, itemAt, posEquals, posSequence, validPosition } from "../utils/helpers.js";
import { BOARD_SIZE, MoveEvent } from "../view/boardView.js";


/**
 * Find all moves that can be made by the given color in the given state.
 * @param state State to evaluate.
 * @param precedingMove The move that led to state.
 * @param color The color to generate moves for.
 * @todo this can be sped up by never generating any illegal moves, so they don't trigger failures in 'isLegal'
 *       e.g. if the piece is a bishop, any move to a square the bishop attacks is legal.
 *       will need to pass king and pawn through the isLegal check since they have special cases.
 */
export function allLegalMoves(precedingMove: MoveEvent | undefined, state: ChessState, color: Color): MoveEvent[] {
    let moves: MoveEvent[] = [];
    flatten(state.board).forEach(sq => {
        const piece = sq.value.piece;
        if(piece && piece.color === color) {
            const piecePos = sq.index;
            if(piece.name === 'pawn') {
                moves.push(...pawnMoves(piece, piecePos, state, precedingMove));
            } else if(piece.name === 'bishop') {
                moves.push(...bishopMoves(piecePos, state, precedingMove));
            } else if(piece.name === 'rook') {
                moves.push(...rookMoves(piecePos, state, precedingMove));
            } else if(piece.name === 'queen') {
                moves.push(...queenMoves(piecePos, state, precedingMove));
            } else if(piece.name === 'knight') {
                moves.push(...knightMoves(piecePos, state, precedingMove));
            } else if(piece.name === 'king') {
                moves.push(...kingMoves(piecePos, state, precedingMove));
            }
        }
    });
    return moves;
}

function bishopMoves(bishopPos: Position, state: ChessState, precedingMove: MoveEvent | undefined): MoveEvent[] {
    let moves: MoveEvent[] = [];
    const attacked = bishopAttackedSquares(bishopPos, state);
    attacked.forEach(pos => {
        let move: MoveEvent = {startPos: bishopPos, endPos: pos};
        if(!posEquals(pos, bishopPos) && isLegal(precedingMove, state, move)) {
            moves.push(move)
        }
    });
    return moves;
}

function rookMoves(rookPos: Position, state: ChessState, precedingMove: MoveEvent | undefined): MoveEvent[] {
    let moves: MoveEvent[] = [];
    const attacked = rookAttackedSquares(rookPos, state);
    attacked.forEach(pos => {
        let move: MoveEvent = {startPos: rookPos, endPos: pos};
        if(!posEquals(pos, rookPos) && isLegal(precedingMove, state, move)) {
            moves.push(move)
        }
    });
    return moves;
}

function knightMoves(knightPos: Position, state: ChessState, precedingMove: MoveEvent | undefined): MoveEvent[] {
    let moves: MoveEvent[] = [];
    const attacked = knightAttackedSquares(knightPos, state);
    attacked.forEach(pos => {
        let move: MoveEvent = {startPos: knightPos, endPos: pos};
        if(!posEquals(pos, knightPos) && isLegal(precedingMove, state, move)) {
            moves.push(move)
        }
    });
    return moves;
}

function queenMoves(queenPos: Position, state: ChessState, precedingMove: MoveEvent | undefined): MoveEvent[] {
    let moves: MoveEvent[] = [];
    const attacked = rookAttackedSquares(queenPos, state).concat(bishopAttackedSquares(queenPos, state));
    attacked.forEach(pos => {
        let move: MoveEvent = {startPos: queenPos, endPos: pos};
        if(!posEquals(pos, queenPos) && isLegal(precedingMove, state, move)) {
            moves.push(move)
        }
    });
    return moves;
}

function kingMoves(kingPos: Position, state: ChessState, precedingMove: MoveEvent | undefined): MoveEvent[] {
    let moves: MoveEvent[] = [];
    kingAttackedSquares(kingPos, state)
    posSequence().forEach(endPos => {
        const move = {startPos: kingPos, endPos: endPos};
        if(!posEquals(endPos, kingPos) && isLegal(precedingMove, state, move)) {
            moves.push({startPos: kingPos, endPos: endPos})
        }
    });
    return moves;
}

function pawnMoves(pawn: Piece, pawnPos: Position, state: ChessState, precedingMove: MoveEvent | undefined): MoveEvent[] {
    const attacked = pawnAttackedSquares(pawnPos, state, pawn);
    if(pawn.color === 'white') {
        const one = addPositions(pawnPos, [-1, 0]);
        const two = addPositions(pawnPos, [-2, 0]);
        if(validPosition(one)) {
            attacked.push(one);
        }

        if(validPosition(two)) {
            attacked.push(two);
        }
    } else {
        const one = addPositions(pawnPos, [1, 0]);
        const two = addPositions(pawnPos, [2, 0]);
        if(validPosition(one)) {
            attacked.push(one);
        }

        if(validPosition(two)) {
            attacked.push(two);
        }
    }

    let moves: MoveEvent[] = [];
    attacked.forEach(pos => {
        let move: MoveEvent = {startPos: pawnPos, endPos: pos};
        if(!posEquals(pos, pawnPos) && isLegal(precedingMove, state, move)) {
            moves.push(move)
        }
    });
    return moves;
}

/********** USED FOR TESTING ONLY **********/
export function compareMoves(precedingMove: MoveEvent | undefined, state: ChessState, color: Color): boolean {
    const slow = slowLegalMoves(precedingMove, state, color);
    const fast = allLegalMoves(precedingMove, state, color);
    if(slow.length !== fast.length) {
        return false;
    }

    const slowSet = new Set(slow.map(move => serializeMove(move))); 
    const fastSet = new Set(fast.map(move => serializeMove(move)));
    if(slowSet.size !== fastSet.size) {
        return false;
    }

    if(slowSet.size !== slow.length) {
        return false;
    }

    if(fastSet.size !== fast.length) {
        return false;
    }

    for(let move of slowSet) {
        if(fastSet.has(move)) {
            fastSet.delete(move);
        } else {
            return false;
        }
    }

    return true;
}

function serializeMove(move: MoveEvent): string {
    return `start: (${move.startPos[0]}, ${move.startPos[1]}), end: (${move.endPos[0]}, ${move.endPos[1]})`;
}

export function slowLegalMoves(precedingMove: MoveEvent | undefined, state: ChessState, color: Color): MoveEvent[] {
    return allMoves().filter(move => {
        const piece = itemAt(state.board, move.startPos).piece;
        return !!piece && piece.color === color && isLegal(precedingMove, state, move);
    });
}

export function allMoves(): MoveEvent[] {
    let moves: MoveEvent[] = [];
    posSequence().forEach(startPos => {
        posSequence().forEach(endPos => {
            moves.push({startPos, endPos});
        });
    });
    return moves;
}

/******************************************/