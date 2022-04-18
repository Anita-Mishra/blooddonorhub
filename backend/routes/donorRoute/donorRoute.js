const express = require("express");
const router = express.Router();
const donorController = require("../../controllers/donorController/donorController");

console.log("I am donor Router");

router.get("/getDonorById/:id", donorController.getDonorById);
router.get("/getDonors", donorController.getDonors);
//router.get("/deleteUser", registerUserController.deleteUser);
//router.get("/getUser", registerUserController.deleteUser);
//router.get("/getUsers", registerUserController.deleteUser);
 
module.exports = router;
