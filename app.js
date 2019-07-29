const fs = require('fs');
const express = require('express');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const app = express();

app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('index!');
// });

const getTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
};

const getTour = (req, res) => {
  const id = +req.params.id;
  const tour = tours.find(tour => tour.id === id);

  if (!tour) {
    res.status(404).json({
      status: 'fail',
      message: 'invalid ID'
    });
    return;
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
};

const createTour = (req, res) => {
  const tour = req.body;
  const tourId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: tourId }, tour);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
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

const updateTour = (req, res) => {
  const id = +req.params.id;
  const tour = tours.find(tour => tour.id === id);

  if (!tour) {
    res.status(404).json({
      status: 'fail',
      message: 'invalid ID'
    });
    return;
  }
  res.status(200).json({
    status: 'success',
    data: '<updated tour here...>'
  });
};

const deleteTour = (req, res) => {
  const id = +req.params.id;
  const tour = tours.find(tour => tour.id === id);

  if (!tour) {
    res.status(404).json({
      status: 'fail',
      message: 'invalid ID'
    });
    return;
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
};

app
  .route('/api/v1/tours')
  .get(getTours)
  .post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.listen(3322, () => {
  console.log('Server ready on http://localhost:3322');
});
