require('dotenv').config();

const express = require('express');
const path = require('path');
const parser = require('body-parser');
const morgan = require('morgan');
const PORT = 3000;

const server = express();

server.use(parser.urlencoded({ extended: true }));
server.use(parser.json());
server.use(morgan('tiny'));

server.use(express.static(path.resolve(__dirname, '../client/public')));

server.listen(PORT, () => {
  console.log('Serving static files on port', PORT);
});