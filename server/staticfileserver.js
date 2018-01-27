const express = require('express');
const path = require('path');

const server = express();
const PORT = 3000;

server.listen(PORT, () => console.log('Serving static files on port ', PORT));