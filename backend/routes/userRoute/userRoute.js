const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController/userController");


router.get("/getUser/:id", userController.getUserById);
router.get("/getUsers", userController.getUsers);
router.post("/createUser", userController.createUser);
router.put("/updateUser", userController.updateUser);

module.exports = router;
