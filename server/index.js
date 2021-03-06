const express = require('express');
const request = require('request');
const api = require('./api.wire.js');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const socket = require('socket.io');
const config = require('../webpack.config.js');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const userRoute = require('./user/userRoute')
const webpackDevPort = 3000;

const app = express();
const http = require('http').Server(app);
const io = socket(http);
const db = require('./db');

app.use(bodyParser.json());
app.use(express.static(path.resolve('./')));

const userRouter = express.Router();
app.use('/api/user', userRouter);
userRoute(userRouter);

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
}).listen(webpackDevPort, 'localhost', (err, result) => {
  if (err) {
    return console.log(err)
  }
  console.log('listening at localhost' + webpackDevPort)
});

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

http.listen(3000, () => {
  console.log('App is listening on port 3000');
});
