import { createTestGroup } from "../../test-helpers/test-execution.js";
import { constructBoard, flat, itemAt, posEquals } from "../utils/helpers.js";
import { MoveEvent } from "../view/boardView.js";
import { ChessState, Position, Square } from "./models.js";
import { makeMove } from "./movements.js";

//simple state with rook in top left corner
function mockState(): ChessState {
    const board = constructBoard<Square>((pos: Position) => {
        return { 
            position: pos,
            piece: undefined
         };
    });

    board[0][0].piece = {color: 'black', name: 'rook'};

    return { board };
}

const tg = createTestGroup('Movements Testing', ()=> {});

tg.add('makeMove', () => {
    const state = mockState();
    const legalMove: MoveEvent = {
        startPos: [0, 0],
        endPos: [0, 7]
    }

    const newState = makeMove(legalMove, state);

    if(itemAt(newState.board, [0, 0]).piece || !itemAt(newState.board, [0, 0]).touched) {
        return false;
    }
    
    if(!itemAt(newState.board, [0, 7]).piece || !itemAt(newState.board, [0, 7]).touched) {
        return false;
    }

    for(const sq of flat(newState.board)) {
        if(!posEquals(sq.index, [0, 0]) && !posEquals(sq.index, [0, 7])) {
            if(sq.value.piece || sq.value.touched) {
                return false;
            }
        }
    }

    return true;
});

tg.execute();