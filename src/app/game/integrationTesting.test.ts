import { start } from "repl";
import { createTestGroup } from "../../testing/test-execution";
import { createEmitter } from "../utils/emitter";
import { MoveEvent } from "../view/boardView";
import { initialState } from "./main";
import { ChessState } from "./models";
import { isLegal, makeMove } from "./movements";

const tg = createTestGroup('Integration Testing');

tg.add('1', () => {
   return true;
});

/** 
 * Event loop similar to that of main.ts, except move sequence is prededermined.
 * Test passes if the given endState is reached after applying all moves in the sequence.
 * */
function testMoveSequence(sequence: MoveEvent[], endState: ChessState): boolean {
    let currentState = initialState();
    let lastMove: MoveEvent | undefined = undefined;
    sequence.forEach(move => {
        if(isLegal(lastMove, currentState, move)) {
            currentState = makeMove(lastMove, currentState, move);
            lastMove = move;
        }
    });
    return sameState(currentState, endState);
}

function sameState(a: ChessState, b: ChessState): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
}