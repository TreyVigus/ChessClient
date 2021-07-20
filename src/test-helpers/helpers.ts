/**
 * To write a test:
 * 
 * Create a file with a .test.ts extension
 * Run npm run test
 */

export type Test = () => void;

export type TestGroup = {
    beforeEach?: () => void, //executed before each test,
    tests: Test[]
}

export function execute(testGroup: TestGroup) {
    testGroup.tests.forEach(test => {
        if(testGroup.beforeEach) {
            testGroup.beforeEach();
        }
        test();
    });
}

//TODO: add a 'fail' function that will add the test to console output