const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const { 
    register, 
    login, 
    getMe, 
    updateProfile,
    registerEmployer, 
    generateInviteCode, 
    promoteToEmployer 
} = require("../controllers/authController");
const { verifyToken, isAdmin } = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|jpeg|jpg|png/;
    cb(null, allowedTypes.test(file.mimetype));
  }
});

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getMe);
router.patch(
  "/me",
  verifyToken,
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "supportingDocument", maxCount: 1 },
  ]),
  updateProfile
);

router.post("/register/employer", registerEmployer);
router.post("/invite", verifyToken, isAdmin, generateInviteCode);
router.patch("/promote/:userId", verifyToken, isAdmin, promoteToEmployer);

module.exports = router;