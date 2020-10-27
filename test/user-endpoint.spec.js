const { assert, expect } = require("chai");
const knex = require("knex");
const app = require("../src/app.js");
const helpers = require("./test-helpers");

describe("Users Endpoints", function () {
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

  describe(`GET /api/users/:users_id`, () => {
    before("insert users", () =>
      helpers.seedCellTables(db, testUsers, testCells)
    );

    it(`retrives a user`, function () {
      const testUser = testUsers[0];
      return supertest(app)
        .get(`/api/users/${testUser.id}`)
        .set("Authorization", helpers.makeAuthHeader(testUser))
        .expect(200)
        .expect((res) => {
          expect(res.body.full_name).to.eql(testUser.full_name);
          expect(res.body.profile_image).to.eql(testUser.profile_image);
        });
    });
  });

  describe(`POST /api/users`, () => {
    it(`registers a user `, function () {
      const testUser = {
        user_name: "admin",
        password: "passwOrd1@",
        full_name: "I'm Admin",
        profile_image: "https://place-hold.it/300",
        type: "user",
      };

      return supertest(app)
        .post(`/api/users`)
        .set("Authorization", helpers.makeAuthHeader(testUser))
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body).to.have.property("id");
          expect(res.body).to.have.property("date_created");
          expect(res.body.profile_image).to.eql(testUser.profile_image);
          expect(res.body.type).to.eql(testUser.type);
          expect(res.body.full_name).to.eql(testUser.full_name);
          expect(res.body.user_name).to.eql(testUser.user_name);
        });
    });
  });
});
