const express = require("express");
const morgan = require("morgan");
const app = express();
app.use(express.json());
app.use(morgan("dev"));

const pastes = require("./data/pastes-data");

// handler
// app.use("/pastes/:pasteId", (req, res, next) => {
//   const { pasteId } = req.params;
//   const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));

//   if (foundPaste) {
//     res.json({ data: foundPaste });
//   } else {
//     next(`Paste id not found: ${pasteId}`);
//   }
// });

// handler
app.get("/pastes", (req, res) => {
  res.json({ data: pastes });
});

// New middleware function to validate the request body
function bodyHasTextProperty(req, res, next) {
  const { data: { text } = {} } = req.body;
  if (text) {
    return next(); // Call `next()` without an error message if the result exists
  }
  next({
    status: 400,
    message: "A 'text' property is required.",
  });
};

function bodyHasIdProperty(req, res, next) {
  const { pasteId } = req.params;
  const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));
  if (foundPaste) {
    return next();
  }
  next({
    status: 404,
    message: `Paste id not found: ${pasteId}`
  })
}

app.post(
  "/pastes/:pasteId",
  bodyHasIdProperty,
  (req, res) => {
  const { pasteId } = req.params;
   const { data: { name, syntax, exposure, expiration, text, user_id } = {} } = req.body;
  // const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));

  const newPaste = {
      name,
      syntax,
      exposure,
      expiration,
      text,
      user_id,
    };
    pastes.push(newPaste);

  res.status(201).json({ data: newPaste });
});

// Variable to hold the next ID
// Because some IDs may already be used, find the largest assigned ID
let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0);

app.post(
  "/pastes",
  bodyHasTextProperty,
  (req, res) => {
    const { data: { name, syntax, exposure, expiration, text, user_id } = {} } = req.body;
    const newPaste = {
      id: ++lastPasteId, // Increment last ID, then assign as the current ID
      name,
      syntax,
      exposure,
      expiration,
      text,
      user_id,
    };
    pastes.push(newPaste);
    res.status(201).json({ data: newPaste });
  }
);

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
