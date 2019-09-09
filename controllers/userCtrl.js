const asyncCatch = require('../utils/asyncCatch');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
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

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined. please use /signup to create'
  });
};

exports.getUser = factory.getOne(User);

exports.getUsers = factory.getAll(User);

// warning!! DO NOT modify password
exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);

// inject current user id to req.params middleware
exports.getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = asyncCatch(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

exports.updateMe = asyncCatch(async (req, res, next) => {
  if (req.body.password)
    return next(new AppError('This is the wrong place to modify password'));

  const filteredObj = {};
  const allowFields = ['name', 'email'];
  Object.keys(req.body).forEach(key => {
    if (allowFields.includes(key)) filteredObj[key] = req.body[key];
  });
  if (req.file) filteredObj.photo = req.file.filename;

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
