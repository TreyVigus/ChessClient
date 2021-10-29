import { Player } from "../game/gameLoop.js";
import { ChessState, Color, Piece } from "../game/models.js";
import { makeMove } from "../game/movements.js";
import { inCheckMate, inStaleMate } from "../game/stateQueries.js";
import { flatten, oppositeColor } from "../utils/helpers.js";
import { MoveEvent } from "../view/boardView.js";
import { EvalCache, getEmptyCache } from "./cache.js";
import { allLegalMoves } from "./moveGenerator.js";

/**
 * @todo slowness because terminal test and eval are both calling inCheck (indirectly)
 *       can we reduce the number of calls?
 */

export type EvalResult = {
    eval: number,
    /** The ply that leads to eval. */
    ply: MoveEvent
}

export function minimaxbot(color: Color): Player {
    const cache = getEmptyCache();
    return {
        move: (prevPly: MoveEvent | undefined, state: ChessState) => {
            return new Promise<MoveEvent>((resolve) => {
                resolve(minimax(prevPly, state, color, cache));
            });
        }
    }
}

const SEARCH_DEPTH = 2;
const MAX_EVAL_SENTINEL = 1000;
const MIN_EVAL_SENTINEL = -1000;

/**
 * Get the best move for the bot in the given position.
 * Assumes the bot is the MAX player and the opponent is the MIN player.
 */
function minimax(prevPly: MoveEvent | undefined, state: ChessState, botColor: Color, cache: EvalCache): MoveEvent {
    return maxEval(prevPly, state, oppositeColor(botColor), botColor, 0, cache).ply;
}

/**
 * @param prevPly The ply that leads to state
 * @param state   The current state to consider
 * @param minColor MIN
 * @param maxColor MAX
 * @returns The highest evaluation (for MAX) that MAX can guarentee in the given state,
 *          assuming best play from MIN.
 */
function maxEval(prevPly: MoveEvent | undefined, state: ChessState, minColor: Color, maxColor: Color, depth: number, cache: EvalCache): EvalResult {
    if(prevPly && (depth === SEARCH_DEPTH || terminal(prevPly!, state))) {
        return {
            eval: evaluate(prevPly, state, maxColor),
            ply: prevPly
        }
    }

    const cached = cache.get(maxColor, state);
    if(cached) {
        return cached;
    }

    let maxChildEval = MIN_EVAL_SENTINEL - 1;
    let best: MoveEvent;
    allLegalMoves(prevPly, state, maxColor).forEach(ply => {
        const childState = makeMove(prevPly, state, ply);
        const childEval = minEval(ply, childState, minColor, maxColor, depth + 1, cache);
        cache.add(minColor, state, childEval);
        if(childEval.eval > maxChildEval) {
            maxChildEval = childEval.eval;
            best = ply;
        }
    });

    return {
        eval: maxChildEval,
        ply: best!
    }
}

/**
 * @param prevPly The ply that leads to state
 * @param state   The current state to consider
 * @param minColor MIN
 * @param maxColor MAX
 * @returns The lowest evaluation (for MAX) that MIN can guarentee in the given state,
 *          assuming best play from MAX.
 */
function minEval(prevPly: MoveEvent, state: ChessState, minColor: Color, maxColor: Color, depth: number, cache: EvalCache): EvalResult {
    if(prevPly && (depth === SEARCH_DEPTH || terminal(prevPly, state))) {
        return {
            eval: evaluate(prevPly, state, maxColor),
            ply: prevPly
        }
    }

    const cached = cache.get(minColor, state);
    if(cached) {
        return cached;
    }

    let minChildEval = MAX_EVAL_SENTINEL + 1;
    let best: MoveEvent;
    allLegalMoves(prevPly, state, minColor).forEach(ply => {
        const childState = makeMove(prevPly, state, ply);
        const childEval = maxEval(ply, childState, minColor, maxColor, depth + 1, cache);
        cache.add(maxColor, state, childEval);
        if(childEval.eval < minChildEval) {
            minChildEval = childEval.eval;
            best = ply;
        }
    });

    return {
        eval: minChildEval,
        ply: best!
    }
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
    [...flatten(state.board)].filter(sq => sq.value.piece).map(sq => sq.value.piece!).forEach(piece => {
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