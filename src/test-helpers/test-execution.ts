export type TestGroup = {
    /** Name of the test group, will be used to print to console. */
    name: string,
    /** Add a new test to the group. */
    add: (testName: string, testLogic: () => boolean) => void,
    /** Execute all tests in the group. */
    execute: () => void
}

export function createTestGroup(name: string, beforeEach?: () => void): TestGroup {
    const tests: Test[] = [];

    const add = (testName: string, testLogic: () => boolean) => {
        tests.push({
            testName: testName,
            testLogic: testLogic
        });
    };

    const execute = () => {
        console.log(`-------------START TEST GROUP: ${name}-------------`);

        tests.forEach(test => {
            if(beforeEach) {
                beforeEach();
            };

            let passed = true;
            try {
                passed = test.testLogic();
            } catch {
                passed = false;
            }
            
            if(!passed) {
                console.error(`TEST FAILED: ${test.testName}`);
            }
        });

        console.log(`-------------End TEST GROUP: ${name}------------------`);
    };

    return { name, add, execute };
}

/** Check if two array elements are equal. If equal function is not provided, will just use === */
//TODO: move to separate file
//TODO: make a way to expect an exception to occur.
export function arrayEquals<T>(a: T[], b: T[], equal?: (aEl: T, bEl: T) => boolean): boolean {
    if(a.length !== b.length) {
        return false;
    }
    for(let i = 0; i < a.length; i++) {
        if(equal) {
            if(!equal(a[i], b[i])) {
                return false;
            }
        } else {
            if(a[i] !== b[i]) {
                return false;
            }
        }
    }
    return true;
}

type Test = {
    testName: string,
    testLogic: () => boolean
}