console.log('hello ts loaded');

export function doSomething() {
    console.log('calling do somethign from hello.ts');
}

export type Person = {
    name: string,
    age: number
}