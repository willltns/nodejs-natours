const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const asyncCatch = require('../utils/asyncCatch');
const factory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);

exports.resizeTourImages = asyncCatch(async (req, res, next) => {
  if (req.files.imageCover) {
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/tours/${req.body.imageCover}`);
  }

  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (image, index) => {
        req.body.images.push(
          `tour-${req.params.id}-${Date.now()}-${index + 1}.jpeg`
        );

        await sharp(image.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/tours/${req.body.images[index]}`);
      })
    );
  }

  next();
});

exports.createTour = factory.createOne(Tour);

exports.getTour = factory.getOne(Tour, 'reviews');

exports.getTours = factory.getAll(Tour);

exports.updateTour = factory.updateOne(Tour);

exports.deleteTour = factory.deleteOne(Tour);

exports.getToursDistances = asyncCatch(async (req, res, next) => {
  const { lnglat, unit } = req.params;
  const [lng, lat] = lnglat.split(',');

  if (!lng || !lat)
    return next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.'
      ),
      400
    );
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  // TODO - ERROR
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [+lng, +lat]
        },
        key: 'startLocation',
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        name: 1,
        distance: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      tours: distances
    }
  });
});

exports.getToursWithin = asyncCatch(async (req, res, next) => {
  const { distance, lnglat, unit } = req.params;
  const [lng, lat] = lnglat.split(',');

  if (!lng || !lat)
    return next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.'
      ),
      400
    );
  const radians = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radians] } }
  });

  res.status(200).json({
    status: 'success',
    data: {
      tours
    }
  });
});

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = 'price,-ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getTourStats = asyncCatch(async (req, res) => {
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

exports.getMonthlyPlan = asyncCatch(async (req, res) => {
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
