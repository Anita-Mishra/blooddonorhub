const express = require('express');
const router = express.Router();

const userRoutes = require("./userRoute/userRoute");
const donorRoutes = require("./donorRoute/donorRoute");
const requestsRoutes = require("./requestsRoute/requestsRoute");
const issueRoutes = require("./issueRoute/issueRoute");

console.log("I am root router");
router.use("/user",userRoutes);
router.use("/donor",donorRoutes);
router.use("/requests",requestsRoutes);
router.use("/issue",issueRoutes);

module.exports = router;