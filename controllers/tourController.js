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
  excludedFields.forEach(el=> delete queryObj[el]) // remove excluded fields from query object so than we can chain these as they are provided , not all at one go

  // Advanced filtering
  let queryStr=JSON.stringify(queryObj)
  queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`)


   let query = Tour.find(JSON.parse(queryStr))

// SORTING ==> => { sort: 'sort1,sort2,sort3' }
if(req.query.sort){
  const sortBy=req.query.sort.split(',').join(' ')
  query=query.sort(sortBy)
}else{
  query = query.sort('-createdAt') // newest to oldest
}

// FIELD LIMITING => { fields: 'field1,field2,field3' }
if(req.query.fields){
  const fields=req.query.fields.split(',').join(' ')
  query=query.select(fields)
}else{
  query=query.select('-__v') // exclude __v field from the response
}
// console.log(req.query.fields)


// PAGINATION=> page 0=1-10 , page 2=11-20 (skip 10), page 3 =21-30(skip-20) so on

let page =  (req.query.page*1)||1  // multiply by 1 converts to number
let limit= (req.query.limit*1)|| 100
let skip= (page-1)*limit;
query = query.skip(skip).limit(limit)

// Preventing if page increases and already finished fetching/displaying all docs from DB
if(req.query.page){
  const numDocuments=await Tour.countDocuments()
  if(skip >= numDocuments) throw new Error("This page doesn't exist")
}
// Executing query
    const tours = await query;

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
