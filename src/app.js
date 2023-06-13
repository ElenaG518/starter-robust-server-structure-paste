const express = require("express");
const morgan = require("morgan");
const usersRouter = require("./users/users.router");
const pastesRouter = require("./pastes/pastes.router");

const app = express();
app.use(express.json());
app.use(morgan("dev"));



// handlers
app.use("/users", usersRouter);
app.use("/pastes", pastesRouter);

// TODO: Follow instructions in the checkpoint to implement ths API.

// Not found handler
app.use((request, response, next) => {
  next(`Not found: ${request.originalUrl}`);
});

// Error handler
app.use((error, request, response, next) => {
  console.error("error ", error);
  const { status = 500, message = "Something went wrong!" } = error;
  response.status(status).json({ error: message });
});

module.exports = app;
