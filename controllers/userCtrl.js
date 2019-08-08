const asyncCatch = require('../utils/asyncCatch');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

exports.getUsers = asyncCatch(async (req, res) => {
  const user = await User.find();

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined'
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined'
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined'
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined'
  });
};

exports.updateMe = asyncCatch(async (req, res, next) => {
  if (req.body.password)
    return next(new AppError('This is the wrong place to modify password'));

  const filteredObj = {};
  const allowFields = ['name', 'email'];
  Object.keys(req.body).forEach(key => {
    if (allowFields.includes(key)) filteredObj[key] = req.body[key];
  });

  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredObj, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = asyncCatch(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});
