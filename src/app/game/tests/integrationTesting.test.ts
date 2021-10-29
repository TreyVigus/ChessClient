import { createTestGroup } from "../../../testing/test-execution.js";
import { constructBoard, itemAt, oppositeColor, posSequence } from "../../utils/helpers.js";
import { MoveEvent } from "../../view/boardView.js";
import { cases } from "./integrationCases.test.js";
import { ChessState, Color, Position, Square } from "../models.js";
import { isLegal, makeMove } from "../movements.js";
import { stateEquals } from "../../../testing/test-helpers.js";
import { compareMoves } from "../../ai/moveGenerator.js";

const tg = createTestGroup('Integration Testing');

cases.forEach((c, index) => {
    tg.add(`${c.name ?? index}`, () => {
        return testMoveSequence(c.sequence, c.finalState);
    });
});

tg.execute();

/** 
 * Event loop similar to that of main.ts, except move sequence is prededermined.
 * Test passes if the given endState is reached after applying all moves in the sequence.
 * */
function testMoveSequence(sequence: MoveEvent[], endState: ChessState): boolean {
    let currentState = initialState();
    let lastMove: MoveEvent | undefined = undefined;
    for(let move of sequence) {
        if(isLegal(lastMove, currentState, move)) {
            currentState = makeMove(lastMove, currentState, move);
            lastMove = move;

            const color: Color = oppositeColor(itemAt(currentState.board, move.endPos).piece!.color);
            if(!compareMoves(lastMove, currentState, color)) {
                return false;
            }
        }
    }
    return stateEquals(currentState, endState);
}

// TODO: copied and pasted this from main.ts, importing will cause errors.
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