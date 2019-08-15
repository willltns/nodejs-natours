const asyncCatch = require('../utils/asyncCatch');
const AppError = require('../utils/appError');
const ApiFeature = require('../utils/apiFeature');

exports.createOne = Model =>
  asyncCatch(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { data: doc }
    });
  });

exports.getOne = (Model, populateOpts) =>
  asyncCatch(async (req, res, next) => {
    const query = Model.findById(req.params.id);
    if (populateOpts) query.populate(populateOpts);
    const doc = await query;

    if (!doc) {
      return next(new AppError('no document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { data: doc }
    });
  });

exports.getAll = Model =>
  asyncCatch(async (req, res) => {
    // to allow for nested GET reviews on tour
    const filter = {};
    if (req.params.tourId) filter.tour = req.params.tourId;

    const query = Model.find(filter);
    new ApiFeature(query, req.query)
      .select()
      .filter()
      .sortQ()
      .paginate();

    // const doc = await query.explain();
    const doc = await query;

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: { data: doc }
    });
  });

exports.updateOne = Model =>
  asyncCatch(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new AppError('no tour found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { data: doc }
    });
  });

exports.deleteOne = Model =>
  asyncCatch(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc)
      return next(new AppError('cannot find document from that ID', 404));

    res.status(204).json({
      status: 'success',
      data: null
    });
  });
