const express = require("express");
const {
  getAllTours,
  getTourById,
  createTour,
  deleteTour,
} = require("../controllers/tourController");
const router = express.Router();

router.route("/").get(getAllTours).post(createTour);
router.route("/:id").get(getTourById).delete(deleteTour);

module.exports = router;
