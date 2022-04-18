const express = require("express");
const router = express.Router();
const requestController = require("../../controllers/requestBloodController/requestBloodController");

console.log("I am requester Router");

router.get("/getRequests/:requesterId", requestController.getAllRequestsByRequester);
router.get("/getRequestByID/:requestId", requestController.getRequestByID);
router.get("/getRequestForDonorID/:donorId", requestController.getAllRequestsForDonor);
router.get("/getAllRequests", requestController.getAllRequests);
router.put("/updateRequestStatus", requestController.updateRequestStatus);
router.post("/createRequests", requestController.createRequests);

module.exports = router;
