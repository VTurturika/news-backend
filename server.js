'use strict';

const restify = require('restify');
const server = restify.createServer();
const port = process.env.PORT || 8080;

server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());
server.use(restify.plugins.fullResponse());

server.get('/', (req, res) => {
  res.end('hello');
});

server.listen(port, () => {
  console.log(`${server.name} listening at ${port}`);
});