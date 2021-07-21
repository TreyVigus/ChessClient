import { createTestGroup } from "../../test-helpers/test-execution.js";
import { createEmitter } from "./emitter.js";
const emitter = createEmitter<string>();

const tg = createTestGroup(()=> {
    console.log('ran test');
});

tg.add('it does something', () => {
    const sum = 2 + 4;
    return sum === 6;
});


tg.add('it does something else', () => {
    const sum = 2 + 4;
    return sum === 4;
});

tg.execute();