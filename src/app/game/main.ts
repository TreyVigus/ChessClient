import { constructBoard, flat, itemAt } from "../utils/helpers.js";
import { BoardView, initView, MoveEvent } from "../view/boardView.js";
import { ChessState, Position, Square } from "./models.js";
import { classifyMove } from "./moveClassifier.js";
import { isLegal, makeMove } from "./movements.js";
import { isBackRank } from "./stateQueries.js";

const view = initView();
let currentState: ChessState = initialState();
let lastMove: MoveEvent | undefined = undefined; //The move that led to currentState

drawState(currentState, view);
view.showSquarePositions();
view.moveEmitter.subscribe((attemptedMove: MoveEvent) => {
    if(isLegal(lastMove, currentState, attemptedMove)) {
        renderMove(currentState, view, lastMove, attemptedMove);
        currentState = makeMove(lastMove, currentState, attemptedMove);
        lastMove = attemptedMove;
    }
});

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

/** Draw the given state. Slower than making a move from an old state. */
//TODO: this and renderMove could be added to a class in view directory.
function drawState(state: ChessState, view: BoardView) {
    for(const s of flat(state.board)) {
        if(s.value.piece) {
            view.drawPiece(s.value.piece, s.index);
        }
    }
}

/** 
 * Change the board view to reflect the given move event.
 * After renderMoveEvent is called, the view will match the given state. 
 * */
function renderMove(state: ChessState, view: BoardView, lastMove: MoveEvent | undefined, attemptedMove: MoveEvent): void {
    const moveType = classifyMove(lastMove, state, attemptedMove);
    const piece = itemAt(state.board, attemptedMove.startPos).piece!;
    if(['normal', 'pawnSingleForward', 'pawnDoubleForward', 'pawnNormalCapture'].includes(moveType)) {
        view.removePiece(attemptedMove.startPos);
        view.removePiece(attemptedMove.endPos);
        if(piece.name === 'pawn' && isBackRank(piece.color, attemptedMove.endPos)) {
            view.drawPiece({name: 'queen', color: piece.color}, attemptedMove.endPos);
        } else {
            view.drawPiece(piece, attemptedMove.endPos);
        }
    } else if(moveType === 'pawnPassantCapture') {
        view.removePiece(attemptedMove.startPos);
        view.removePiece(lastMove!.endPos);
        view.drawPiece(piece, attemptedMove.endPos);
    }
}