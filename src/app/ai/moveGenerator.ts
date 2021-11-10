import { ChessState, Color, Piece, Position } from "../game/models.js";
import { isLegal } from "../game/movements.js";
import { bishopAttackedSquares, knightAttackedSquares, pawnAttackedSquares, rookAttackedSquares } from "../game/stateQueries.js";
import { addPositions, flatten, itemAt, posEquals, posSequence, shuffle, validPosition } from "../utils/helpers.js";
import { MoveEvent } from "../view/boardView.js";

type PlyCategory = 'capture' | 'other'; 


/**
 * Find all moves that can be made by the given color in the given state.
 * @param state State to evaluate.
 * @param precedingMove The move that led to state.
 * @param color The color to generate moves for.
 */
export function allLegalMoves(precedingMove: MoveEvent | undefined, state: ChessState, color: Color): MoveEvent[] {
    //NOTE: this will eventually become a priority queue...
    let plyTypes = new Map<PlyCategory, MoveEvent[]>();
    plyTypes.set('capture', []);
    plyTypes.set('other', []);

    flatten(state.board).forEach(sq => {
        const piece = sq.value.piece;
        if(piece && piece.color === color) {
            const piecePos = sq.index;
            if(piece.name === 5) {
                pawnMoves(piece, piecePos, state, precedingMove, plyTypes);
            } else if(piece.name === 3) {
                bishopMoves(piecePos, state, precedingMove, plyTypes)
            } else if(piece.name === 6) {
                rookMoves(piecePos, state, precedingMove, plyTypes);
            } else if(piece.name === 2) {
                queenMoves(piecePos, state, precedingMove, plyTypes);
            } else if(piece.name === 4) {
                knightMoves(piecePos, state, precedingMove, plyTypes);
            } else if(piece.name === 1) {
                kingMoves(piecePos, state, precedingMove, plyTypes);
            }
        }
    });

    let moves: MoveEvent[] = [];
    //introduce some randomness to prevent move loops
    moves.push(...shuffle(plyTypes.get('capture')!));
    moves.push(...shuffle(plyTypes.get('other')!));
    return moves;
}

function bishopMoves(bishopPos: Position, state: ChessState, precedingMove: MoveEvent | undefined, plyTypes: Map<PlyCategory, MoveEvent[]>) {
    const attacked = bishopAttackedSquares(bishopPos, state);
    attacked.forEach(pos => {
        let ply: MoveEvent = {startPos: bishopPos, endPos: pos};
        if(isLegal(precedingMove, state, ply)) {
            const category = categorize(ply, state);
            plyTypes.get(category)!.push(ply);
        }
    });
}

function rookMoves(rookPos: Position, state: ChessState, precedingMove: MoveEvent | undefined, plyTypes: Map<PlyCategory, MoveEvent[]>) {
    const attacked = rookAttackedSquares(rookPos, state);
    attacked.forEach(pos => {
        let ply: MoveEvent = {startPos: rookPos, endPos: pos};
        if(isLegal(precedingMove, state, ply)) {
            const category = categorize(ply, state);
            plyTypes.get(category)!.push(ply);
        }
    });
}

function knightMoves(knightPos: Position, state: ChessState, precedingMove: MoveEvent | undefined, plyTypes: Map<PlyCategory, MoveEvent[]>) {
    const attacked = knightAttackedSquares(knightPos);
    attacked.forEach(pos => {
        let ply: MoveEvent = {startPos: knightPos, endPos: pos};
        if(isLegal(precedingMove, state, ply)) {
            const category = categorize(ply, state);
            plyTypes.get(category)!.push(ply);
        }
    });
}

function queenMoves(queenPos: Position, state: ChessState, precedingMove: MoveEvent | undefined, plyTypes: Map<PlyCategory, MoveEvent[]>) {
    const attacked = rookAttackedSquares(queenPos, state).concat(bishopAttackedSquares(queenPos, state));
    attacked.forEach(pos => {
        let ply: MoveEvent = {startPos: queenPos, endPos: pos};
        if(isLegal(precedingMove, state, ply)) {
            const category = categorize(ply, state);
            plyTypes.get(category)!.push(ply);
        }
    });
}

function kingMoves(kingPos: Position, state: ChessState, precedingMove: MoveEvent | undefined, plyTypes: Map<PlyCategory, MoveEvent[]>) {
    posSequence().forEach(endPos => {
        const ply = {startPos: kingPos, endPos: endPos};
        if(!posEquals(endPos, kingPos) && isLegal(precedingMove, state, ply)) {
            const category = categorize(ply, state);
            plyTypes.get(category)!.push(ply);
        }
    });
}

function pawnMoves(pawn: Piece, pawnPos: Position, state: ChessState, precedingMove: MoveEvent | undefined, plyTypes: Map<PlyCategory, MoveEvent[]>) {
    const attacked = pawnAttackedSquares(pawnPos, state, pawn.color);
    if(pawn.color === 2) {
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

    attacked.forEach(pos => {
        let ply: MoveEvent = {startPos: pawnPos, endPos: pos};
        if(!posEquals(pos, pawnPos) && isLegal(precedingMove, state, ply)) {
            const category = categorize(ply, state);
            plyTypes.get(category)!.push(ply);
        }
    });
}

function categorize(ply: MoveEvent, state: ChessState): PlyCategory {
    if(itemAt(state.board, ply.endPos).piece!) {
        return 'capture';
    }
    return 'other';
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