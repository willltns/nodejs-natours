const dotenv = require('dotenv');
const mongoose = require('mongoose');

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

const app = require('./app');

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server ready on http://localhost:${port}`);
});

// -------------------------------------------------------

process.on('unhandledRejection', err => {
  // eslint-disable-next-line no-console
  console.log(err.name, err.message);

  server.close(() => process.exit(1));
});

// should be put before where any code is executed
process.on('uncaughtException', err => {
  // eslint-disable-next-line no-console
  console.log(err.name, err.message);

  process.exit(1);
});
