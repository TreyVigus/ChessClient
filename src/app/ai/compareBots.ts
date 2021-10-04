/** Gives a way to compare a new version of the bot to an old version to determine which is better. */
// TODO: abstraction between this and main.ts
// TODO: need to implement threefold repetition and 50 move rule to avoid infinite loops

import { ChessState, Color, Position, Square } from "../game/models.js";
import { isLegal, makeMove } from "../game/movements.js";
import { correctColor, gameOver } from "../game/stateQueries.js";
import { createEmitter } from "../utils/emitter.js";
import { constructBoard, oppositeColor } from "../utils/helpers.js";
import { initBoardView, MoveEvent } from "../view/boardView.js";
import { drawState } from "../view/drawState.js";
import { GetBotMove } from "./bot.js";

// TODO: duplicated in main.ts
type Turn = {
    player: Color,
    legalMove: MoveEvent | undefined
}

export function compareBots(whiteBot: GetBotMove, blackBot: GetBotMove) {
    let currentState = initialState();
    const turns = createEmitter<Turn>();
    turns.subscribe(async (prevTurn: Turn) => {
        const colorToMove = oppositeColor(prevTurn.player);
        const attemptedMove = colorToMove === 'white' ? await whiteBot(prevTurn.legalMove, currentState, 'white') : await blackBot(prevTurn.legalMove, currentState, 'black');
    
        if(correctColor(currentState, attemptedMove.startPos, colorToMove) && isLegal(prevTurn.legalMove, currentState, attemptedMove)) {
            currentState = makeMove(prevTurn.legalMove, currentState, attemptedMove);
    
            if(gameOver(attemptedMove, currentState, oppositeColor(colorToMove))) {
                drawState(currentState, initBoardView());
            } else {
                turns.publish({
                    player: colorToMove,
                    legalMove: attemptedMove
                });
            }
        } else {
            turns.publish(prevTurn);
        }
    });
    //white moves first
    turns.publish({player: 'black', legalMove: undefined});
}

// TODO: duplicated in main.ts
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
    board[0][3].piece = {color: 'black', name: 'queen'};
    board[0][4].piece = {color: 'black', name: 'king'};
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
    board[7][3].piece = {color: 'white', name: 'queen'};
    board[7][4].piece = {color: 'white', name: 'king'};
    board[7][5].piece = {color: 'white', name: 'bishop'};
    board[7][6].piece = {color: 'white', name: 'knight'};
    board[7][7].piece = {color: 'white', name: 'rook'};

    return { board };
}