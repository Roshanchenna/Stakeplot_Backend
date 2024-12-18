const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

router.post("/", transactionController.createProfile);

router.get("/", transactionController.getDetails);

module.exports = router;