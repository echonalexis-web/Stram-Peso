const router = require("express").Router();
const { getUsers, getAnalytics } = require("../controllers/adminController");
const { verifyToken, isAdmin } = require("../middleware/auth");

router.get("/users", verifyToken, isAdmin, getUsers);
router.get("/analytics", verifyToken, isAdmin, getAnalytics);

module.exports = router;
