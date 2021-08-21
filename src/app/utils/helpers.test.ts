import { createTestGroup } from "../../testing/test-execution.js";
import { arrayEquals } from "../../testing/test-helpers.js";
import { Color, Position } from "../game/models.js";
import { BOARD_SIZE } from "../view/boardView.js";
import { addPositions, clone, constructBoard, flat, itemAt, oppositeColor, posColor, posEquals, posSequence } from "./helpers.js";

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

tg.execute();