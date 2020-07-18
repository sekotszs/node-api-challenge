const express = require("express");
const helmet = require("helmet");
const server = express();

const projectRouter = require("./routers/projectRouter");

server.use(express.json());
server.use(logger);
server.use(helmet());

server.get("/", (req, res) => {
  res.send(`Node-API-Challenge: Zoe Stokes`);
});

server.use("/api/projects", projectRouter);

function logger(req, res, next) {
  console.log(req.method);
  console.log(req.url);
  console.log(Date.now());
  next();
}

module.exports = server;
