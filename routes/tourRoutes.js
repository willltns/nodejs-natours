const express = require('express');

const reviewRouter = require('./reviewRoutes');

const tourCtrl = require('../controllers/tourCtrl');
const authCtrl = require('../controllers/authCtrl');

const router = express.Router();

// router.param('id', tourCtrl.checkId);

router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(tourCtrl.aliasTopTours, tourCtrl.getTours);

router.route('/tour-stats').get(tourCtrl.getTourStats);

router
  .route('/distances/center/:lnglat/unit/:unit')
  .get(tourCtrl.getToursDistances);

router
  .route('/tours-within/:distance/center/:lnglat/unit/:unit')
  .get(tourCtrl.getToursWithin);

router
  .route('/monthly-plan/:year')
  .get(
    authCtrl.protect,
    authCtrl.restrictTo('admin', 'lead-guide', 'guide'),
    tourCtrl.getMonthlyPlan
  );

router
  .route('/')
  .get(tourCtrl.getTours)
  .post(
    authCtrl.protect,
    authCtrl.restrictTo('admin', 'lead-guide'),
    tourCtrl.createTour
  );

router
  .route('/:id')
  .get(tourCtrl.getTour)
  .patch(
    authCtrl.protect,
    authCtrl.restrictTo('admin', 'lead-guide'),
    tourCtrl.uploadTourImages,
    tourCtrl.resizeTourImages,
    tourCtrl.updateTour
  )
  .delete(
    authCtrl.protect,
    authCtrl.restrictTo('admin', 'lead-guide'),
    tourCtrl.deleteTour
  );

module.exports = router;
