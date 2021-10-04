// /** Gives a way to compare a new version of the bot to an old version to determine which is better. */

// import { ChessState, Color, Position, Square } from "../game/models";
// import { isLegal, makeMove } from "../game/movements";
// import { correctColor, inCheckMate, inStaleMate } from "../game/stateQueries";
// import { createEmitter } from "../utils/emitter";
// import { constructBoard, oppositeColor } from "../utils/helpers";
// import { MoveEvent } from "../view/boardView";
// import { displayTurn } from "../view/infoView";

// type Turn = {
//     player: Color,
//     legalMove: MoveEvent | undefined
// }

// let currentState = initialState();

// const turns = createEmitter<Turn>();
// turns.subscribe(async (prevTurn: Turn) => {
//     const colorToMove = oppositeColor(prevTurn.player);
//     displayTurn(colorToMove);
//     const attemptedMove = colorToMove === 'white' ? await botFunc1(prevTurn.legalMove, currentState) : await botFunc2(prevTurn.legalMove, currentState);

//     if(correctColor(currentState, attemptedMove.startPos, colorToMove) && isLegal(prevTurn.legalMove, currentState, attemptedMove)) {
//         currentState = makeMove(prevTurn.legalMove, currentState, attemptedMove);

//         if(gameOver(attemptedMove, currentState, oppositeColor(colorToMove))) {
//             console.log('winner: ', colorToMove)
//         } else {
//             turns.publish({
//                 player: colorToMove,
//                 legalMove: attemptedMove
//             });
//         }

//     } else {
//         turns.publish(prevTurn);
//     }
// });

// function botFunc1(precedingMove: MoveEvent | undefined, state: ChessState): Promise<MoveEvent> {
//     throw 'not done'
// }

// function botFunc2(precedingMove: MoveEvent | undefined, state: ChessState): Promise<MoveEvent> {
//     throw 'not done'
// }

// function gameOver(finalMove: MoveEvent, finalState: ChessState, losingColor: Color): boolean {
//     return inCheckMate(finalMove, finalState, losingColor) || inStaleMate(finalMove, finalState, losingColor);
// }


// function initialState(): ChessState {
//     const board = constructBoard<Square>((pos: Position) => {
//         return { 
//             position: pos,
//             piece: undefined
//          };
//     });

//     board[0][0].piece = {color: 'black', name: 'rook'};
//     board[0][1].piece = {color: 'black', name: 'knight'};
//     board[0][2].piece = {color: 'black', name: 'bishop'};
//     board[0][3].piece = {color: 'black', name: 'queen'};
//     board[0][4].piece = {color: 'black', name: 'king'};
//     board[0][5].piece = {color: 'black', name: 'bishop'};
//     board[0][6].piece = {color: 'black', name: 'knight'};
//     board[0][7].piece = {color: 'black', name: 'rook'};

//     board[1][0].piece = {color: 'black', name: 'pawn'};
//     board[1][1].piece = {color: 'black', name: 'pawn'};
//     board[1][2].piece = {color: 'black', name: 'pawn'};
//     board[1][3].piece = {color: 'black', name: 'pawn'};
//     board[1][4].piece = {color: 'black', name: 'pawn'};
//     board[1][5].piece = {color: 'black', name: 'pawn'};
//     board[1][6].piece = {color: 'black', name: 'pawn'};
//     board[1][7].piece = {color: 'black', name: 'pawn'};

//     board[6][0].piece = {color: 'white', name: 'pawn'};
//     board[6][1].piece = {color: 'white', name: 'pawn'};
//     board[6][2].piece = {color: 'white', name: 'pawn'};
//     board[6][3].piece = {color: 'white', name: 'pawn'};
//     board[6][4].piece = {color: 'white', name: 'pawn'};
//     board[6][5].piece = {color: 'white', name: 'pawn'};
//     board[6][6].piece = {color: 'white', name: 'pawn'};
//     board[6][7].piece = {color: 'white', name: 'pawn'};

//     board[7][0].piece = {color: 'white', name: 'rook'};
//     board[7][1].piece = {color: 'white', name: 'knight'};
//     board[7][2].piece = {color: 'white', name: 'bishop'};
//     board[7][3].piece = {color: 'white', name: 'queen'};
//     board[7][4].piece = {color: 'white', name: 'king'};
//     board[7][5].piece = {color: 'white', name: 'bishop'};
//     board[7][6].piece = {color: 'white', name: 'knight'};
//     board[7][7].piece = {color: 'white', name: 'rook'};

//     return { board };
// }