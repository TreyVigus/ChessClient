## Running
npm run start
- What does this do?
    - It starts nodemon, which will watch for changes to files (see "ext" in nodemon.json for which files).
    - When nodemon detects a file, nodemon will 
        - run 'tsc', which makes typescript compile .ts files in the src directory and output to the build directory.
        - run moveFiles.js, which moves files tsc didn't handle to the build directory.
        - Serve the app by running server.js from the build directory (compiled from server.ts).

## Testing
npm run test
- What does this do?
    - It starts nodemon, just like in npm run start.
    - When nodemon detects a file, nodemon will 
        - run 'tsc', which will do just as described in npm run start, including compiling all spec.ts files to spec.js files.
        - execute runTests.js, which executes all files of the form .test.js from the build/app directory.
           
