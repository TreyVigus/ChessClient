import { constructBoard, itemAt, oppositeColor } from "../utils/helpers.js";
import { MoveEvent } from "../view/boardView.js";
import { countPieces } from "../ai/countPieces.js";
import { ChessState, Color, Position, Square } from "./models.js";
import { isLegal, makeMove } from "./movements.js";
import { inCheckMate, inStaleMate } from "./stateQueries.js";

export type Ply = {
    /** Board state at the end of the ply. */
    state: ChessState,
    /** The color that moved a piece. Undefined if it's the first move. */
    color?: Color,
    /** The legal move that led to newState. Undefined if it's the first move. */
    move?: MoveEvent,
}

export type Player = {
    /** Produce the next ply. */
    move: (prevPly: MoveEvent | undefined, state: ChessState) => Promise<MoveEvent>
}

export type Winner = Color | 'draw';

export type GameSubscriptions = {
    onInitialState?: (initial: ChessState) => void, 
    onLegalPly?: (ply: Ply) => void, 
    onGameEnd?: (finalPly: Ply, winner: Winner) => void
}

export async function gameLoop(
    white: Player, 
    black: Player,
    subscriptions?: GameSubscriptions
) {
    let prevPly: Ply = {
        state: initialState(),
    }
    let turn: Color = 'white';

    await runAnimation(() => {
        subscriptions?.onInitialState?.call(undefined, prevPly.state);
    });

    //50 move rule counter
    let counter = 0;
    while(true) {
        const player = turn === 'white' ? white : black;
        const moveEvent = await player.move(prevPly.move, prevPly.state);
        const validMove = correctColor(prevPly.state, moveEvent.startPos, turn) && isLegal(prevPly.move, prevPly.state, moveEvent);
        if(validMove) {
            const newState = makeMove(prevPly.move, prevPly.state, moveEvent);

            if(resetCounter(prevPly.state, moveEvent, newState)) {
                counter = 0;
            } else {
                counter++;
            }

            prevPly = {
                state: newState,
                color: turn,
                move: moveEvent
            };

            await runAnimation(() => {
                subscriptions?.onLegalPly?.call(undefined, prevPly);
            });

            turn = oppositeColor(turn);

            const winner = gameOver(moveEvent, prevPly.state, turn, counter);
            if(winner) {
                await runAnimation(() => {
                    subscriptions?.onGameEnd?.call(undefined, prevPly, winner);
                });
                break;
            }
        }
    }
}

//TODO: add threefold repetition
function gameOver(finalMove: MoveEvent, finalState: ChessState, losingColor: Color, counter: number): Winner | false {
    if(inCheckMate(finalMove, finalState, losingColor)) {
        return oppositeColor(losingColor);
    } else if(inStaleMate(finalMove, finalState, losingColor) || counter === 100) {
        return 'draw';
    } else {
        return false;
    }
}

function correctColor(state: ChessState, pos: Position, expectedColor: Color): boolean {
    const piece = itemAt(state.board, pos).piece;
    return !!piece && piece.color === expectedColor;
}

/**
 * If there are 50 moves (100 ply) without a capture or pawn move, we have a draw.
 */
function resetCounter(prevState: ChessState, legalMove: MoveEvent, newState: ChessState): boolean {
    const pawnMove = itemAt(prevState.board, legalMove.startPos).piece!.name === 'pawn';
    if(pawnMove) {
        return true;
    }

    const capture = countPieces(prevState) > countPieces(newState);
    if(capture) {
        return true;
    }

    return false;
}

/** 
 * Run the given function and wait for painting to occur.
 * Useful since the bot may be slow and block painting. 
 * We want to render the player's move BEFORE the bot moves.
 * */
 async function runAnimation(f: Function): Promise<void> {
    await new Promise(requestAnimationFrame);
    f();
    await new Promise(requestAnimationFrame);
}

function initialState(): ChessState {
    const board = constructBoard<Square>((pos: Position) => {
        return { 
            position: pos,
            piece: undefined
         };
    });

    board[0][0].piece = {color: 'black', name: 'rook'};
    board[0][1].piece = {color: 'black', name: 'knight'};
    board[0][2].piece = {color: 'black', name: 'bishop'};
    board[0][3].piece = {color: 'black', name: 2};
    board[0][4].piece = {color: 'black', name: 1};
    board[0][5].piece = {color: 'black', name: 'bishop'};
    board[0][6].piece = {color: 'black', name: 'knight'};
    board[0][7].piece = {color: 'black', name: 'rook'};

    board[1][0].piece = {color: 'black', name: 'pawn'};
    board[1][1].piece = {color: 'black', name: 'pawn'};
    board[1][2].piece = {color: 'black', name: 'pawn'};
    board[1][3].piece = {color: 'black', name: 'pawn'};
    board[1][4].piece = {color: 'black', name: 'pawn'};
    board[1][5].piece = {color: 'black', name: 'pawn'};
    board[1][6].piece = {color: 'black', name: 'pawn'};
    board[1][7].piece = {color: 'black', name: 'pawn'};

    board[6][0].piece = {color: 'white', name: 'pawn'};
    board[6][1].piece = {color: 'white', name: 'pawn'};
    board[6][2].piece = {color: 'white', name: 'pawn'};
    board[6][3].piece = {color: 'white', name: 'pawn'};
    board[6][4].piece = {color: 'white', name: 'pawn'};
    board[6][5].piece = {color: 'white', name: 'pawn'};
    board[6][6].piece = {color: 'white', name: 'pawn'};
    board[6][7].piece = {color: 'white', name: 'pawn'};

    board[7][0].piece = {color: 'white', name: 'rook'};
    board[7][1].piece = {color: 'white', name: 'knight'};
    board[7][2].piece = {color: 'white', name: 'bishop'};
    board[7][3].piece = {color: 'white', name: 2};
    board[7][4].piece = {color: 'white', name: 1};
    board[7][5].piece = {color: 'white', name: 'bishop'};
    board[7][6].piece = {color: 'white', name: 'knight'};
    board[7][7].piece = {color: 'white', name: 'rook'};

    return { board };
}