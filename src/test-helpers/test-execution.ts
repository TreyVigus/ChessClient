export type TestGroup = {
    /** Add a new test to the group. */
    add: (testName: string, testLogic: () => boolean) => void,
    /** Execute all tests in the group. */
    execute: () => void
}

export function createTestGroup(beforeEach?: () => void): TestGroup {
    const tests: Test[] = [];

    const add = (testName: string, testLogic: () => boolean) => {
        tests.push({
            testName: testName,
            testLogic: testLogic
        });
    };

    const execute = () => {
        tests.forEach(test => {
            if(beforeEach) {
                beforeEach();
            };
            const passed = test.testLogic();
            if(!passed) {
                console.error(`${test.testName} failed.`);
            }
        });
    };

    return { add, execute };
}

type Test = {
    testName: string,
    testLogic: () => boolean
}