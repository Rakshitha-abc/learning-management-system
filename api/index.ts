import express from 'express';
const app = express();
app.get('/api/ping', (req, res) => res.send('pong'));
export default app;
