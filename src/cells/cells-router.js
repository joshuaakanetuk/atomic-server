const express = require("express");
const CellsService = require("./cells-service");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const cellsRouter = express.Router();
const jsonParser = express.json();
const { requireAuth } = require("../middleware/jwt-auth");

cellsRouter
  .route("/")
    .all(requireAuth)
  .get((req, res, next) => {
    console.log(req.user);
    if (req.user.type === 'user')
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
  })
  .post(jsonParser, (req, res, next) => {
    const {
      type,
      verb,
      number,
      unit,
      forBool,
      comment,
    } = req.body;
    const newCell = {
      id: uuidv4(),
      type,
      verb,
      number: number || false,
      unit: unit || false,
      comment,
      forBool,
      date_created: new Date(),
      user_id: req.user.id,
    };

    // validation for proper data model
    for (const [key, value] of Object.entries(newCell)) {
      if (value == null || value == undefined) {
        console.log(key)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }

    CellsService.insertCell(req.app.get("db"), newCell)
      .then((cell) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${cell.id}`))
          .json(cell);
      })
      .catch(next);
  });

  cellsRouter
  .route("/:cell_id")
  .all(requireAuth)
  .all(checkCellExists)
  .get((req, res, next) => {
    if (req.user.id !== req.cell.user_id)
      return res.status(400).json({
        error: { message: `You dont have access to this cell.` },
      });
    res.json(req.cell);
  })
  .patch(jsonParser, (req, res, next) => {
    let cell = req.cell;
    const {
      id,
      type,
      verb,
      number,
      unit,
      forBool,
      date_created,
      comment,
    } = req.body;
    let newCell = {};
    const keys = {
      id,
      type,
      verb,
      number,
      unit,
      forBool,
      date_created,
      comment,
    };

    newCell = keys;

    // Checking submitted object for length, user type

    const numberOfValues = Object.values(keys).filter(Boolean).length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain one of the following: ${Object.keys(
            keys
          ).join(", ")}`,
        },
      });
    }

    // removes superfluous keys
    Object.keys(newCell).forEach((key) =>
      newCell[key] === undefined ? delete newCell[key] : {}
    );

    CellsService.updateCell(
      req.app.get("db"),
      req.params.cell_id,
      newCell
    )
      .then((pp) => {
        res.json(pp);
      })
      .catch(next);
  });


  async function checkCellExists(req, res, next) {
    try {
      const cell = await CellsService.getById(
        req.app.get("db"),
        req.params.cell_id
      );
  
      if (!cell)
        return res.status(404).json({
          error: `Cell doesn't exist`,
        });
      req.cell = cell;
      next();
    } catch (error) {
      next(error);
    }
  }

module.exports = cellsRouter;
