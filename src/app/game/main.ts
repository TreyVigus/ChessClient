import { constructBoard, flat, itemAt, oppositeColor } from "../utils/helpers.js";
import { BoardView, initView, MoveEvent } from "../view/boardView.js";
import { ChessState, Color, Position, Square } from "./models.js";
import { isLegal, makeMove } from "./movements.js";

/********* Debugging flags **********/
const showSquarePositions = false; //render simple board with position info
const recordMoves = true; //print moves and resulting state to console
const enforceTurn = false; //track who's turn it is and prevent multiple moves from same player
/***********************************/

const view = initView();
let currentState = initialState();
let lastMove: MoveEvent | undefined = undefined; //The move that led to currentState

if(showSquarePositions) {
    view.showSquarePositions();
} else {
    drawState(currentState, view);

    let moveSequence: MoveEvent[] = [];
    let turn: Color = 'white';
    view.moveEmitter.subscribe((attemptedMove: MoveEvent) => {
        if(enforceTurn && !correctPlayer(currentState, attemptedMove, turn)) {
            return;
        }
        processMove(attemptedMove);
        if(recordMoves) {
            recordMove(attemptedMove, moveSequence);
        }
        turn = oppositeColor(turn);
    });
}

function correctPlayer(state: ChessState, attemptedMove: MoveEvent, turn: Color): boolean {
    const piece = itemAt(state.board, attemptedMove.startPos).piece;
    if(!piece || piece.color !== turn) {
        console.log('not your turn');
        return false;
    }
    turn = oppositeColor(turn);
    return true;
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