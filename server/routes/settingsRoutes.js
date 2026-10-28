const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const {
  getGitRemote,
  saveGitRemote,
  deleteGitRemote,
} = require("../controllers/settingsController");

const router = express.Router();

router.use(protect);

router.route("/git-remote")
  .get(getGitRemote)
  .put(saveGitRemote)
  .delete(deleteGitRemote);

module.exports = router;
