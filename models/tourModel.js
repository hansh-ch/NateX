const mongoose = require("mongoose");
const slugify=require("slugify")

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour name is required"],
    unique: true,
    trim: true,
    maxLength:[42, "A tour must have name less than or equal to 42 chars"],
    minLength:[10, "A tour must have name greater than or equal to 10 chars"]
  },
  slug:String,
  duration: {
    type: Number,
    required: [true, "A tour must have duration"],
  },
  maxGroupSize: {
    type: Number,
    required: [true, "A tour must have group size"],
  },
  difficulty: {
    type: String,
    required: [true, "A tour must have difficulty"],
    enum:{
      values:["difficult","medium","easy"],
      message:"Difficulty is either easy or medium or difficult"
    }
  },
  ratingsAverage: {
    type: Number,
    default: 3,
    min: [1,"Rating must be greater than or equal to 1"],
    max: [5,"Rating must be less than or equal to 5"]
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "A tour must have price"],
  },
  priceDiscount: {
    type:Number,
    validate:{
      validator: function(val){
        return val<this.price;
      },
    message: 'Discount price  ({VALUE})  should be less than regular price'
    }
  },
  summary: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, "A tour must have cover image"],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date]
})


// MIDDLEWARES

//=>> Adding slug to each docs
tourSchema.pre('save', async function () {
  this.slug = slugify(this.name, { lower: true }); 
});

const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
