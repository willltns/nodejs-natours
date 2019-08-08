const express = require('express');

const tourCtrl = require('../controllers/tourCtrl');
const authCtrl = require('../controllers/authCtrl');

const router = express.Router();

// router.param('id', tourCtrl.checkId);

router
  .route('/')
  .get(authCtrl.protect, tourCtrl.getTours)
  .post(tourCtrl.createTour);

router.route('/top-5-cheap').get(tourCtrl.aliasTopTours, tourCtrl.getTours);

router.route('/tour-stats').get(tourCtrl.getTourStats);

router.route('/monthly-plan/:year').get(tourCtrl.getMonthlyPlan);

router
  .route('/:id')
  .get(tourCtrl.getTour)
  .patch(tourCtrl.updateTour)
  .delete(authCtrl.protect, authCtrl.restrictTo('admin'), tourCtrl.deleteTour);

module.exports = router;
