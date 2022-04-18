const express = require("express");
const router = express.Router();
const issueController = require("../../controllers/issueController/issueController");

router.post("/createTopic", issueController.createTopic);
router.post("/subscribe", issueController.subscribe);
router.post("/publishEmail", issueController.publishEmail);
router.post("/publishText", issueController.publishText);

module.exports = router;
