const express = require('express');

const ctrl = require('../controllers/tourCtrl');

const router = express.Router();

// router.param('id', ctrl.checkId);

router
  .route('/')
  .get(ctrl.getTours)
  .post(ctrl.createTour);

router.route('/top-5-cheap').get(ctrl.aliasTopTours, ctrl.getTours);

router.route('/tour-stats').get(ctrl.getTourStats);

router.route('/monthly-plan/:year').get(ctrl.getMonthlyPlan);

router
  .route('/:id')
  .get(ctrl.getTour)
  .patch(ctrl.updateTour)
  .delete(ctrl.deleteTour);

module.exports = router;
