const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');

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

const tours = fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8');

const importData = async () => {
  await Tour.create(JSON.parse(tours));
  // eslint-disable-next-line no-console
  console.log('data successfully imported!');
  process.exit();
};

const deleteData = async () => {
  await Tour.deleteMany();
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
