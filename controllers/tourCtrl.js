const Tour = require('../models/tourModel');
const ApiFeature = require('../utils/apiFeature');
const acyncCatch = require('../utils/asyncCatch');
const AppError = require('../utils/appError');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = 'price,-ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getTours = acyncCatch(async (req, res) => {
  const query = Tour.find();

  const apiFeature = new ApiFeature(query, req.query)
    .select()
    .filter()
    .sortQ()
    .paginate();

  const tours = await apiFeature.query;

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours }
  });
});

exports.getTour = acyncCatch(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  // Tour.findOne({ _id: req.params.id })

  if (!tour) {
    return next(new AppError('no tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { tour }
  });
});

exports.createTour = acyncCatch(async (req, res) => {
  const tour = req.body;
  const newTour = await Tour.create(tour);
  res.status(201).json({
    status: 'success',
    data: { tour: newTour }
  });
});

exports.updateTour = acyncCatch(async (req, res, next) => {
  const tour = req.body;
  const { id } = req.params;
  const newTour = await Tour.findByIdAndUpdate(id, tour, {
    new: true,
    runValidators: true
  });

  if (!tour) {
    return next(new AppError('no tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { tour: newTour }
  });
});

exports.deleteTour = acyncCatch(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('no tour found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getTourStats = acyncCatch(async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        avgRating: { $avg: '$ratingsAverage' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        numTours: { $sum: 1 }
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: { stats }
  });
});

exports.getMonthlyPlan = acyncCatch(async (req, res) => {
  const { year } = req.params;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: `$startDates` },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: { _id: 0 }
    },
    {
      $sort: { numTourStarts: -1 }
    },
    {
      $limit: 12
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: { plan }
  });
});
