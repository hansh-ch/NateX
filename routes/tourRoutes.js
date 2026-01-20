const express = require("express");
const {
  getAllTours,
  getTourById,
  createTour,
  deleteTour,
} = require("../controllers/tourController");
const { aliasTopTours } = require("../middlewares/tourMiddleware");
const router = express.Router();

router.route("/top-5-cheap").get(aliasTopTours,getAllTours)

router.route("/").get(getAllTours).post(createTour);
router.route("/:id").get(getTourById).delete(deleteTour);

module.exports = router;
