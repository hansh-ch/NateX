const mongoose = require("mongoose");
const slugify=require("slugify")

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour name is required"],
    unique: true,
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
  },
  ratingsAverage: {
    type: Number,
    default: 4.3,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "A tour must have price"],
  },
  priceDiscount: Number,
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
  startDates: [Date],
});


// MIDDLEWARES

//=>> Adding slug to each docs
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true }); 
  next();
});

const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
