import { constructBoard, flat, posSequence } from "../utils/helpers.js";
import { BoardView, initView, MoveEvent } from "../view/boardView.js";
import { ChessState, Position, Square } from "./models.js";
import { isLegal, makeMove } from "./movements.js";
import { findKing, inCheck } from "./stateQueries.js";

/********* Debugging flags **********/
const showSquarePositions = false; //render simple board with position info
const recordMoves = true; //print moves and resulting state to console
/***********************************/

const view = initView();
let currentState = initialState();
let lastMove: MoveEvent | undefined = undefined; //The move that led to currentState

if(showSquarePositions) {
    view.showSquarePositions();
} else {
    let moveSequence: MoveEvent[] = [];
    drawState(currentState, view);
    view.moveEmitter.subscribe((attemptedMove: MoveEvent) => {
        processMove(attemptedMove);
        if(recordMoves) {
            recordMove(attemptedMove, moveSequence);
        }
    });
}

function processMove(attemptedMove: MoveEvent) {
    if(isLegal(lastMove, currentState, attemptedMove)) {
        currentState = makeMove(lastMove, currentState, attemptedMove);
        lastMove = attemptedMove;
        drawState(currentState, view);
    }
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

function recordMove(attemptedMove: MoveEvent, moveSequence: MoveEvent[]) {
    moveSequence.push(attemptedMove);
    const stringSeq = JSON.stringify(moveSequence);
    const stringState = JSON.stringify(currentState);
    console.log(`addCase(${stringSeq}, ${stringState})`);
}