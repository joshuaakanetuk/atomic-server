exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex("cells")
      .del()
      .then(function () {
        // Inserts seed entries
        return knex("cells").insert([
            {
                type: "feel",
                verb: "anxious",
                unit: "false",
                forBool: false,
                number: "false",
                user_id: 1,
                comment: "I did a lot today!",
              },
              {
                type: "do",
                verb: "coded",
                unit: "minutes",
                forBool: true,
                number: "5",
                user_id: 1,
                comment: "I'm getting good at this.",
              },
              {
                type: "do",
                verb: "ran",
                unit: "miles",
                forBool: true,
                number: "40",
                user_id: 1,
                comment: "",
              },
              {
                type: "feel",
                verb: "😠 angry",
                unit: "false",
                forBool: false,
                number: "false",
                user_id: 2,
                comment: "No comment needed!",
              }
        ]);
      });
  };
  