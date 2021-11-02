import { Player } from "../game/gameLoop.js";
import { ChessState, Color, Piece } from "../game/models.js";
import { makeMove } from "../game/movements.js";
import { inCheck, inCheckMate, inStaleMate } from "../game/stateQueries.js";
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

const SEARCH_DEPTH = 5;
const MAX_EVAL_SENTINEL = 1000;
const MIN_EVAL_SENTINEL = -1000;

/**
 * Get the best move for the bot in the given position.
 * Assumes the bot is the MAX player and the opponent is the MIN player.
 */
function minimax(prevPly: MoveEvent | undefined, state: ChessState, botColor: Color, cache: EvalCache): MoveEvent {
    return maxEval(prevPly, state, oppositeColor(botColor), botColor, 0, MIN_EVAL_SENTINEL, MAX_EVAL_SENTINEL, cache).ply;
}

/**
 * @param prevPly The ply that leads to state
 * @param state   The current state to consider
 * @param minColor MIN
 * @param maxColor MAX
 * @param alpha best evaluation seen for MAX at ancestor nodes
 * @param beta best evaluation seen for MIN at ancestor nodes
 * @returns The highest evaluation (for MAX) that MAX can guarentee in the given state,
 *          assuming best play from MIN.
 */

function maxEval(prevPly: MoveEvent | undefined, state: ChessState, minColor: Color, maxColor: Color, depth: number, alpha: number, beta: number, cache: EvalCache): EvalResult {
    if(prevPly) {
        const evaluation = terminalEvaluation(prevPly, state, maxColor, maxColor, depth);
        if(evaluation) {
            return evaluation;
        }
    }

    const cached = cache.get(maxColor, state);
    if(cached) {
        return cached;
    }

    let maxChildEval = MIN_EVAL_SENTINEL - 1;
    let best: MoveEvent;
    for(let ply of allLegalMoves(prevPly, state, maxColor)) {
        const childState = makeMove(prevPly, state, ply);
        const childEval = minEval(ply, childState, minColor, maxColor, depth + 1, alpha, beta, cache).eval;

        if(childEval > maxChildEval) {
            maxChildEval = childEval;
            best = ply;

            if(maxChildEval >= beta) {
                break;
            }

            if(maxChildEval > alpha) {
                alpha = maxChildEval;
            }
        }
    }

    const res = {
        eval: maxChildEval,
        ply: best!
    }
    cache.add(maxColor, state, res);
    return res;
}

/**
 * @param prevPly The ply that leads to state
 * @param state   The current state to consider
 * @param minColor MIN
 * @param maxColor MAX
 * @param alpha best evaluation seen for MAX at ancestor nodes
 * @param beta best evaluation seen for MIN at ancestor nodes
 * @returns The lowest evaluation (for MAX) that MIN can guarentee in the given state,
 *          assuming best play from MAX.
 */
function minEval(prevPly: MoveEvent, state: ChessState, minColor: Color, maxColor: Color, depth: number, alpha: number, beta: number, cache: EvalCache): EvalResult {
    const evaluation = terminalEvaluation(prevPly, state, minColor, maxColor, depth);
    if(evaluation) {
        return evaluation;
    }

    const cached = cache.get(minColor, state);
    if(cached) {
        return cached;
    }

    let minChildEval = MAX_EVAL_SENTINEL + 1;
    let best: MoveEvent;
    for(let ply of allLegalMoves(prevPly, state, minColor)) {
        const childState = makeMove(prevPly, state, ply);
        const childEval = maxEval(ply, childState, minColor, maxColor, depth + 1, alpha, beta, cache).eval;

        if(childEval < minChildEval) {
            minChildEval = childEval;
            best = ply;

            if(minChildEval <= alpha) {
                break;
            }

            if(minChildEval < beta) {
                beta = minChildEval;
            }
        }
    };

    const res = {
        eval: minChildEval,
        ply: best!
    }
    cache.add(minColor, state, res);
    return res;
}

/**
 * @todo may be able to only call allLegalMoves on minColor/maxColor depending on the previous move.
 * turnColor is the color to move in the given state
 */
function terminalEvaluation(prevPly: MoveEvent, state: ChessState, turnColor: Color, maxColor: Color, depth: number): EvalResult | undefined {
    let terminalVal: number | undefined = undefined;

    if(turnColor === 'white' && allLegalMoves(prevPly, state, 'white').length === 0) {
        if(inCheck(state, 'white')) {
            terminalVal = MAX_EVAL_SENTINEL;
        } else {
            terminalVal = 0;
        }
    } else if(turnColor === 'black' && allLegalMoves(prevPly, state, 'black').length === 0) {
        if(inCheck(state, 'black')) {
            terminalVal = MIN_EVAL_SENTINEL;
        } else {
            terminalVal = 0;
        }
    }

    if(terminalVal !== undefined) {
        return {
            eval: terminalVal,
            ply: prevPly
        }
    }

    if(depth === SEARCH_DEPTH) {
        return {
            eval: evaluate(state, maxColor),
            ply: prevPly
        }
    }
}

/**
 * Evaluation function
 * Assumes state is not terminal (checkmate or stalemate)
 * Bot material - opponent material
 */
function evaluate(state: ChessState, botColor: Color): number {
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