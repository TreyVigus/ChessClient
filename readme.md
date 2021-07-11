To run the project, use npm run start

What does this do?
- It starts nodemon, which will watch for changes to .ts and .js files.
- If a .ts or .js file changes, nodemon will 
    1.) run 'tsc', which makes typescript compile .ts files in the src directory and output to the build directory.
    2.) run server.js from the build directory (compiled from server.ts).
- Then, 
- TODO: after typescript compiles, need to start the server which is located in the build directory.


#### Gotchas
- Due to an inssue with typescript https://github.com/microsoft/TypeScript/issues/16577,
    imports won't be changed to include the file extension (ES6 requires folder/file.txt vs
    TS which requires folder/file). Unfortunately, .js extensions must be manually added in the .ts
    files.


Sources:
https://www.npmjs.com/package/ts-node

https://jestjs.io/
https://jestjs.io/docs/getting-started
https://github.com/kulshekhar/ts-jest"# ChessClient" 
