const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkId = (req, res, next, id) => {
  const tour = tours.find(item => item.id === +id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid ID'
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  const tour = req.body;
  if (!tour.name) {
    return res.status(400).json({
      status: 'fail',
      message: 'missing name'
    });
  }
  next();
};

exports.getTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
};

exports.getTour = (req, res) => {
  const id = +req.params.id;
  const tour = tours.find(item => item.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
};

exports.createTour = (req, res) => {
  const tour = req.body;
  const tourId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: tourId }, tour);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      if (err) {
        res.status(500).send('error');
        return;
      }

      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  );
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: '<updated tour here...>'
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null
  });
};
