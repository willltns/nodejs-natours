const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);
mongoose
  .connect(DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
  })
  // eslint-disable-next-line no-console
  .then(() => console.log('database connected!'));

const tours = fs.readFileSync(`${__dirname}/tours.json`, 'utf-8');
const users = fs.readFileSync(`${__dirname}/users.json`, 'utf-8');
const reviews = fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8');

const importData = async () => {
  await Tour.create(JSON.parse(tours));
  await User.create(JSON.parse(users), { validateBeforeSave: false });
  await Review.create(JSON.parse(reviews));
  // eslint-disable-next-line no-console
  console.log('data successfully imported!');
  process.exit();
};

const deleteData = async () => {
  await Tour.deleteMany();
  await User.deleteMany();
  await Review.deleteMany();
  // eslint-disable-next-line no-console
  console.log('data successfully deleted!');
  process.exit();
};

if (process.argv[2] === '--i') {
  importData();
}

if (process.argv[2] === '--d') {
  deleteData();
}
