import { Player } from "../game/gameLoop.js";
import { ChessState, Color, Piece } from "../game/models.js";
import { makeMove } from "../game/movements.js";
import { inCheckMate, inStaleMate } from "../game/stateQueries.js";
import { flat, oppositeColor } from "../utils/helpers.js";
import { MoveEvent } from "../view/boardView.js";
import { allLegalMoves } from "./moveGenerator.js";

const MAX_DEPTH = 1;
const MAX_EVAL_SENTINEL = 1000;
const MIN_EVAL_SENTINEL = -1000;

export function minimaxbot(color: Color): Player {
    return {
        move: (prevPly: MoveEvent | undefined, state: ChessState) => {
            return new Promise<MoveEvent>((resolve) => {
                resolve(minimax(prevPly, state, color));
            });
        }
    }
}

/**
 * Get the best move for the bot in the given position.
 * Assumes the bot is the MAX player and the opponent is the MIN player.
 * TODO: this code is very similar to maxUtility, may be able to refactor.
 */
function minimax(prevPly: MoveEvent | undefined, state: ChessState, botColor: Color): MoveEvent {
    let maxChildEval = MIN_EVAL_SENTINEL - 1;
    let best: MoveEvent;
    allLegalMoves(prevPly, state, botColor).forEach(ply => {
        const childState = makeMove(prevPly, state, ply);
        const childEval = minEval(ply, childState, oppositeColor(botColor), botColor, 1);
        if(childEval > maxChildEval) {
            maxChildEval = childEval;
            best = ply;
        }
    });
    return best!;
}

/**
 * @param prevPly The ply that leads to state
 * @param state   The current state to consider
 * @param minColor MIN
 * @param maxColor MAX
 * @returns The highest evaluation (for MAX) that MAX can guarentee in the given state,
 *          assuming best play from MIN.
 */
function maxEval(prevPly: MoveEvent, state: ChessState, minColor: Color, maxColor: Color, depth: number): number {
    if(terminal(prevPly, state) || depth === MAX_DEPTH) {
        return evaluate(prevPly, state, maxColor);
    }

    let maxChildEval = MIN_EVAL_SENTINEL - 1;
    allLegalMoves(prevPly, state, maxColor).forEach(ply => {
        const childState = makeMove(prevPly, state, ply);
        const childEval = minEval(ply, childState, minColor, maxColor, depth + 1);
        maxChildEval = Math.max(maxChildEval, childEval);
    });

    return maxChildEval;
}

/**
 * @param prevPly The ply that leads to state
 * @param state   The current state to consider
 * @param minColor MIN
 * @param maxColor MAX
 * @returns The lowest evaluation (for MAX) that MIN can guarentee in the given state,
 *          assuming best play from MAX.
 */
function minEval(prevPly: MoveEvent, state: ChessState, minColor: Color, maxColor: Color, depth: number): number {
    if(terminal(prevPly, state) || depth === MAX_DEPTH) {
        return evaluate(prevPly, state, maxColor);
    }

    let minChildEval = MAX_EVAL_SENTINEL + 1;
    allLegalMoves(prevPly, state, minColor).forEach(ply => {
        const childState = makeMove(prevPly, state, ply);
        const childEval = maxEval(ply, childState, minColor, maxColor, depth + 1);
        minChildEval = Math.min(minChildEval, childEval);
    });

    return minChildEval;
}

function terminal(prevPly: MoveEvent, state: ChessState): boolean {
    return inCheckMate(prevPly, state, 'black') ||
           inCheckMate(prevPly, state, 'white') ||
           inStaleMate(prevPly, state, 'black') ||
           inStaleMate(prevPly, state, 'white');
}

/**
 * Materialistic evaluation function
 * Bot material - opponent material
 */
function evaluate(prevPly: MoveEvent, state: ChessState, botColor: Color): number {
    if(inCheckMate(prevPly, state, oppositeColor(botColor))) {
        return MAX_EVAL_SENTINEL;
    }

    if(inCheckMate(prevPly, state, botColor)) {
        return -MIN_EVAL_SENTINEL;
    } 

    if(inStaleMate(prevPly, state, 'black') || inStaleMate(prevPly, state, 'white')) {
        return 0;
    }

    let value = 0;
    [...flat(state.board)].filter(sq => sq.value.piece).map(sq => sq.value.piece!).forEach(piece => {
        if(piece.color === botColor) {
            value = value + material(piece);
        } else {
            value = value - material(piece);
        }
    });
    return value;
}

function material(p: Piece): number {
    if(p.name === 'pawn') {
        return 1;
    } else if(p.name === 'knight') {
        return 3;
    } else if(p.name === 'bishop') {
        return 3;
    } else if(p.name === 'rook') {
        return 5;
    } else if(p.name === 'queen') {
        return 9;
    } 
    //king's material shouldn't matter
    return -1;
}