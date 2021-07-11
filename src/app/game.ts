import { doSomething, Person } from "./hello.js";

console.log('game ts loaded nuce');

doSomething();

const person: Person = {
    name: 'hello',
    age: 25
}

console.log('person: ', person);