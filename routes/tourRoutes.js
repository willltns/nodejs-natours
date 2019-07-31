const express = require('express');

const ctrl = require('../controllers/tourCtrl');

const router = express.Router();

router.param('id', ctrl.checkId);

router
  .route('/')
  .get(ctrl.getTours)
  .post(ctrl.checkBody, ctrl.createTour);

router
  .route('/:id')
  .get(ctrl.getTour)
  .patch(ctrl.updateTour)
  .delete(ctrl.deleteTour);

module.exports = router;
