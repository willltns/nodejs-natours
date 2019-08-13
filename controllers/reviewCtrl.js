const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

// before createReview middleware
exports.setTourUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;
  if (!req.body.tour) req.body.tour = req.params.tourId;
  next();
};

exports.createReview = factory.createOne(Review);

exports.getReview = factory.getOne(Review);

exports.getAllReviews = factory.getAll(Review);

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);
