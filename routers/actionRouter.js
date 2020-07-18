const express = require("express");
const router = express.Router();
const db = require("../data/helpers/actionModel");

router.post("/", validateAction, validateID, (req, res) => {
  db.insert(req.body)
    .then((result) => res.status(201).send(result))
    .catch((error) => {
      res.status(500).json({ error: "Error connecting to the database" });
    });
});

router.get("/", (req, res) => {
  db.get()
    .then((result) => res.status(200).json(result))
    .catch((error) => {
      res.status(500).json({ message: "There was an error to the database" });
    });
});

router.get("/:id", validateID, (req, res) => {
  res.status(200).json(req.action);
});

router.put("/:id", validateID, (req, res) => {
  db.update(req.params.id, req.body)
    .then((result) => res.status(200).json(result))
    .catch((error) => {
      res.status(500).json({ message: "There was an error to the database" });
    });
});

router.delete("/:id", validateID, (req, res) => {
  db.remove(req.params.id)
    .then((result) =>
      result === 1
        ? res.status(204).send()
        : res.status(500).json({ message: "Action could not be deleted!" })
    )
    .catch((err) => {
      res.status(500).json({ error: "Error connecting to the database" });
    });
});

//middleware
function validateID(req, res, next) {
  db.get(req.params.id)
    .then((result) => {
      if (result.length === 0) {
        res.status(404).json({ message: "The Action ID does not exist" });
      } else {
        req.action = result;
        next();
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "There was an error to the database" });
    });
}

function validateAction(req, res, next) {
  if (!req.body.project_id) {
    res.status(400).json({ message: "Provide an ID" });
  } else {
    next();
  }
}

module.exports = router;
