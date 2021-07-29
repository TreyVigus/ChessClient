import { createTestGroup } from "../../test-helpers/test-execution.js";
import { Color, Position } from "../game/models.js";
import { oppositeColor, posColor, posEquals, posSequence } from "./helpers.js";

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

//probably a worthless test
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

tg.execute();