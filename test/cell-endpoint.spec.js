const { assert, expect } = require("chai");
const knex = require("knex");
const app = require("../src/app.js");
const helpers = require("./test-helpers");

describe("Cell Endpoints", function () {
  let db;

  const { testUsers, testCells } = helpers.makeCellFixtures();

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe(`GET /api/cells`, () => {
    context(`Given no cells`, () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));

      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/api/cells")
          .set("authorization", helpers.makeAuthHeader(testUsers[1]))
          .expect(200, []);
      });
    });

    context("Given there are cells in the database", () => {
      beforeEach("insert cells", () =>
        helpers.seedCellTables(db, testUsers, testCells)
      );

      it("responds with 200 and get all of the cells for user", () => {
        const expectedCells = testCells.map((cell) =>
          helpers.makeExpectedCell(testUsers, cell)
        );
        return supertest(app)
          .get("/api/cells")
          .set("authorization", helpers.makeAuthHeader(testUsers[1]))
          .expect(200, expectedCells);
      });
    });
  });

  describe(`POST /api/cells`, () => {
    beforeEach("insert cells", () =>
      helpers.seedCellTables(db, testUsers, testCells)
    );

    it(`creates an cell, responding with 201 and the new cell`, function () {
      this.retries(3);
      const testCell = testCells[0];
      const testUser = testUsers[0];
      const newCell = {
        name: "A NEW THING",
        type: "feel",
        verb: "anxious",
        number: 3,
        unit: "false",
        forBool: false,
        comment: "I did a lot today!",
        user_id: testUser.id,
      };
      //
      return supertest(app)
        .post("/api/cells")
        .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
        .send(newCell)
        .expect(201)
        .expect((res) => {
          expect(res.body).to.have.property("id");
        });
    });
  });

  describe(`GET /api/cells/:cell_id`, () => {
    context(`Given no cells`, () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));

      it(`responds with 404`, () => {
        const cellId = "d43e7fd1-9ce1-4437-9c5e-e65f52ad6d03";
        return supertest(app)
          .get(`/api/cells/${cellId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: `Cell doesn't exist` });
      });
    });

    context("Given there are cells in the database", () => {
      beforeEach("insert cells", () =>
        helpers.seedCellTables(db, testUsers, testCells)
      );

      it("responds with 200 and the specified cell", () => {
        const cellId = 1;
        const expectedCell = helpers.makeExpectedCell(
          testUsers,
          testCells[cellId - 1]
        );

        return supertest(app)
          .get(`/api/cells/${testCells[cellId - 1].id}`)
          .set("authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedCell);
      });
    });
  });

  describe(`PATCH /api/cells/:cell_id`, () => {
    const testCell = testCells[0];
    const testUser = testUsers[0];
    const updatedCell = {
      number: "4",
      comment: "There's nothing here",
    };

    context(`Given no cells`, () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));

      it(`responds with 404`, () => {
        const cellId = "d43e7fd1-9ce1-4437-9c5e-e65f52ad6d03";
        return supertest(app)
          .patch(`/api/cells/${cellId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .send(updatedCell)
          .expect(404, { error: `Cell doesn't exist` });
      });
    });

    context("Given there are cells in the database", () => {
      beforeEach("insert cells", () =>
        helpers.seedCellTables(db, testUsers, testCells)
      );

      it("responds with 200 and the specified cell", () => {
        const expectedCell = helpers.makeExpectedCell(testUsers, testCells[0]);

        expectedCell.number = updatedCell.number;
        expectedCell.comment = updatedCell.comment;

        return supertest(app)
          .patch(`/api/cells/${testCells[0].id}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .send(updatedCell)
          .expect(200, expectedCell);
      });
    });
  });

  describe(`DELETE /api/cells/:cell_id`, () => {
    context(`Given no cells`, () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));

      it(`responds with 404`, () => {
        const cellId = "d43e7fd1-9ce1-4437-9c5e-e65f52ad6d03";
        return supertest(app)
          .patch(`/api/cells/${cellId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: `Cell doesn't exist` });
      });
    });

    context("Given there are cells in the database", () => {
      beforeEach("insert cells", () =>
        helpers.seedCellTables(db, testUsers, testCells)
      );

      it("responds with 204", () => {
        return supertest(app)
          .delete(`/api/cells/${testCells[0].id}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(204);
      });
    });
  });
});
