import { Player } from "../game/gameLoop";
import { ChessState, Color, Piece } from "../game/models";
import { makeMove } from "../game/movements";
import { inCheckMate, inStaleMate } from "../game/stateQueries";
import { flat, oppositeColor } from "../utils/helpers";
import { MoveEvent } from "../view/boardView";
import { countPieces, FilterPiece } from "./countPieces";
import { allLegalMoves } from "./moveGenerator";

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
 * 1: the bot (MAX) wins
 * 0: a draw
 * -1: the other player (MIN) wins
 * */
type Utility = 1 | 0 | -1;

/**
 * Get the best move for the bot in the given position.
 * Assumes the bot is the MAX player and the opponent is the MIN player.
 * TODO: this code is very similar to maxUtility, may be able to refactor.
 */
function minimax(prevPly: MoveEvent | undefined, state: ChessState, botColor: Color): MoveEvent {
    let max = -2;
    let best: MoveEvent;
    allLegalMoves(prevPly, state, botColor).forEach(ply => {
        const child = makeMove(prevPly, state, ply);
        const util = minUtility(ply, child, oppositeColor(botColor), botColor);
        if(util > max) {
            max = util;
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
 * @returns The highest utility (for MAX) that MAX can guarentee in the given state,
 *          assuming best play from MIN.
 */
function maxUtility(prevPly: MoveEvent, state: ChessState, minColor: Color, maxColor: Color): Utility {
    if(terminal(prevPly, state)) {
        return utility(prevPly, state, maxColor);
    }

    let max = -2;
    allLegalMoves(prevPly, state, maxColor).forEach(ply => {
        const child = makeMove(prevPly, state, ply);
        const util = minUtility(ply, child, minColor, maxColor);
        if(util > max) {
            max = util;
        }
    });

    return max as Utility;
}

/**
 * @param prevPly The ply that leads to state
 * @param state   The current state to consider
 * @param minColor MIN
 * @param maxColor MAX
 * @returns The lowest utility (for MAX) that MIN can guarentee in the given state,
 *          assuming best play from MAX.
 */
function minUtility(prevPly: MoveEvent, state: ChessState, minColor: Color, maxColor: Color): Utility {
    if(terminal(prevPly, state)) {
        return utility(prevPly, state, maxColor);
    }

    let min = 2;
    allLegalMoves(prevPly, state, minColor).forEach(ply => {
        const child = makeMove(prevPly, state, ply);
        const util = maxUtility(ply, child, minColor, maxColor);
        if(util < min) {
            min = util;
        }
    });

    return min as Utility;
}

function terminal(prevPly: MoveEvent, state: ChessState): boolean {
    return inCheckMate(prevPly, state, 'black') ||
           inCheckMate(prevPly, state, 'white') ||
           inStaleMate(prevPly, state, 'black') ||
           inStaleMate(prevPly, state, 'white');
}

function utility(prevPly: MoveEvent, terminalState: ChessState, botColor: Color): Utility {
    if(inCheckMate(prevPly, terminalState, botColor)) {
        return -1;
    } 
    
    if(inCheckMate(prevPly, terminalState, oppositeColor(botColor))) {
        return 1;
    }

    return 0;
}

/**
 * Materialistic evaluation function
 * Bot material - opponent material
 */
function eval(prevPly: MoveEvent, state: ChessState, botColor: Color): number {
    if(inCheckMate(prevPly, state, oppositeColor(botColor))) {
        return 1000;
    }

    if(inCheckMate(prevPly, state, botColor)) {
        return -1000;
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