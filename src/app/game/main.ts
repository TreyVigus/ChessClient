//Handles chess logic (may be broken into sub components however)
//Needs to handle turn-based logic as well (create another file with logic/interface for this)

//Subscribe to MoveEvents from the boardView. The boardView will not check if moves are legal, so this needs to have logic to do so.
//  - Find the Squares corresponding to the startPos and endPos from the MoveEvent
//  - startPos should have a piece on it. endPos may not.
//  - check if the piece on startPos can legally move to endPos (movements.ts will have useful functions for this.)
//      - if legal, make the move
//      - if not, ignore the move

import { constructBoard, flat, itemAt } from "../utils/helpers.js";
import { BoardView, initView, MoveEvent } from "../view/boardView.js";
import { ChessState, Position, Square } from "./models.js";
import { isLegal, makeMove } from "./movements.js";

const view = initView();

let currentState: ChessState = initialState();

drawState(currentState, view);
view.moveEmitter.subscribe((move: MoveEvent) => {
    if(isLegal(move, currentState)) {
        renderMove(currentState, view, move);
        currentState = makeMove(move, currentState);
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
    board[0][7].piece = {color: 'black', name: 'rook'};

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
function renderMove(state: ChessState, view: BoardView, event: MoveEvent): void {
    const piece = itemAt(state.board, event.startPos).piece!;
    view.removePiece(event.startPos);
    view.removePiece(event.endPos);
    view.drawPiece(piece, event.endPos);
}