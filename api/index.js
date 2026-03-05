const express = require('express');
const app = express();
app.get('/api/ping', (req, res) => res.send('pong'));
module.exports = app;
