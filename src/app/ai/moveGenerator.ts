import { ChessState, Color } from "../game/models.js";
import { isLegal } from "../game/movements.js";
import { itemAt, posSequence } from "../utils/helpers.js";
import { MoveEvent } from "../view/boardView.js";


/**
 * Find all moves that can be made by the given color in the given state.
 * @param state State to evaluate.
 * @param precedingMove The move that led to state.
 * @param color The color to generate moves for.
 */
export function allLegalMoves(precedingMove: MoveEvent | undefined, state: ChessState, color: Color): MoveEvent[] {
    return allMoves().filter(move => {
        const piece = itemAt(state.board, move.startPos).piece;
        return !!piece && piece.color === color && isLegal(precedingMove, state, move)
    });
}

/** 
 * Every possible move in the given position. 
 * This generates 64*64 = 4096 moves.
 * */
function allMoves(): MoveEvent[] {
    let moves: MoveEvent[] = [];
    posSequence().forEach(startPos => {
        posSequence().forEach(endPos => {
            moves.push({startPos, endPos});
        });
    });
    return moves;
}