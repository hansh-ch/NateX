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

/*====>    
Desc : Get tours stats using aggregate method
Route: /stats
Access: public
<====*/
const getToursStats = async (req,res,next) => {
  try {
    console.log("object")
    const stats= await Tour.aggregate([
      // Filter documents with ratingsAverage criteria
     {$match: { ratingsAverage: { $gte: 4.5 }}},
     {  $group:{
          _id:{ $toUpper: '$difficulty' },
          num:{$sum:1},
          numRatings:{$sum:"$ratingsQuantity"},
          avgRating: {$avg:"$ratingsAverage"},
          avgPrice: {$avg:"$price"},
          minPrice: {$min:"$price"},
          maxPrice: {$max:"$price"},
     }},
     {
      $sort:{
        avgPrice:1   //ascending order
      }
     }
    ]);

    res.json({
      status: "success",
      message: "Stats fetched successfully",
      data:{
        stats
      }
    });
  } catch (error) {

    res.json({
      status: "fail",
      message: "Fetching failed",
    });

   
  }
}

/*====>    
Desc : Count how many tours are there in each month of a year
Route: /monthly-tours/:year
Access: public
<====*/
const getMontlyTours=async (req,res,next) => {
  try {
    const year=req.params.year * 1 ;
    const plan= await Tour.aggregate([
      {
        $unwind:"$startDates"
      },
      {
        $match:{
          startDates:{
            $gte: new Date(`${year}-01-01`).toISOString(),
            $lte: new Date(`${year}-12-31`).toISOString(),
          }
        }
      },
      {
        $group:{
          _id: { $month: { $toDate: '$startDates' } },
           numTours:{$sum:1},
           tours:{$push:"$name"}
        }
      },
      {
        $addFields:{month:"$_id"}
      },
      {
        $project:{_id:0}
      },
      {
        $sort:{numTours:-1} 
      }
    ])

    res.json({
      status: "success",
      message: "Fetched successfully",
      data:{
        plan
      }
    });
  } catch (error) {
    res.json({
      status: "fail",
      message: "Fetching failed",
    });
  }
}





module.exports = {
  createTour,
  getAllTours,
  getTourById,
  updateTour,
  deleteTour,
  getToursStats,
  getMontlyTours
};
