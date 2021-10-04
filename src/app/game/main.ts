import { getBotMove } from "../ai/bot.js";
import { createEmitter } from "../utils/emitter.js";
import { constructBoard, flat, itemAt, oppositeColor, posSequence } from "../utils/helpers.js";
import { BoardView, initBoardView, MoveEvent } from "../view/boardView.js";
import { displayTurn, displayVictor } from "../view/infoView.js";
import { ChessState, Color, Position, Square } from "./models.js";
import { isLegal, makeMove } from "./movements.js";
import { findKing, inCheck, inCheckMate, inStaleMate } from "./stateQueries.js";

/********* Debugging flags **********/
const showSquarePositions = false; //render simple board with position info
/***********************************/

type Turn = {
    player: Color,
    legalMove: MoveEvent | undefined
}

const view = initBoardView();
let currentState = initialState();

if(showSquarePositions) {
    view.showSquarePositions();
} else {
    drawState(currentState, view);

    const turns = createEmitter<Turn>();
    turns.subscribe(async (prevTurn: Turn) => {
        const colorToMove = oppositeColor(prevTurn.player);
        displayTurn(colorToMove);
        const attemptedMove = colorToMove === 'white' ? await getPlayerMove() : await getBotMove(prevTurn.legalMove, currentState);

        if(correctColor(currentState, attemptedMove, colorToMove) && isLegal(prevTurn.legalMove, currentState, attemptedMove)) {
            currentState = makeMove(prevTurn.legalMove, currentState, attemptedMove);
            drawState(currentState, view);

            if(gameOver(attemptedMove, currentState, oppositeColor(colorToMove))) {
                displayVictor(colorToMove);
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

async function getPlayerMove(): Promise<MoveEvent> {
    const playerMove = new Promise<MoveEvent>((resolve) => {
        //TODO: memory leak
        view.moveEmitter.subscribe((attemptedMove: MoveEvent) => {
            resolve(attemptedMove);
        });
    });

    return playerMove;
}

function gameOver(finalMove: MoveEvent, finalState: ChessState, losingColor: Color): boolean {
    return inCheckMate(finalMove, finalState, losingColor) || inStaleMate(finalMove, finalState, losingColor);
}

function correctColor(state: ChessState, attemptedMove: MoveEvent, expectedColor: Color) {
    const piece = itemAt(state.board, attemptedMove.startPos).piece;
    return piece && piece.color === expectedColor;
}

function drawState(state: ChessState, view: BoardView) {
    for(const s of flat(state.board)) {
        view.removePiece(s.value.position);
        if(s.value.piece) {
            view.drawPiece(s.value.piece, s.index);
        }
    }
    highlightInCheck(state, view);
}

function highlightInCheck(state: ChessState, view: BoardView) {
    //clear out any previous highlighting
    posSequence().forEach(pos => {
        view.removeHighlight(pos);
    });

    const whiteKing = findKing(state, 'white').position;
    if(inCheck(state, 'white')) {
        view.addHighlight(whiteKing);
    }

    const blackKing = findKing(state, 'black').position;
    if(inCheck(state, 'black')) {
        view.addHighlight(blackKing);
    }
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