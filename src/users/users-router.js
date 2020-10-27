const express = require("express");
const path = require("path");
const UsersService = require("./users-service");

const usersRouter = express.Router();
const jsonBodyParser = express.json();
const { requireAuth } = require("../middleware/jwt-auth");

// used to route user requests
usersRouter
  .route("/")
  .get(requireAuth, (req, res, next) => {
    res.json({
      full_name: req.user.full_name,
      profile_image: req.user.profile_image,
    });
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { password, user_name, full_name } = req.body;
    for (const field of ["full_name", "user_name", "password"])
      if (!req.body[field]) {
        var errvar = "";
        switch (field) {
          case "full_name":
            errvar = "Please enter your brand's name.";
          case "user_name":
            errvar = "Please enter your user.";
          case "password":
            errvar =
              "Password must be at least 8 character and contain 1 upper case, lower case, number and a special character.";
        }
        return res.status(400).json({
          error: errvar,
        });
      }
    const passwordError = UsersService.validatePassword(password);

    if (passwordError) return res.status(400).json({ error: passwordError });

    UsersService.hasUserWithUserName(req.app.get("db"), user_name)
      .then((hasUserWithUserName) => {
        if (hasUserWithUserName)
          return res.status(400).json({ error: `Username already taken` });

        return UsersService.hashPassword(password).then((hashedPassword) => {
          const newUser = {
            user_name,
            type: "user",
            password: hashedPassword,
            full_name,
            date_created: "now()",
          };

          return UsersService.insertUser(req.app.get("db"), newUser).then(
            (user) => {
              res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${user.id}`))
                .json(UsersService.serializeUser(user));
            }
          );
        });
      })
      .catch(next);
  });

//  Get info for user and update info
usersRouter
  .route("/:users_id")
  .all(requireAuth)
  .patch(jsonBodyParser, (req, res, next) => {
    UsersService.updateUser(req.app.get("db"), req.params.users_id, req.body)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => console.log(err));
  });

module.exports = usersRouter;
