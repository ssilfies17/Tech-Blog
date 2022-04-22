const router = require("express").Router();
const { User } = require("../../models");


router.post("/", async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(200).json(newUser);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({
      where: { email: req.body.email },
    });

    console.log(userData);

    if (!userData) {
      res
        .status(400)
        .json({ message: "Incorrect email or password" });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect username or password" });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.loggedIn = true;

      res.json({ user: userData, message: "Logged in successfully!" });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});


router.post("/logout", (req, res) => {
  if (req.session.loggedIn) {

    req.session.destroy(() => {
      res.status(204).end();
    });

  } else {
    res.status(404).end();
  }
});

module.exports = router;