const Tour = require("../models/tourModel");

/*====>    
Desc : Create tour
Route: tours/
Access: public
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
  //  BUILD QUERY FOR FILTERING
  let queryObj={...req.query}
  let excludedFields=["sort","page","limit","fields"]
  excludedFields.forEach(el=> delete queryObj[el])

  // Advanced filtering
  let queryStr=JSON.stringify(queryObj)
  queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`)


   let query = Tour.find(JSON.parse(queryStr))

// SORTING
if(req.query.sort){
  const sortBy=req.query.sort.split(',').join(' ')
  query=query.sort(sortBy)
}else{
  query = query.sort('-createdAt') // newest to oldest
}


    const tours = await query;

    res.status(200).json({
      status: "success",
      results: tours.length,
      message: "Tours fetched successfully",
      data: tours,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Tours fetch failed",
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
