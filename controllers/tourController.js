const Tour = require("../models/tourModel");
const { APIFeatures } = require("../utils/apiFeatures");



/*====>    
Desc : Create tour
Route: tours/
Access: private
<====*/

const createTour = async (req, res, next) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(200).json({
      status: "success",
      message: "Tour created successfully",
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Could not create tour",
    });
  }
};

/*====>    
Desc : Fetch all tours from DB
Route: tours/
Access: public
<====*/

const getAllTours = async (req, res, next) => {
  try {
    const features= new APIFeatures(Tour.find(),req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
    const tours = await features.query;
    res.status(200).json({
      status: "success",
      results: tours.length,
      message: "Tours fetched successfully",
      data: tours,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

/*====>    
Desc : Fetch a tour
Route: tours/id
Access: public
<====*/

const getTourById = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.json({
      status: "success",
      message: "Tour fetched successfully",
      data: {
        tour,
      },
    });
  } catch (error) {
    res.json({
      status: "fail",
      message: "Could not fetch tour",
    });
  }
};

/*====>    
Desc : update a tour
Route: tours/id
Access: private
<====*/

const updateTour = async (req, res, next) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({
      status: "success",
      message: "Tour updated successfully",
      data: {
        tour,
      },
    });
  } catch (error) {
    res.json({
      status: "fail",
      message: "Could not update tour",
    });
  }
};

/*====>    
Desc : delete a tour
Route: tours/id
Access: private
<====*/
const deleteTour = async (req, res, next) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.json({
      status: "success",
      message: "Tour deleted successfully",
    });
  } catch (error) {
    res.json({
      status: "fail",
      message: "Could not delete tour",
    });
  }
};





module.exports = {
  createTour,
  getAllTours,
  getTourById,
  updateTour,
  deleteTour,
};
