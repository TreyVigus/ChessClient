import { createTestGroup } from "../../test-helpers/test-execution.js";
import { Color, Position } from "../game/models.js";
import { oppositeColor, posColor } from "./helpers.js";

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

function assertColor(pos: Position, expectedColor: Color): boolean {
    return false;
}

tg.execute();