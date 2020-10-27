const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: "client",
      full_name: "Test Client",
      password: "Password01!",
      date_created: "2029-01-22T16:28:32.615Z",
      profile_image: '',
      type: "user",
    },
    {
      id: 2,
      user_name: "admin",
      full_name: "Test Admin",
      password: "Password01!",
      date_created: "2029-01-22T16:28:32.615Z",
      profile_image: '',
      type: "admin",
    },
  ];
}

function makeCellArray(users) {
  return [
    {
      id: "0600bbfe-da4a-4c5b-92d1-5c926e541833",
      type: "feel",
      date_created: "2020-10-24T21:24:26.674Z",
      verb: "anxious",
      unit: "false",
      forBool: false,
      number: "false",
      user_id: users[0].id,
      comment: "I did a lot today!",
    },
    {
      id: "a41957a1-9cbd-426e-9436-fb9b9b5d4fb6",
      type: "do",
      date_created: "2020-10-27T14:36:51.676Z",
      verb: "coded",
      unit: "minutes",
      forBool: true,
      number: "5",
      user_id: users[0].id,
      comment: "I'm getting good at this.",
    },
    {
      id: "a49e9a0f-bc34-4ad5-932c-31eed4843c78",
      type: "do",
      date_created: "2020-10-27T14:50:00.517Z",
      verb: "ran",
      unit: "miles",
      forBool: true,
      number: "40",
      user_id: users[0].id,
      comment: "",
    },
    {
      id: "d196725c-a98c-4de4-aad5-1be6b23c7daf",
      type: "feel",
      date_created: "2020-10-27T14:53:58.342Z",
      verb: "😠 angry",
      unit: "false",
      forBool: false,
      number: "false",
      user_id: users[1].id,
      comment: "No comment needed!",
    },
  ];
}

function makeExpectedCell(users, cell) {
  const user = users.find((user) => user.id === cell.user_id);
  return {
    id: cell.id,
      type: cell.type,
      date_created: cell.date_created,
      verb: cell.verb,
      unit: cell.unit,
      forBool: cell.forBool,
      number: cell.number,
      user_id: user.id,
      comment: cell.comment
  };
}

function makeCellFixtures() {
  const testUsers = makeUsersArray();
  const testCells = makeCellArray(testUsers);
  return { testUsers, testCells };
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
        cells,
        users`
  );
}

function seedUsers(db, users) {
  const preppedUsers = users.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));
  return db
    .into("users")
    .insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(`SELECT setval('users_id_seq', ?)`, [users[users.length - 1].id])
    );
}

function seedCellTables(db, users, cells) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async (trx) => {
    await seedUsers(trx, users);
    await trx.into("cells").insert(cells);
  });
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: "HS256",
  });
  return `Bearer ${token}`;
}

module.exports = {
  makeUsersArray,
  makeCellArray,
  makeExpectedCell,
  makeCellFixtures,
  cleanTables,
  seedCellTables,
  seedUsers,
  makeAuthHeader,
};
