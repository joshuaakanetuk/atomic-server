exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex("cells")
      .del()
      .then(function () {
        // Inserts seed entries
        return knex("cells").insert([
            {
                id: "0600bbfe-da4a-4c5b-92d1-5c926e541833",
                type: "feel",
                date_created: "2020-10-24T21:24:26.674Z",
                verb: "anxious",
                unit: "false",
                forBool: false,
                number: "false",
                user_id: 1,
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
                user_id: 1,
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
                user_id: 1,
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
                user_id: 2,
                comment: "No comment needed!",
              }
        ]);
      });
  };
  