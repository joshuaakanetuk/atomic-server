exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        {
          id: 1,
          user_name: "client",
          full_name: "Test Client",
          password: "password",
          date_created: "2029-01-22T16:28:32.615Z",
          type: "user",
        },
        {
          id: 2,
          user_name: "admin",
          full_name: "Test Admin",
          password: "password",
          date_created: "2029-01-22T16:28:32.615Z",
          type: "admin",
        },
      ]);
    });
};
