//Handles chess logic (may be broken into sub components however)
//Needs to handle turn-based logic as well (create another file with logic/interface for this)

//Subscribe to MoveEvents from the boardView. The boardView will not check if moves are legal, so this needs to have logic to do so.
//  - Find the Squares corresponding to the startPos and endPos from the MoveEvent
//  - startPos should have a piece on it. endPos may not.
//  - check if the piece on startPos can legally move to endPos (movements.ts will have useful functions for this.)
//      - if legal, make the move
//      - if not, ignore the move

import { constructBoard, flat } from "../utils/helpers.js";
import { BoardView, initView, MoveEvent } from "../view/boardView.js";
import { ChessState, Move, Position, Square } from "./models.js";
import { isLegal, makeMove } from "./movements.js";

const view = initView();

//TODO: initialize this with the starting state.
let currentState: ChessState = initialState();
drawState(currentState, view);

view.moveEmitter.subscribe((event: MoveEvent) => {
    const attemptedMove = getMove(event, currentState);
    if(attemptedMove && isLegal(attemptedMove, currentState)) {
        currentState = makeMove(attemptedMove, currentState);
        renderMove(view, event);
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

/** Does the board have a piece at the given position? */
function hasPiece(state: ChessState, pos: Position): boolean {
    return !!state.board[pos[0]][pos[1]];
}

/** 
 * Get a Move from the MoveEvent and the ChessState.
 * Return undefined if the board doesn't have a piece on the start square. 
 * */
function getMove(event: MoveEvent, state: ChessState): Move | undefined {
    if(hasPiece(state, event.startPos)) {
        return {
            prevSquare: state.board[event.startPos[0]][event.startPos[1]],
            nextSquare: state.board[event.startPos[0]][event.endPos[1]]
        }
    }

    return undefined;
}

function renderMove(view: BoardView, event: MoveEvent): void {
    //change the board view to reflect the new move
}