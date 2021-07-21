import { createTestGroup } from "../../test-helpers/test-execution.js";
import { createEmitter, Emitter } from "./emitter.js";

let emitter: Emitter<string>;

function hasSubs(len: number): boolean {
    return emitter.subscribers.length === len;
}

const tg = createTestGroup('Emitter Testing', ()=> {
    emitter = createEmitter<string>();
});

tg.add('it adds subs to subscriber array', () => {
    emitter.subscribe(()=>{});
    emitter.subscribe(()=>{});
    emitter.subscribe(()=>{});
    return hasSubs(3);
});

tg.add('it does not subscribe multiple times with the same function', () => {
    const func = () => {};
    emitter.subscribe(func);
    emitter.subscribe(func);
    emitter.subscribe(func);
    return hasSubs(1);
});

tg.add('unsubscribing', () => {
    const func1 = () => {};
    const func2 = () => {};

    emitter.subscribe(func1);
    emitter.subscribe(func2);
    if(!hasSubs(2)) {
        return false;
    }

    emitter.unsubscribe(func1);
    if(!hasSubs(1)) {
        return false;
    }

    emitter.unsubscribe(func2); 
    return hasSubs(0);
});

tg.add('publishing', () => {
    let func1Message = '';
    const func1 = (event: string) => {
        func1Message = event;
    };
    let func2Message = '';
    const func2 = (event: string) => {
        func2Message = event;
    };
    emitter.subscribe(func1);
    emitter.subscribe(func2);

    emitter.publish('hello');

    return func1Message === 'hello' && func2Message === 'hello';
});

tg.add('publishing and unsubscribing', () => {
    let callCount = 0;
    const incCount = () => {
        callCount++;
    };

    emitter.subscribe(incCount);
    emitter.publish('a');
    emitter.publish('b');
    if(callCount !== 2) {
        return false;
    }

    emitter.unsubscribe(incCount);
    emitter.publish('a');
    return callCount === 2;
});

tg.execute();