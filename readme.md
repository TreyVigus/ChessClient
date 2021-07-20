To run the project, use npm run start
- What does this do?
    - It starts nodemon, which will watch for changes to files (see "ext" in nodemon.json for which files).
    - When nodemon detects a file, nodemon will 
        - run 'tsc', which makes typescript compile .ts files in the src directory and output to the build directory.
        - run moveFiles.js, which moves files tsc didn't handle to the build directory.
        - Serve the app by running server.js from the build directory (compiled from server.ts).

To run tests, use npm run test
- What does this do?
    - It starts nodemon, just like in npm run start.
    - When nodemon detects a file, nodemon will 
        - run 'tsc'
        - TODO: Have node execute runTests.js

#### Gotchas
- Due to an inssue with typescript https://github.com/microsoft/TypeScript/issues/16577,
    imports won't be changed to include the file extension (ES6 requires folder/file.txt vs
    TS which requires folder/file). Unfortunately, .js extensions must be manually added in the .ts
    files.


#### Custom Test Framework
//why? because it's fun.
Files will take the form fileName.test.ts
Test runner will look in the build/src directory and execute "node fileName.test.js" to run the file.

Sources:
https://www.npmjs.com/package/ts-node

https://jestjs.io/
https://jestjs.io/docs/getting-started
https://github.com/kulshekhar/ts-jest"# ChessClient" 
