## About
This provides a user interface to play against a chess bot.  The bot runs the minimax algorithm in a web worker. 
## Running
**npm run start**
- This starts nodemon, which will watch for changes to files (see nodemon.json).
- When nodemon detects a file, it will 
    - run 'tsc', which makes typescript compile .ts files in the src directory and output to the build directory.
    - run moveFiles.js, which moves files tsc didn't handle to the build directory.
    - Serve the app by running server.js from the build directory (compiled from server.ts).
## Testing
**npm run test**
- This starts nodemon, just like npm run start.
- When nodemon detects a file, it will 
    - run 'tsc', which will compile all spec.ts files to spec.js files.
    - execute runTests.js, which executes all files of the form .test.js from the build/app directory.
