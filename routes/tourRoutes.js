const express = require("express");
const {
  getAllTours,
  getTourById,
  createTour,
  deleteTour,
  getToursStats,
  getMontlyTours,
} = require("../controllers/tourController");
const { aliasTopTours } = require("../middlewares/tourMiddleware");
const router = express.Router();

router.route("/top-5-cheap").get(aliasTopTours,getAllTours)
router.route("/stats").get(getToursStats);
router.route("/monthly-tours/:year").get(getMontlyTours);

router.route("/").get(getAllTours).post(createTour);
router.route("/:id").get(getTourById).delete(deleteTour);


module.exports = router;
