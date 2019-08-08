const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = `invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicatedFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value `;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token, please try log in again', 401);

const handleJWTExpiredError = () =>
  new AppError('Token expired, please try log in again', 401);

const sendErrorDev = (err, res) =>
  res.status(err.statusCode).json({
    err: err,
    stack: err.stack,
    status: err.status,
    message: err.message
  });

const sendErrorProd = (err, res) => {
  // operational, trusted error, send message to client.
  if (err.isOperational) {
    res.status(err.statusCode).json({
      satus: err.status,
      message: err.message
    });

    // programming or other unkown error, do not leak error detail to client
  } else {
    // eslint-disable-next-line no-console
    console.error('ERROR ', err);

    res.status(500).json({
      status: 'error',
      message: 'something went wrong'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
    return;
  }

  let error = { ...err };
  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicatedFieldsDB(error);
  if (error.name === 'validationError') error = handleValidationErrorDB(error);
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  sendErrorProd(error, res);
};
