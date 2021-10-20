import { createTestGroup } from "../../../testing/test-execution.js";
import { arrayEquals, stateEquals } from "../../../testing/test-helpers.js";
import { ChessState, Color, Position } from "../../game/models.js";
import { BOARD_SIZE } from "../../view/boardView.js";
import { addPositions, clone, cloneState, constructBoard, flat, itemAt, oppositeColor, posColor, posEquals, posSequence } from "../helpers.js";

const tg = createTestGroup('Helpers Testing', ()=> {
});

tg.add('oppositeColor', () => {
    return oppositeColor('black') === 'white' && oppositeColor('white') === 'black';
});

tg.add('posColor', () => {
   const tests: {pos: Position, color: Color}[] = [
       { pos: [0,0], color: 'white' },
       { pos: [4,2], color: 'white' },
       { pos: [7,1], color: 'white' },
       { pos: [4,1], color: 'black' },
       { pos: [3,6], color: 'black' },
       { pos: [0,7], color: 'black' },
   ]

   const failing = tests.filter(test => posColor(test.pos) !== test.color);
   return failing.length === 0;
});

tg.add('posEquals', () => {
    return posEquals([0,0], [0,0]) && posEquals([4,5], [4, 5]) && !posEquals([2,3], [3, 2]);
});

tg.add('posSequence', () => {
    const seq = posSequence();

    if(seq.length !== 64) {
        return false;
    }

    if(!posEquals(seq[0],[0,0])) {
        return false;
    }

    if(!posEquals(seq[63], [7,7])) {
        return false;
    }

    return true;
});

tg.add('constructBoard', () => {
    const board = constructBoard((pos: Position) => pos);
    if(board.length !== BOARD_SIZE) {
        return false;
    }

    const seq = posSequence();
    seq.forEach(pos => {
        const [i, j] = pos;
        if(!posEquals(pos, board[i][j])) {
            throw 'fail';
        }
        if(board[i].length !== BOARD_SIZE) {
            throw 'fail';
        }
    });

    return true;
});

tg.add('flattenedBoard', () => {
    const board = constructBoard((pos: Position) => false);
    const flattened: {index: Position, value: boolean}[] = [];
    for(const tile of flat(board)) {
        flattened.push(tile);
    }

    const expected: {index: Position, value: boolean}[] = posSequence().map(pos => {
        return {
            index: pos,
            value: false
        }
    });


    return arrayEquals(flattened, expected, (aEl, bEl) => {
        return posEquals(aEl.index, bEl.index) && aEl.value === bEl.value;
    });
});

tg.add('constructBoard', () => {
    const board = constructBoard((pos: Position) => pos);
    
    if(!posEquals([0,0], itemAt(board, [0,0]))) {
        return false;
    }

    if(!posEquals([7, 7], itemAt(board, [7, 7]))) {
        return false;
    }

    //TODO: add testing for error cases

    return true;
});

tg.add('clone basic object', () => {
    const obj = {hi: 5, bye: 'abc'};
    const objCopy = clone(obj);
    objCopy.hi = 4;
    objCopy.bye = 'blah';
    if(obj.hi !== 5 && obj.bye !== 'abc') {
        return false;
    }
    return true;
});

tg.add('clone nested object', () => {
    const obj = {
        hi: 5, 
        child: {
            prop: 26
        }
    };
    const objCopy = clone(obj);
    objCopy.hi = 4;
    objCopy.child.prop = 45;
    if(obj.hi !== 5 && obj.child.prop !== 26) {
        return false;
    }
    return true;
});

tg.add('clone array', () => {
    const obj = {
        child: [1, 2, 3]
    }

    const copy = clone(obj);
    copy.child[0] = 4;
    if(!arrayEquals(obj.child, [1,2,3])) {
        return false;
    }

    return true;
});

tg.add('addPositions', () => {
    let sum1 = addPositions(
        [1, 2],
        [2, 3],
        [4, 5]
    );
    if(!posEquals(sum1, [7, 10])) {
        return false;
    }

    let sum2 = addPositions(
        [1, 2],
    );
    if(!posEquals(sum2, [1, 2])) {
        return false;
    }

    return true;
});

tg.add('clone state has same string rep', () => {
    const state: ChessState = {"board":[[{"position":[0,0],"piece":{"color":"black","name":"rook"}},{"position":[0,1],"piece":{"color":"black","name":"knight"}},{"position":[0,2],"piece":{"color":"black","name":"bishop"}},{"position":[0,3],"piece":{"color":"black","name":"queen"}},{"position":[0,4],"piece":{"color":"black","name":"king"}},{"position":[0,5],"piece":{"color":"black","name":"bishop"}},{"position":[0,6],"piece":{"color":"black","name":"knight"}},{"position":[0,7],"piece":{"color":"black","name":"rook"}}],[{"position":[1,0],"piece":{"color":"black","name":"pawn"}},{"position":[1,1],"piece":{"color":"black","name":"pawn"}},{"position":[1,2],"piece":{"color":"black","name":"pawn"}},{"position":[1,3],"piece":{"color":"black","name":"pawn"}},{"position":[1,4],"touched":true},{"position":[1,5],"piece":{"color":"black","name":"pawn"}},{"position":[1,6],"piece":{"color":"black","name":"pawn"}},{"position":[1,7],"piece":{"color":"black","name":"pawn"}}],[{"position":[2,0]},{"position":[2,1]},{"position":[2,2]},{"position":[2,3]},{"position":[2,4]},{"position":[2,5]},{"position":[2,6]},{"position":[2,7]}],[{"position":[3,0]},{"position":[3,1]},{"position":[3,2]},{"position":[3,3]},{"position":[3,4],"piece":{"color":"black","name":"pawn"},"touched":true},{"position":[3,5]},{"position":[3,6]},{"position":[3,7]}],[{"position":[4,0]},{"position":[4,1]},{"position":[4,2]},{"position":[4,3]},{"position":[4,4],"piece":{"color":"white","name":"pawn"},"touched":true},{"position":[4,5]},{"position":[4,6]},{"position":[4,7]}],[{"position":[5,0]},{"position":[5,1]},{"position":[5,2]},{"position":[5,3]},{"position":[5,4]},{"position":[5,5],"piece":{"color":"white","name":"knight"},"touched":true},{"position":[5,6]},{"position":[5,7]}],[{"position":[6,0],"piece":{"color":"white","name":"pawn"}},{"position":[6,1],"piece":{"color":"white","name":"pawn"}},{"position":[6,2],"piece":{"color":"white","name":"pawn"}},{"position":[6,3],"piece":{"color":"white","name":"pawn"}},{"position":[6,4],"touched":true},{"position":[6,5],"piece":{"color":"white","name":"pawn"}},{"position":[6,6],"piece":{"color":"white","name":"pawn"}},{"position":[6,7],"piece":{"color":"white","name":"pawn"}}],[{"position":[7,0],"piece":{"color":"white","name":"rook"}},{"position":[7,1],"piece":{"color":"white","name":"knight"}},{"position":[7,2],"piece":{"color":"white","name":"bishop"}},{"position":[7,3],"piece":{"color":"white","name":"queen"}},{"position":[7,4],"piece":{"color":"white","name":"king"}},{"position":[7,5],"piece":{"color":"white","name":"bishop"}},{"position":[7,6],"touched":true},{"position":[7,7],"piece":{"color":"white","name":"rook"}}]]};
    const clone = cloneState(state);

    if(JSON.stringify(state) !== JSON.stringify(clone)) {
        return false;
    }
    return true;
});

tg.add('cloned state does not modify original piece', () => {
    const state: ChessState = {"board":[[{"position":[0,0],"piece":{"color":"black","name":"rook"}},{"position":[0,1],"piece":{"color":"black","name":"knight"}},{"position":[0,2],"piece":{"color":"black","name":"bishop"}},{"position":[0,3],"piece":{"color":"black","name":"queen"}},{"position":[0,4],"piece":{"color":"black","name":"king"}},{"position":[0,5],"piece":{"color":"black","name":"bishop"}},{"position":[0,6],"piece":{"color":"black","name":"knight"}},{"position":[0,7],"piece":{"color":"black","name":"rook"}}],[{"position":[1,0],"piece":{"color":"black","name":"pawn"}},{"position":[1,1],"piece":{"color":"black","name":"pawn"}},{"position":[1,2],"piece":{"color":"black","name":"pawn"}},{"position":[1,3],"piece":{"color":"black","name":"pawn"}},{"position":[1,4],"touched":true},{"position":[1,5],"piece":{"color":"black","name":"pawn"}},{"position":[1,6],"piece":{"color":"black","name":"pawn"}},{"position":[1,7],"piece":{"color":"black","name":"pawn"}}],[{"position":[2,0]},{"position":[2,1]},{"position":[2,2]},{"position":[2,3]},{"position":[2,4]},{"position":[2,5]},{"position":[2,6]},{"position":[2,7]}],[{"position":[3,0]},{"position":[3,1]},{"position":[3,2]},{"position":[3,3]},{"position":[3,4],"piece":{"color":"black","name":"pawn"},"touched":true},{"position":[3,5]},{"position":[3,6]},{"position":[3,7]}],[{"position":[4,0]},{"position":[4,1]},{"position":[4,2]},{"position":[4,3]},{"position":[4,4],"piece":{"color":"white","name":"pawn"},"touched":true},{"position":[4,5]},{"position":[4,6]},{"position":[4,7]}],[{"position":[5,0]},{"position":[5,1]},{"position":[5,2]},{"position":[5,3]},{"position":[5,4]},{"position":[5,5],"piece":{"color":"white","name":"knight"},"touched":true},{"position":[5,6]},{"position":[5,7]}],[{"position":[6,0],"piece":{"color":"white","name":"pawn"}},{"position":[6,1],"piece":{"color":"white","name":"pawn"}},{"position":[6,2],"piece":{"color":"white","name":"pawn"}},{"position":[6,3],"piece":{"color":"white","name":"pawn"}},{"position":[6,4],"touched":true},{"position":[6,5],"piece":{"color":"white","name":"pawn"}},{"position":[6,6],"piece":{"color":"white","name":"pawn"}},{"position":[6,7],"piece":{"color":"white","name":"pawn"}}],[{"position":[7,0],"piece":{"color":"white","name":"rook"}},{"position":[7,1],"piece":{"color":"white","name":"knight"}},{"position":[7,2],"piece":{"color":"white","name":"bishop"}},{"position":[7,3],"piece":{"color":"white","name":"queen"}},{"position":[7,4],"piece":{"color":"white","name":"king"}},{"position":[7,5],"piece":{"color":"white","name":"bishop"}},{"position":[7,6],"touched":true},{"position":[7,7],"piece":{"color":"white","name":"rook"}}]]};
    const clone = cloneState(state);

    itemAt(clone.board, [0, 1]).piece!.name = 'king';
    itemAt(clone.board, [0, 1]).piece!.color = 'white';

    if(itemAt(state.board, [0, 1]).piece!.name === 'king' || itemAt(state.board, [0, 1]).piece!.color === 'white') {
        return false;
    }

    return true;
});

tg.add('cloned state does not modify original touched', () => {
    const state: ChessState = {"board":[[{"position":[0,0],"piece":{"color":"black","name":"rook"}},{"position":[0,1],"piece":{"color":"black","name":"knight"}},{"position":[0,2],"piece":{"color":"black","name":"bishop"}},{"position":[0,3],"piece":{"color":"black","name":"queen"}},{"position":[0,4],"piece":{"color":"black","name":"king"}},{"position":[0,5],"piece":{"color":"black","name":"bishop"}},{"position":[0,6],"piece":{"color":"black","name":"knight"}},{"position":[0,7],"piece":{"color":"black","name":"rook"}}],[{"position":[1,0],"piece":{"color":"black","name":"pawn"}},{"position":[1,1],"piece":{"color":"black","name":"pawn"}},{"position":[1,2],"piece":{"color":"black","name":"pawn"}},{"position":[1,3],"piece":{"color":"black","name":"pawn"}},{"position":[1,4],"touched":true},{"position":[1,5],"piece":{"color":"black","name":"pawn"}},{"position":[1,6],"piece":{"color":"black","name":"pawn"}},{"position":[1,7],"piece":{"color":"black","name":"pawn"}}],[{"position":[2,0]},{"position":[2,1]},{"position":[2,2]},{"position":[2,3]},{"position":[2,4]},{"position":[2,5]},{"position":[2,6]},{"position":[2,7]}],[{"position":[3,0]},{"position":[3,1]},{"position":[3,2]},{"position":[3,3]},{"position":[3,4],"piece":{"color":"black","name":"pawn"},"touched":true},{"position":[3,5]},{"position":[3,6]},{"position":[3,7]}],[{"position":[4,0]},{"position":[4,1]},{"position":[4,2]},{"position":[4,3]},{"position":[4,4],"piece":{"color":"white","name":"pawn"},"touched":true},{"position":[4,5]},{"position":[4,6]},{"position":[4,7]}],[{"position":[5,0]},{"position":[5,1]},{"position":[5,2]},{"position":[5,3]},{"position":[5,4]},{"position":[5,5],"piece":{"color":"white","name":"knight"},"touched":true},{"position":[5,6]},{"position":[5,7]}],[{"position":[6,0],"piece":{"color":"white","name":"pawn"}},{"position":[6,1],"piece":{"color":"white","name":"pawn"}},{"position":[6,2],"piece":{"color":"white","name":"pawn"}},{"position":[6,3],"piece":{"color":"white","name":"pawn"}},{"position":[6,4],"touched":true},{"position":[6,5],"piece":{"color":"white","name":"pawn"}},{"position":[6,6],"piece":{"color":"white","name":"pawn"}},{"position":[6,7],"piece":{"color":"white","name":"pawn"}}],[{"position":[7,0],"piece":{"color":"white","name":"rook"}},{"position":[7,1],"piece":{"color":"white","name":"knight"}},{"position":[7,2],"piece":{"color":"white","name":"bishop"}},{"position":[7,3],"piece":{"color":"white","name":"queen"}},{"position":[7,4],"piece":{"color":"white","name":"king"}},{"position":[7,5],"piece":{"color":"white","name":"bishop"}},{"position":[7,6],"touched":true},{"position":[7,7],"piece":{"color":"white","name":"rook"}}]]};
    const clone = cloneState(state);

    itemAt(clone.board, [0, 0]).touched = true;

    if(itemAt(state.board, [0, 0]).touched) {
        return false;
    }

    return true;
});

tg.add('clone state deep check', () => {
    const state: ChessState = {"board":[[{"position":[0,0],"piece":{"color":"black","name":"rook"}},{"position":[0,1],"piece":{"color":"black","name":"knight"}},{"position":[0,2],"piece":{"color":"black","name":"bishop"}},{"position":[0,3],"piece":{"color":"black","name":"queen"}},{"position":[0,4],"piece":{"color":"black","name":"king"}},{"position":[0,5],"piece":{"color":"black","name":"bishop"}},{"position":[0,6],"piece":{"color":"black","name":"knight"}},{"position":[0,7],"piece":{"color":"black","name":"rook"}}],[{"position":[1,0],"piece":{"color":"black","name":"pawn"}},{"position":[1,1],"piece":{"color":"black","name":"pawn"}},{"position":[1,2],"piece":{"color":"black","name":"pawn"}},{"position":[1,3],"piece":{"color":"black","name":"pawn"}},{"position":[1,4],"touched":true},{"position":[1,5],"piece":{"color":"black","name":"pawn"}},{"position":[1,6],"piece":{"color":"black","name":"pawn"}},{"position":[1,7],"piece":{"color":"black","name":"pawn"}}],[{"position":[2,0]},{"position":[2,1]},{"position":[2,2]},{"position":[2,3]},{"position":[2,4]},{"position":[2,5]},{"position":[2,6]},{"position":[2,7]}],[{"position":[3,0]},{"position":[3,1]},{"position":[3,2]},{"position":[3,3]},{"position":[3,4],"piece":{"color":"black","name":"pawn"},"touched":true},{"position":[3,5]},{"position":[3,6]},{"position":[3,7]}],[{"position":[4,0]},{"position":[4,1]},{"position":[4,2]},{"position":[4,3]},{"position":[4,4],"piece":{"color":"white","name":"pawn"},"touched":true},{"position":[4,5]},{"position":[4,6]},{"position":[4,7]}],[{"position":[5,0]},{"position":[5,1]},{"position":[5,2]},{"position":[5,3]},{"position":[5,4]},{"position":[5,5],"piece":{"color":"white","name":"knight"},"touched":true},{"position":[5,6]},{"position":[5,7]}],[{"position":[6,0],"piece":{"color":"white","name":"pawn"}},{"position":[6,1],"piece":{"color":"white","name":"pawn"}},{"position":[6,2],"piece":{"color":"white","name":"pawn"}},{"position":[6,3],"piece":{"color":"white","name":"pawn"}},{"position":[6,4],"touched":true},{"position":[6,5],"piece":{"color":"white","name":"pawn"}},{"position":[6,6],"piece":{"color":"white","name":"pawn"}},{"position":[6,7],"piece":{"color":"white","name":"pawn"}}],[{"position":[7,0],"piece":{"color":"white","name":"rook"}},{"position":[7,1],"piece":{"color":"white","name":"knight"}},{"position":[7,2],"piece":{"color":"white","name":"bishop"}},{"position":[7,3],"piece":{"color":"white","name":"queen"}},{"position":[7,4],"piece":{"color":"white","name":"king"}},{"position":[7,5],"piece":{"color":"white","name":"bishop"}},{"position":[7,6],"touched":true},{"position":[7,7],"piece":{"color":"white","name":"rook"}}]]};
    const clone = cloneState(state);
    return stateEquals(state, clone);
});

tg.execute();