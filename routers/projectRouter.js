const express = require("express");
const router = express.Router();
const db = require("../data/helpers/projectModel");
const actdb = require("../data/helpers/actionModel");

router.post("/", (req, res) => {
  db.insert(req.body)
    .then((result) => res.status(201).send())
    .catch((error) => {
      res
        .status(500)
        .json({ message: "There was an error connecting to the database" });
    });
});

router.get("/", (req, res) => {
  db.get()
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      res.status(500).json({ error: "Error connecting to the database" });
    });
});

router.get("/:id", validateID, (req, res) => {
  res.status(200).json(req.project);
});

router.get("/:id/actions", validateID, (req, res) => {
  db.getProjectActions(req.params.id)
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      res.status(500).json({ error: "Error connecting to the database" });
    });
});
router.put("/:id", validateID, (req, res) => {
  db.update(req.params.id, req.body)
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      res.status(500).json({ error: "Error connecting to the database" });
    });
});

router.delete("/:id", validateID, (req, res) => {
  db.remove(req.params.id)
    .then((result) =>
      result === 1
        ? res.status(204).send()
        : res.status(500).json({ message: "Project could not be deleted!" })
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
        res.status(404).json({ message: "Project ID does not exist" });
      } else {
        req.project = result;
        next();
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "Error connecting to the database" });
    });
}
module.exports = router;
