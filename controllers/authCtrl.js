const jwt = require('jsonwebtoken');

const AppError = require('../utils/appError');
const User = require('../models/userModel');
const asyncCatch = require('../utils/asyncCatch');

const signToken = id =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

exports.signup = asyncCatch(async (req, res, next) => {
  const user = await User.create(req.body);

  const token = signToken(user._id);

  res.status(201).json({
    status: 'success',
    token
  });
});

exports.login = asyncCatch(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password'), 400);
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.verifyPsw(password, user.password))) {
    return next(new AppError('Incorrect email or password'), 401);
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token
  });
});
