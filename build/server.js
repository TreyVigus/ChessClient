"use strict";
//https://expressjs.com/en/starter/basic-routing.html
//https://developer.okta.com/blog/2018/11/15/node-express-typescript
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app = express_1.default();
var port = 3000;
//https://expressjs.com/en/starter/static-files.html
//TODO: changes to non-html files won't be detected since we serve from build folder.
// app.use(express.static('build/app'));
// app.get('/', (req, res) => {res.send('cya')});
app.listen(port, function () {
    console.log("Example app listening at http://localhost:" + port);
});
//TODO: detecting changes is too slow, probably because ts must compile all .js files
//      may be faster to compile specific files, see https://github.com/remy/nodemon/issues/1239
