/*====>    
Desc : Fetch all tours from DB
Route: tours/
Access: public
<====*/

const getAllTours = (req, res, next) => {
  res.json({
    status: "success",
    message: "Tours fetched successfully",
  });
};

/*====>    
Desc : Fetch a tour
Route: tours/id
Access: public
<====*/

const getTour = (req, res, next) => {
  res.json({
    status: "success",
    message: "Tour fetched successfully",
  });
};

module.exports = { getAllTours, getTour };
