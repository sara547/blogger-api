const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");

const User = require("../controllers/user");

// show Followers
router.get("/followers", auth, async (req, res, next) => {
  try {
    const followers = await User.findMyFollowers(req.user.id);

    if (!followers) {
      res.send("No Followers");
    }

    res.json(followers);
  } catch (e) {
    next(e);
  }
});

//get All users
router.get("/", auth, async (req, res, next) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (e) {
    next(e);
  }
});

// create new user Account
router.post("/register", async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (e) {
    next(e);
  }
});

// user login
router.post("/login", async (req, res, next) => {
  const { body } = req;
  try {
    const token = await User.login(body);
    res.json(token);
  } catch (e) {
    next(e);
  }
});

// update user information
router.patch("/update", auth, async (req, res, next) => {
  const Id = req.user.id;
  const body = req.body;

  try {
    const user = await User.updateUser(Id, body);
    res.json(user);
  } catch (e) {
    next(e);
  }
});

// find user by Username
router.get("/name/:username", auth, async (req, res, next) => {
  try {
    console.log(req.user.id);
    const user = await User.findUsersByName(req.params.username);

    res.json(user);
  } catch (e) {
    next(e);
  }
});

// show user's Profile
router.get("/profile", auth, async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (e) {
    next(e);
  }
});

// show Followers
router.get("/followers", auth, async (req, res, next) => {
  try {
    const followers = await User.findMyFollowers(req.user.id);

    res.json(followers);
  } catch (e) {
    next(e);
  }
});

// find user by name
router.get("/:id", auth, async (req, res, next) => {
  try {
    const user = await User.findUserById(req.params.id);

    res.json(user);
  } catch (e) {
    next(e);
  }
});

// follow specific user
router.post("/follow/:id", auth, async (req, res, next) => {
  try {
    const ID = req.params.id;
    if (ID == req.user.id) {
      res.send("Cannot Follow yourself");
      return;
    }

    const user = await User.findUserById(ID);
    const index = user.following.findIndex((e) => {
      return req.user.id == e;
    });

    if (index == -1) {
      user.following.push(req.user.id);
      const updated = await User.updateUser(ID, user);
      res.json(updated);
    }

    res.send("Already Follow");
  } catch (e) {
    next(e);
  }
});

// show Followers
router.get("/followers", auth, async (req, res, next) => {
  try {
    const followers = await User.findMyFollowers(req.user.id);

    if (!followers) {
      res.send("No Followers");
      return;
    }

    res.json(followers);
  } catch (e) {
    next(e);
  }
});

// unfollow
router.patch("/unfollow/:id", auth, async (req, res, next) => {
  try {
    const ID = req.params.id;
    if (ID == req.user.id) {
      res.send("Cannot unFollow yourself");
    }
    const user = await User.findUserById(ID);
    const index = user.following.findIndex((e) => {
      return req.user.id == e;
    });

    if (index != -1) {
      user.following.splice(index, 1);
      const updated = await User.updateUser(ID, user);
      res.json(updated);
    }

    res.send("You Already unfollow");
  } catch (e) {
    next(e);
  }
});

router.delete("/delete", auth, async (req, res, next) => {
  try {
    const user = await User.deleteUserByID(req.user.id);
    res.json(user);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
