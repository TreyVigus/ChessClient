//https://expressjs.com/en/starter/basic-routing.html
//https://developer.okta.com/blog/2018/11/15/node-express-typescript

import express from 'express';

const app = express();
const port = 3000;

//https://expressjs.com/en/starter/static-files.html
app.use(express.static('build/app'));

//uncomment to send basic text
// app.get('/', (req, res) => {res.send('xyx?')});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


//TODO: may need to add custom script to nodemon --exec in package.json to improve some things:
// 1.) non-.ts files need to be moved to the build directory since tsc is handling that.
// 2.) tsc should only run tsc on changed .ts files (and never run tsc if a non .ts file is changed)