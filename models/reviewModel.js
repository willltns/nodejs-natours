const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Review cannot be empty!']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  created: {
    type: Date,
    default: Date.now()
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Review must belong to a tour']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user']
  }
});

reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name'
  });
  next();
});

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.statics.calcAvgRatings = async function(tourId) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: 'tour',
        num: { $sum: 1 },
        avg: { $avg: '$rating' }
      }
    }
  ]);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0] ? stats[0].num : 0,
    ratingsAverage: stats[0] ? stats[0].avg : 4.5
  });
};

reviewSchema.post('save', function() {
  this.constructor.calcAvgRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function(next) {
  const review = await this.findOne();
  this.tourId = review.tour;
  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  this.model.calcAvgRatings(this.tourId); // if findByIdAndDelete, post cannot get the tourId by self.
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
