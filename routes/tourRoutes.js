const express = require("express");
const { getAllTours, getTour } = require("../controllers/tourController");
const router = express.Router();

router.route("/").get(getAllTours);
router.route("/:id").get(getTour);

module.exports = router;
