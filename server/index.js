'use strict';

const Classes = require("./Classes.js")
const port = 8080

const http = require('http');
const express = require('express');//サーバー
const app = express();
app.use("/", express.static('client'));//clientを返す

const httpServer = http.createServer(app);
let Games = new Classes.Games({server:httpServer})

httpServer.listen(port, () => {
    console.log(`listening on ${port}`)
})
