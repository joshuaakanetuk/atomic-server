const express = require("express");
const CellsService = require("./cells-service");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const cellsRouter = express.Router();
const jsonParser = express.json();
const { requireAuth } = require("../middleware/jwt-auth");

cellsRouter
  .route("/")
  //   .all(requireAuth)
  .get((req, res, next) => {
    console.log(req.user)
    if (1 === 2)
      CellsService.getCellsForUser(req.app.get("db"), req.user.id)
        .then((cell) => {
          res.json(cell);
        })
        .catch(next);
    else
      CellsService.getAllCells(req.app.get("db"))
        .then((cell) => {
          res.json(cell);
        })
        .catch(next);
  });


module.exports = cellsRouter;