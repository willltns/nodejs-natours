const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const AppError = require('../utils/appError');
const User = require('../models/userModel');
const asyncCatch = require('../utils/asyncCatch');

const signToken = id =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

const responseWithToken = (id, statusCode, res) => {
  const token = signToken(id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token
  });
};

exports.signup = asyncCatch(async (req, res, next) => {
  const user = await User.create(req.body);

  responseWithToken(user._id, 201, res);
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

  responseWithToken(user._id, 200, res);
});

exports.protect = asyncCatch(async (req, res, next) => {
  // 1) check if token exists
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer')
  )
    return next(
      new AppError('You are not logged in, please log in to get access', 401)
    );

  // 2) check if token valid
  const token = req.headers.authorization.split(' ')[1];
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) check if user exists
  const freshUser = await User.findById(decoded.id);

  if (!freshUser) return next(new AppError('user not exists', 401));

  // 4) check if password changed
  if (freshUser.checkPswIfChanged(decoded.iat)) {
    return next(new AppError('password has been changed', 401));
  }

  // grant access to protected route
  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return next(new AppError('You are fobiddened to operate', 403));

  next();
};

exports.updateMyPassword = asyncCatch(async (req, res, next) => {
  // 1) get currentPassword
  const user = await User.findById(req.user._id).select('+password');
  // 2) check if pswCur correct
  const isCorrect = await user.verifyPsw(
    req.body.passwordCurrent,
    user.password
  );
  // 3) if not correct, pass error
  if (!isCorrect)
    return next(new AppError('Your current password is wrong', 401));

  // 4) save new password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will not work as intended!

  // 5) update jwt
  responseWithToken(user._id, 200, res);
});
