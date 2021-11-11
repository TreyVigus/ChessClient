import { ChessState, Color, Piece, Position } from "../game/models.js";
import { isLegal } from "../game/movements.js";
import { bishopAttackedSquares, kingAttackedSquares, knightAttackedSquares, pawnAttackedSquares, relativeAttackedSquares, rookAttackedSquares } from "../game/stateQueries.js";
import { addPositions, cloneState, flatten, itemAt, posEquals, posSequence, shuffle, validPosition } from "../utils/helpers.js";
import { MoveEvent } from "../view/boardView.js";
import { material } from "./minimaxBot.js";

/**
 * Find all moves that can be made by the given color in the given state.
 * @param state State to evaluate.
 * @param precedingMove The move that led to state.
 * @param color The color to generate moves for.
 */
export function allLegalMoves(precedingMove: MoveEvent | undefined, state: ChessState, color: Color): MoveEvent[] {
    let moves: MoveEvent[] = [];

    flatten(cloneState(state).board).forEach(sq => {
        const piece = sq.value.piece;
        if(!piece) {
            return;
        }

        if(piece.color === color) {
            const piecePos = sq.index;
            let attacked: Position[] = [];
            if(piece.name === 5) {
                attacked = pawnMoves(piece, piecePos, state, precedingMove);
            } else if(piece.name === 3) {
                attacked = bishopAttackedSquares(piecePos, state);
            } else if(piece.name === 6) {
                attacked = rookAttackedSquares(piecePos, state);
            } else if(piece.name === 2) {
                attacked = rookAttackedSquares(piecePos, state).concat(bishopAttackedSquares(piecePos, state));
            } else if(piece.name === 4) {
                attacked = knightAttackedSquares(piecePos);
            } else if(piece.name === 1) {
                attacked = kingAttackedSquares(piecePos);
                //vectors for squares two squares to left or right of king
                const vectors: Position[] = [[0, 2], [0, -2]];
                attacked.push(...relativeAttackedSquares(piecePos, vectors));
            }
            moves.push(...getMoves(piecePos, state, precedingMove, attacked));
        }
    });

    let captures: MoveEvent[] = [];
    let forward: MoveEvent[] = [];
    let backward: MoveEvent[] = [];

    moves.forEach(move => {
        const capture = itemAt(state.board, move.endPos).piece!;
        //captures have highest priority
        if(capture) {
            captures.push(move);
        } else if(isForwardMove(move, color)) {
            forward.push(move);
        } else {
            backward.push(move);
        }
    });

    //sort captures by material difference descending
    captures.sort((a, b) => {
        const aStartPiece = itemAt(state.board, a.startPos).piece!;
        const bStartPiece = itemAt(state.board, b.startPos).piece!;
        const aEndPiece = itemAt(state.board, a.endPos).piece!;
        const bEndPiece = itemAt(state.board, b.endPos).piece!;

        const aMaterialDiff = material(aEndPiece) - material(aStartPiece);
        const bMaterialDiff = material(bEndPiece) - material(bStartPiece);

        return bMaterialDiff - aMaterialDiff;
    });

    //introduce some indeterminism to prevent move loops
    shuffle(forward);
    shuffle(backward);

    return [...captures, ...forward, ...backward];
}

function pawnMoves(pawn: Piece, pawnPos: Position, state: ChessState, precedingMove: MoveEvent | undefined): Position[] {
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

    return attacked;
}

function getMoves(piecePos: Position, state: ChessState, precedingMove: MoveEvent | undefined, attacked: Position[]): MoveEvent[] {
    return attacked.map(pos => {
        return {startPos: piecePos, endPos: pos} as MoveEvent
    }).filter(ply => {
        return !posEquals(ply.endPos, piecePos) && isLegal(precedingMove, state, ply);
    });
}

function isForwardMove(move: MoveEvent, color: Color): boolean {
    if(color === 2) {
        return move.startPos[0] >= move.endPos[0];
    } else {
        return move.startPos[0] <= move.endPos[0];
    }
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