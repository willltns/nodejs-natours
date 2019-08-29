const express = require('express');

const userCtrl = require('../controllers/userCtrl');
const authCtrl = require('../controllers/authCtrl');

const router = express.Router();

router.post('/signup', authCtrl.signup);

router.post('/login', authCtrl.login);
router.get('/logout', authCtrl.logout);

// Protect all routes after this middleware
router.use(authCtrl.protect);

router.patch('/updateMyPassword', authCtrl.updateMyPassword);
router.get('/me', userCtrl.getMe, userCtrl.getUser);
router.patch('/updateMe', userCtrl.updateMe);
router.delete('/deleteMe', userCtrl.deleteMe);

// restrict access routes after this middleware
router.use(authCtrl.restrictTo('admin'));

router
  .route('/')
  .get(userCtrl.getUsers)
  .post(userCtrl.createUser);

router
  .route('/:id')
  .get(userCtrl.getUser)
  .patch(userCtrl.updateUser)
  .delete(authCtrl.restrictTo('admin'), userCtrl.deleteUser);

module.exports = router;
