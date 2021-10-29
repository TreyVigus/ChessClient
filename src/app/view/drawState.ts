import { ChessState } from "../game/models.js";
import { findKing, inCheck } from "../game/stateQueries.js";
import { flat, posSequence } from "../utils/helpers.js";
import { BoardView } from "./boardView.js";

export function drawState(state: ChessState, view: BoardView) {
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