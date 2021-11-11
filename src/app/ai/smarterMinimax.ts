import { Player } from "../game/gameLoop.js";
import { ChessState, Color, Piece } from "../game/models.js";
import { makeMove, revertMove } from "../game/movements.js";
import { attackedPositions, inCheck, isBackRank } from "../game/stateQueries.js";
import { itemAt, oppositeColor, posSequence } from "../utils/helpers.js";
import { MoveEvent } from "../view/boardView.js";
import { EvalCache, getEmptyCache } from "./cache.js";
import { EvalResult } from "./minimaxBot.js";
import { allLegalMoves } from "./moveGenerator.js";

export function smartMinimax(color: Color): Player {
    return {
        move: (prevPly: MoveEvent | undefined, state: ChessState) => {
            return new Promise<MoveEvent>((resolve) => {
                resolve(minimax(prevPly, state, color, getEmptyCache()));
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
        const evaluation = terminalEvaluation(prevPly, state, maxColor, maxColor, minColor, depth);
        if(evaluation) {
            return evaluation;
        }
    }

    const cached = cache.get(maxColor, state);
    if(cached && cached.depth <= depth) {
        return cached;
    }

    let maxChildEval = MIN_EVAL_SENTINEL - 1;
    let best: MoveEvent;
    for(let ply of allLegalMoves(prevPly, state, maxColor)) {
        const editedSquares = makeMove(prevPly, state, ply);
        const childEval = minEval(ply, state, minColor, maxColor, depth + 1, alpha, beta, cache).eval;
        revertMove(state, editedSquares);

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
        ply: best!,
        depth
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
    const evaluation = terminalEvaluation(prevPly, state, minColor, maxColor, minColor, depth);
    if(evaluation) {
        return evaluation;
    }

    const cached = cache.get(minColor, state);
    if(cached && cached.depth <= depth) {
        return cached;
    }

    let minChildEval = MAX_EVAL_SENTINEL + 1;
    let best: MoveEvent;
    for(let ply of allLegalMoves(prevPly, state, minColor)) {
        const editedSquares = makeMove(prevPly, state, ply);
        const childEval = maxEval(ply, state, minColor, maxColor, depth + 1, alpha, beta, cache).eval;
        revertMove(state, editedSquares);

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
        ply: best!,
        depth
    }
    cache.add(minColor, state, res);
    return res;
}

/**
 * Evaluate the position from the bot's perspective.
 */
function terminalEvaluation(prevPly: MoveEvent, state: ChessState, turnColor: Color, maxColor: Color, minColor: Color, depth: number): EvalResult | undefined {
    let terminalVal: number | undefined = undefined;

    if(turnColor === minColor && allLegalMoves(prevPly, state, minColor).length === 0) {
        if(inCheck(state, minColor)) {
            terminalVal = MAX_EVAL_SENTINEL;
        } else {
            terminalVal = 0;
        }
    } else if(turnColor === maxColor && allLegalMoves(prevPly, state, maxColor).length === 0) {
        if(inCheck(state, maxColor)) {
            terminalVal = MIN_EVAL_SENTINEL;
        } else {
            terminalVal = 0;
        }
    }

    if(terminalVal !== undefined) {
        return {
            eval: terminalVal,
            ply: prevPly,
            depth
        }
    }

    if(depth === SEARCH_DEPTH) {
        return {
            eval: evaluate(state, maxColor),
            ply: prevPly,
            depth
        }
    }
}

function evaluate(state: ChessState, botColor: Color): number {
    let score = 0;

    posSequence().forEach(pos => {
        const s = itemAt(state.board, pos);
        const piece = s.piece;
        if(piece) {
            let attacked = 0;
            if([2, 3, 4].includes(piece.name)) {
                attacked = attackedPositions(piece, pos, state).length;
            }
            if(piece.color === botColor) {
                score = score + material(piece);
                score = score + attacked * .05;
            } else {
                score = score - material(piece);
                score = score - attacked * .05;
            }
        }
    });

    return score;
}

function material(p: Piece): number {
    if(p.name === 5) {
        return 1;
    } else if(p.name === 4) {
        return 3;
    } else if(p.name === 3) {
        return 3;
    } else if(p.name === 6) {
        return 5;
    } else if(p.name === 2) {
        return 9;
    } 
    //king's material shouldn't matter
    return -1;
}