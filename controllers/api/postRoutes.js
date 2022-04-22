const router = require("express").Router();
const { Post } = require("../../models");
const withAuth = require("../../utils/auth");


router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const newPost = await Post.create(body);

    res.status(200).json(newPost);

  } catch (err) {
    console.error(err);

    res.status(500).json(err);
  }

  
});


router.get("/", withAuth, async (req, res) => {
  try {
    const dbPostData = await Post.findAll({
      where: {
        user_id: req.session.user_id,
      },
    });

    if (!dbPostData) {
      res.status(400).json({ message: "ERROR - no posts found!" });
      return dbPostData;
    }

    const posts = postData.map((post) => post.get({ plain: true }));
    res.status(200).json(posts);

    res.render({
      layout: "dashboard",
      posts,
    });

  } catch (err) {
    res.redirect("login");
  }
});

module.exports = router;