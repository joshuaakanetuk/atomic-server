const xss = require("xss");

const CellsService = {
  getAllCells(db) {
    return db.from("cells").select("*");
  },
  getCellsForUser(db, user_id) {
    return db.from("cells").select("*").where("cells.user_id", user_id);
  },
  getById(db, id) {
    return db.from("cells").select("*").where("cells.id", id).first();
  },
  insertCell(db, newCell) {
    return db
      .insert(newCell)
      .into("cells")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  updateCell(db, id, newNoteFields) {
    return db
      .from("cells")
      .where({ id })
      .update(newNoteFields)
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  deleteCell(db, id) {
    return db.from("cells").where({ id }).delete();
  },
};

module.exports = CellsService;
