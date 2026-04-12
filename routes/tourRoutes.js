const express = require("express");
const {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
  getToursStats,
  getMontlyTours,
} = require("../controllers/tourController");
const { protectAuth, restrictTo } = require("../controllers/authController");
const { aliasTopTours } = require("../middlewares/tourMiddleware");
const router = express.Router();

router.route("/top-5-cheap").get(aliasTopTours, getAllTours)
router.route("/stats").get(getToursStats);
router.route("/monthly-tours/:year").get(getMontlyTours);

router.route("/").get(protectAuth, restrictTo("user", "lead-guide"), getAllTours).post(createTour);
router.route("/:id").get(getTourById).delete(protectAuth, restrictTo("admin", "lead-guide"), deleteTour).patch(updateTour);


module.exports = router;