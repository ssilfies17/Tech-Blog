const router = require("express").Router();
const { User, Post } = require("../models");
const withAuth = require("../utils/auth");


router.get("/", withAuth, async (req, res) => {
  try {
    const dbPostData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });

    const posts = dbPostData.map((post) => post.get({ plain: true }));
    
    res.render("dashboard", {
      posts,
      loggedIn: req.session.loggedIn,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});



module.exports = router;