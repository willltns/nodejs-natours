const express = require('express');

const authCtrl = require('../controllers/authCtrl');
const reviewCtrl = require('../controllers/reviewCtrl');

const router = express.Router({ mergeParams: true });

router.use(authCtrl.protect);

router
  .route('/')
  .get(reviewCtrl.getAllReviews)
  .post(
    authCtrl.restrictTo('user'),
    reviewCtrl.setTourUserId,
    reviewCtrl.createReview
  );

router
  .route('/:id')
  .get(reviewCtrl.getReview)
  .patch(authCtrl.restrictTo('user', 'admin'), reviewCtrl.updateReview)
  .delete(authCtrl.restrictTo('user', 'admin'), reviewCtrl.deleteReview);

module.exports = router;
